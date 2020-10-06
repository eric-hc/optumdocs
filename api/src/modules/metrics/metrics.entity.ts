import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { PullRequestEntity } from '../contributors/pullrequest.entity';
import { ModelBase } from './../../common/dto/ModelBase';

@Entity({ name: 'metrics' })
export class MetricsEntity extends ModelBase {
    @ApiModelProperty()
    @Column({ unique: true, nullable: false })
    githubUsername: string;
    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    name: string;
    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    location: string;
    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    avatarUrl: string;
    @ApiModelProperty({ type: () => PullRequestEntity, isArray: true })
    @OneToMany(
        () => PullRequestEntity,
        result => result.contributor,
    )
    pullRequests: PullRequestEntity[];
}
