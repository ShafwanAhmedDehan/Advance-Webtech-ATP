import { OwnerEntity } from '../owner/owner.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('driver')
export class DriverEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  licenseNo: string;

  @ManyToOne(() => OwnerEntity, owner => owner.drivers)
  owner: number;

}
