import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunitiesController } from './communities.controller';
import { CommunityEntity } from './community.entity';
import { CommunityService } from './community.service';

@Module({
    imports: [TypeOrmModule.forFeature([CommunityEntity])],
    controllers: [CommunitiesController],
    providers: [CommunityService],
    exports: [CommunityService],
})
export class CommunitiesModule {}
