import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunityEntity } from '../communities/community.entity';
import { CommunityService } from '../communities/community.service';
import { ContributorEntity } from './contributor.entity';
import { ContributorService } from './contributor.service';
import { ContributorsController } from './contributors.controller';
import { PullRequestEntity } from './pullrequest.entity';
import { PullRequestService } from './pullrequest.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ContributorEntity]),
        TypeOrmModule.forFeature([CommunityEntity]),
        TypeOrmModule.forFeature([PullRequestEntity]),
    ],
    controllers: [ContributorsController],
    providers: [ContributorService, CommunityService, PullRequestService],
    exports: [ContributorService],
})
export class ContributorsModule {}
