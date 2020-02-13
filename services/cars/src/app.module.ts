import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CarModule } from './car/car.module';

const MYSQL_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: +process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'test',
  autoLoadEntities: true,
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(MYSQL_CONFIG),
    CarModule
  ],
})
export class AppModule {}
