import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Passenger } from './passenger.entity';
import { Driver } from './driver.entity';

@Entity('DriverProfile')
export class DriverProfile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  phone: string;
  @Column()
  email: string;
  @Column()
  gender: string;
  @Column()
  profile: string;
  @OneToOne(() => Driver, (driver) => driver.driverProfile)
  @JoinColumn()
  driver: number;
}
