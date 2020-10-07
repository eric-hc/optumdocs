import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { MetricsEntity } from './metrics.entity';

@Injectable()
export class MetricsService extends TypeOrmCrudService<MetricsEntity> {
    db: Repository<MetricsEntity>;
    constructor(@InjectRepository(MetricsEntity) repo) {
        super(repo);
        this.db = repo;
    }
}
