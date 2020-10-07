import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { ContributorEntity } from './contributor.entity';

@Injectable()
export class ContributorService extends TypeOrmCrudService<ContributorEntity> {
    db: Repository<ContributorEntity>;
    constructor(@InjectRepository(ContributorEntity) repo) {
        super(repo);
        this.db = repo;
    }
}
