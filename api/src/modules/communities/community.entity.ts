import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { ModelBase } from '../../common/dto/ModelBase';
import { PullRequestEntity } from '../contributors/pullrequest.entity';

@Entity({ name: 'communities' })
export class CommunityEntity extends ModelBase {
    @ApiModelProperty()
    @Column({ unique: true, nullable: false })
    githubRepository: string;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    organization: string;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    repository: string;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    description: string;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    stars: number;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    issues: number;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    watchers: number;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    forks: number;
    @ApiModelProperty({ type: () => PullRequestEntity, isArray: true })
    @OneToMany(
        () => PullRequestEntity,
        result => result.communityRepository,
    )
    pullRequests: PullRequestEntity[];
}
