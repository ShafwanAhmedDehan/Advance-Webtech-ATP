import { DriverEntity } from 'src/driver/driver.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OwnerProfileEntity } from './ownerprofile.entity';
@Entity('owner')
export class OwnerEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  nid: string;
  @Column()
  password: string;
  @Column()
  filenames: string;

  @OneToMany(() => DriverEntity, (driver) => driver.owner, { cascade: true })
  drivers: DriverEntity[];

  @OneToOne(
    () => OwnerProfileEntity,
    (ownerProfile) => ownerProfile.owner,
  )
  ownerProfile: number;

}
