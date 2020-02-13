import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
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

  @Column({ type: 'datetime' })
  firstRegistationDate: Date;

  @BeforeInsert()
  updateDates() {
      this.firstRegistationDate = new Date();
  }

  @ManyToMany(type => OwnerEntity)
  @JoinTable()
  owners: OwnerEntity[];
}
