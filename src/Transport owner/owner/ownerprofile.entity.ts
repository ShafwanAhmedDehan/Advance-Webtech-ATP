import { DriverEntity } from 'src/driver/driver.entity';
//import { DriverEntity } from '../driver/driver.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { OwnerEntity } from './owner.entity';
@Entity('ownerprofile')
export class OwnerProfileEntity {
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
  filenames: string;

    @OneToOne(() => OwnerEntity, (owner) => owner.ownerProfile)
        @JoinColumn()
  owner: number;

}
