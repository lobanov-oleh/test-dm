import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('owner')
export class OwnerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'datetime' })
  purchaseDate: Date;

  @BeforeInsert()
  updateDates() {
      this.purchaseDate = new Date();
  }
}
