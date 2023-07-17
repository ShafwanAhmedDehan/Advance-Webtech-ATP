import { Module } from '@nestjs/common';
import { OwnerModule } from './owner/owner.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ OwnerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'owner', //Change to your database name
      autoLoadEntities: true,
      synchronize: true,
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
