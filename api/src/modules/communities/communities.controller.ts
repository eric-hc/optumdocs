import { Controller, Logger, Post, UseInterceptors } from '@nestjs/common';
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

import { GitHubService } from './../../shared/services/github.service';
import { CommunityEntity } from './community.entity';
import { CommunityService } from './community.service';

@Crud({
    model: {
        type: CommunityEntity,
    },
    query: {
        join: {
            // eslint-disable-next-line quote-props
            pullRequests: {
                eager: true,
            },
            'pullRequests.contributor': { eager: true },
        },
    },
})
@Controller('communities')
@ApiUseTags('communities')
export class CommunitiesController implements CrudController<CommunityEntity> {
    constructor(
        public service: CommunityService,
        public gitHubService: GitHubService,
    ) {}

    get base(): CrudController<CommunityEntity> {
        return this;
    }
    private _logger = new Logger();
    private _tmpDir = tmp.dirSync({ unsafeCleanup: true });

    @UseInterceptors(CrudRequestInterceptor)
    @Post('/importUpstream')
    async importUpstream(@ParsedRequest() req: CrudRequest) {
        let communities = [];
        const regex = new RegExp(
            'https://github.com/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*',
            'g',
        );
        await axios({
            url:
                'https://optum.github.io/main/optumdocs/Approved-Communities.md',
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = response.data.match(regex);
            communities = Array.from(
                new Set(
                    url.map((x) =>
                        typeof x === 'string' ? x.toLowerCase() : x,
                    ),
                ),
            );
            for (const match of communities) {
                Logger.log('url = ' + match);
            }
        });

        for (const repo of communities) {
            const found = await this.service.findOne({
                where: { githubRepository: repo },
            });
            const slice = String(repo);
            const s = slice.split('/');
            if (!found) {
                const community = new CommunityEntity();
                community.githubRepository = repo;
                community.organization = s[3];
                community.repository = s[4];
                await this.service.createOne(req, community);
            } else {
                try {
                    const githubrepo = await graphql(
                        `
                            query repository($owner: String!, $repo: String!) {
                                repository(owner: $owner, name: $repo) {
                                    description
                                    stargazers {
                                        totalCount
                                    }
                                    issues {
                                        totalCount
                                    }
                                    forks {
                                        totalCount
                                    }
                                    watchers {
                                        totalCount
                                    }
                                }
                            }
                        `,
                        {
                            owner: found.organization,
                            repo: found.repository,
                            headers: {
                                authorization:
                                    'Token ' + process.env.barista_github_token,
                            },
                        },
                    );
                    found.description = githubrepo.repository.description;
                    found.stars = githubrepo.repository.stargazers.totalCount;
                    found.issues = githubrepo.repository.issues.totalCount;
                    found.forks = githubrepo.repository.forks.totalCount;
                    found.watchers = githubrepo.repository.watchers.totalCount;
                    Logger.log(githubrepo);
                } catch (error) {
                    Logger.error(error.message);
                }
                await this.service.db.save(found);
            }
        }
        await this.pushCommunityJson(req);
    }
    async pushCommunityJson(req: CrudRequest) {
        const gitTmpDir = await this.gitHubService.checkoutBranch(
            'https://github.com/Optum/optum.github.io',
            'gh-pages-source',
            this._tmpDir.name,
        );

        const communities = <CommunityEntity[]>await this.base.getManyBase(req);
        const data = JSON.stringify(
            _.sortBy(communities, ['organization', 'repository']),
        );

        await fs.writeFileSync(
            path.join(gitTmpDir, '/optumdocs/communities.json'),
            data,
        );
        await this.gitHubService.gitCommitandPush(
            'https://github.com/Optum/optum.github.io',
            gitTmpDir,
            'Update communities.json',
        );
    }
}
