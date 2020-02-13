import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices';
import { CAR_SERVICE } from './car.constants';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from '../entities/car.entity';
import { ManufacturerEntity } from '../entities/manufacturer.entity';
import { OwnerEntity } from '../entities/owner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarEntity,
      ManufacturerEntity,
      OwnerEntity
    ]),
    ClientsModule.register([{ name: CAR_SERVICE, transport: Transport.TCP }]),
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
