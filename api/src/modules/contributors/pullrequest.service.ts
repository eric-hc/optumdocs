import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { PullRequestEntity } from './pullrequest.entity';

@Injectable()
export class PullRequestService extends TypeOrmCrudService<PullRequestEntity> {
    db: Repository<PullRequestEntity>;
    constructor(@InjectRepository(PullRequestEntity) repo) {
        super(repo);
        this.db = repo;
    }
}
