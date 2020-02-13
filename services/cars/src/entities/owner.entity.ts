import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('owner')
export class OwnerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  purchaseDate: Date;
}
