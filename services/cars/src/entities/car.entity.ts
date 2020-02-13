import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { ManufacturerEntity } from './manufacturer.entity';
import { OwnerEntity } from './owner.entity';

@Entity('car')
export class CarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => ManufacturerEntity, manufacturer => manufacturer.cars)
  manufacturer: ManufacturerEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  firstRegistationDate: Date;

  @ManyToMany(type => OwnerEntity)
  @JoinTable()
  owners: OwnerEntity[];
}
