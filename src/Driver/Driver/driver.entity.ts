import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Passenger } from './passenger.entity';
import { DriverProfile } from './driverProfile.entity';

@Entity('Driver')
export class Driver {
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
  password: string;
  @Column()
  profile: string;
  @OneToMany(() => Passenger, (passenger) => passenger.driver)
  passengers: Passenger[];

  @OneToOne(() => DriverProfile, (driverP) => driverP.driver)
  driverProfile: number;
}
