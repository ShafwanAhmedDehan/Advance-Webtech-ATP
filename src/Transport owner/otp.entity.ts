import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otpEntity')
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  owner: number;
  @Column()
  otp: string;
}
