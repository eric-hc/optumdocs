import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { StatsD } from 'hot-shots';

import { CommunityService } from '../communities/community.service';
import { ContributorEntity } from '../contributors/contributor.entity';
import { ContributorService } from '../contributors/contributor.service';
import { PullRequestService } from '../contributors/pullrequest.service';

@Controller('metrics')
@ApiUseTags('metrics')
export class MetricsController implements CrudController<ContributorEntity> {
    constructor(
        public service: ContributorService,
        public communityService: CommunityService,
        public pullrequestService: PullRequestService,
        public contributorService: ContributorService,
    ) {}
    private _client = new StatsD({
        host: '', // telegraph database hostname
        port: 8126,
    });
    get base(): CrudController<ContributorEntity> {
        return this;
    }
    @UseInterceptors(CrudRequestInterceptor)
    @Get('/pullrequests/weekly')
    async getPullRequestsWeekly() {
        return this.pullrequestService.db
            .createQueryBuilder('pr')
            .select("date_trunc('week', pr.merged_at)", 'week')
            .addSelect('COUNT(*)', 'count')
            .where("pr.pr_state ='MERGED'")
            .groupBy("date_trunc('week', pr.merged_at)")
            .orderBy("date_trunc('week', pr.merged_at)")
            .getRawMany();
    }
    @UseInterceptors(CrudRequestInterceptor)
    @Get('/contributor/count')
    async getContributorCount() {
        const contributorCount = await this.contributorService.db
            .createQueryBuilder('c')
            .select('COUNT(*)', 'count')
            .getCount();

        // send the count to telegraph
        this._client.gauge('OSPO_ContributorCount', contributorCount);

        return contributorCount;
    }
    @UseInterceptors(CrudRequestInterceptor)
    @Get('/community/count')
    async getCommunityCount() {
        const communityCount = await this.communityService.db
            .createQueryBuilder('c')
            .select('COUNT(*)', 'count')
            .getCount();

        // send the count to telegraph
        this._client.gauge('OSPO_CommunityCount', communityCount);

        return communityCount;
    }
    @UseInterceptors(CrudRequestInterceptor)
    @Get('/pullRequests/count')
    async getPullRequestsCount() {
        const prCount = await this.pullrequestService.db
            .createQueryBuilder('c')
            .select('COUNT(*)', 'count')
            .getCount();

        // send the count to telegraph
        this._client.gauge('OSPO_PullRequestCount', prCount);

        return prCount;
    }
}
