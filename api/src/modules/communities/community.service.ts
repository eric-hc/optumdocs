import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { CommunityEntity } from './community.entity';

@Injectable()
export class CommunityService extends TypeOrmCrudService<CommunityEntity> {
    db: Repository<CommunityEntity>;
    constructor(@InjectRepository(CommunityEntity) repo) {
        super(repo);
        this.db = repo;
    }
}
