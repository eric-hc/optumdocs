import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunityEntity } from '../communities/community.entity';
import { CommunityService } from '../communities/community.service';
import { ContributorEntity } from '../contributors/contributor.entity';
import { ContributorService } from '../contributors/contributor.service';
import { PullRequestEntity } from '../contributors/pullrequest.entity';
import { PullRequestService } from '../contributors/pullrequest.service';
import { MetricsController } from '../metrics/metrics.controller';
import { MetricsEntity } from './metrics.entity';
import { MetricsService } from './metrics.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ContributorEntity]),
        TypeOrmModule.forFeature([CommunityEntity]),
        TypeOrmModule.forFeature([PullRequestEntity]),
        TypeOrmModule.forFeature([MetricsEntity]),
    ],
    controllers: [MetricsController],
    providers: [
        ContributorService,
        CommunityService,
        PullRequestService,
        MetricsService,
    ],
    exports: [MetricsService],
})
export class MetricsModule {}
