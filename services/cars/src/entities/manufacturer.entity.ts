import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { CarEntity } from './car.entity';

@Entity('manufacturer')
export class ManufacturerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column('bigint')
  siret: number;

  @OneToMany(type => CarEntity, car => car.manufacturer)
  cars: CarEntity[];
}
