import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ModelBase } from '../../common/dto/ModelBase';
import { CommunityEntity } from '../communities/community.entity';
import { ContributorEntity } from './contributor.entity';

@Entity({ name: 'pullrequests' })
export class PullRequestEntity extends ModelBase {
    @ManyToOne(
        () => ContributorEntity,
        (result: ContributorEntity) => result.pullRequests,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'contributor_id' })
    contributor: ContributorEntity;

    @ApiModelProperty({ type: () => CommunityEntity })
    @ManyToOne(
        () => CommunityEntity,
        result => result.pullRequests,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn()
    communityRepository: CommunityEntity;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    number: number;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    title: string;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    prState: string;

    @ApiModelProperty()
    @Column({ unique: false, nullable: true })
    mergedAt: Date;
}
