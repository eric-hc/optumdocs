import {
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
    Crud,
    CrudController,
    CrudRequest,
    CrudRequestInterceptor,
    ParsedRequest,
} from '@nestjsx/crud';
import { graphql } from '@octokit/graphql';
import axios from 'axios';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as tmp from 'tmp';

import { CommunityEntity } from '../communities/community.entity';
import { CommunityService } from '../communities/community.service';
import { GitHubService } from './../../shared/services/github.service';
import { ContributorEntity } from './contributor.entity';
import { ContributorService } from './contributor.service';
import { PullRequestEntity } from './pullrequest.entity';
import { PullRequestService } from './pullrequest.service';

@Crud({
    model: {
        type: ContributorEntity,
    },
    query: {
        join: {
            // eslint-disable-next-line quote-props
            pullRequests: {
                eager: true,
            },
            'pullRequests.communityRepository': { eager: true },
        },
    },
})
@Controller('contributors')
@ApiUseTags('contributors')
export class ContributorsController
    implements CrudController<ContributorEntity> {
    constructor(
        public service: ContributorService,
        public communityService: CommunityService,
        public pullrequestService: PullRequestService,
        public contributorService: ContributorService,
        public gitHubService: GitHubService,
    ) {}
    private _logger = new Logger();
    get base(): CrudController<ContributorEntity> {
        return this;
    }

    @UseInterceptors(CrudRequestInterceptor)
    @Post('/importUpstream')
    async importUpstream(@ParsedRequest() req: CrudRequest) {
        let contributors = [];
        await axios({
            url:
                'https://optum.github.io/raw/master/optumdocs/contributors.txt',
            method: 'GET',
            responseType: 'blob', // important
        }).then(response => {
            contributors = response.data.split('\n').filter(Boolean);
        });
        for (const user of contributors) {
            try {
                const found = await this.service.findOne({
                    where: { githubUsername: user },
                });
                const userGithub = await graphql(
                    `
                        query pullrequests($login: String!) {
                            user(login: $login) {
                                login
                                name
                                location
                                avatarUrl
                            }
                        }
                    `,
                    {
                        login: user,
                        headers: {
                            authorization:
                                'Token ' + process.env.barista_github_token,
                        },
                    },
                );
                Logger.log(userGithub);
                if (!found) {
                    const contrib = new ContributorEntity();
                    contrib.githubUsername = user;
                    contrib.name = userGithub.user.name;
                    contrib.location = userGithub.user.location;
                    contrib.avatarUrl = userGithub.user.avatarUrl;
                    Logger.log(user);
                    await this.service.createOne(req, contrib);
                } else {
                    found.name = userGithub.user.name;
                    found.location = userGithub.user.location;
                    found.avatarUrl = userGithub.user.avatarUrl;
                    Logger.error(found);
                    await this.service.db.save(found);
                }
            } catch (error) {
                Logger.error(`*** command ERROR: ${error} `);
            }
        }
    }

    @UseInterceptors(CrudRequestInterceptor)
    @Post('pullrequests')
    @HttpCode(HttpStatus.OK)
    async updatepullrequests(@ParsedRequest() req: CrudRequest) {
        const contributors = <ContributorEntity[]>(
            await this.service.getMany(req)
        );

        const communities = <CommunityEntity[]>(
            await this.communityService.getMany(req)
        );

        const prs = [];
        for (const contributor of contributors) {
            try {
                const pr = await graphql(
                    `
                        query pullrequests($login: String!) {
                            user(login: $login) {
                                login
                                name
                                pullRequests(
                                    last: 100
                                    states: [OPEN, MERGED]
                                ) {
                                    nodes {
                                        mergedAt
                                        repository {
                                            name
                                            owner {
                                                login
                                            }
                                            url
                                        }
                                        title
                                        url
                                        state
                                        number
                                    }
                                }
                            }
                        }
                    `,
                    {
                        login: contributor.githubUsername,
                        headers: {
                            authorization:
                                'Token ' + process.env.barista_github_token,
                        },
                    },
                );
                for (const pullrequest of pr.user.pullRequests.nodes) {
                    const community = communities.filter(
                        c =>
                            c.githubRepository ===
                            pullrequest.repository.url.toLowerCase(),
                    );
                    if (community.length > 0) {
                        const foundPR = await this.pullrequestService.findOne({
                            where: {
                                contributor,
                                communityRepository: community[0],
                                number: pullrequest.number,
                            },
                        });

                        if (!foundPR) {
                            const createPr = new PullRequestEntity();
                            createPr.communityRepository = community[0];
                            createPr.contributor = contributor;
                            createPr.number = pullrequest.number;
                            createPr.title = pullrequest.title;
                            createPr.prState = pullrequest.state;
                            createPr.mergedAt = pullrequest.mergedAt;
                            await this.pullrequestService.createOne(
                                req,
                                createPr,
                            );
                            Logger.log(
                                'Create PR = CommunityID = ' +
                                    community[0].id +
                                    'ContributorID = ' +
                                    contributor.id +
                                    'PRNumber = ' +
                                    pullrequest.number +
                                    'MergedAt = ' +
                                    pullrequest.mergedAt,
                            );
                        } else {
                            Logger.log(
                                'Not Found = CommunityID = ' +
                                    community[0].id +
                                    'ContributorID = ' +
                                    contributor.id +
                                    'PRNumber = ' +
                                    pullrequest.number +
                                    'MergedAt = ' +
                                    pullrequest.mergedAt,
                            );
                        }
                    } else {
                        Logger.log(
                            'Not Found = ' +
                                pullrequest.repository.url.toLowerCase(),
                        );
                    }
                }

                prs.push(pr);
            } catch (error) {
                Logger.error(`*** command ERROR: ${error} `);
            }

            // const p = pr.user.pullRequests.nodes[0].title;
            // Logger.log(p);
        }
        await this.pushContributorJson(req);
        return prs;
    }

    async pushContributorJson(req: CrudRequest) {
        const tmpDir = tmp.dirSync({ unsafeCleanup: true });
        const gitTmpDir = await this.gitHubService.checkoutBranch(
            'https://github.com/Optum/optum.github.io',
            'gh-pages-source',
            tmpDir.name,
        );
        const contributors = <ContributorEntity[]>(
            await this.base.getManyBase(req)
        );
        const data = JSON.stringify(_.sortBy(contributors, ['githubUsername']));

        await fs.writeFileSync(
            path.join(gitTmpDir, '/optumdocs/contributors.json'),
            data,
        );
        await this.gitHubService.gitCommitandPush(
            'https://github.com/Optum/optum.github.io',
            gitTmpDir,
            'Update contributors.json',
        );
        tmpDir.removeCallback();
    }
}
