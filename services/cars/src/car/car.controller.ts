import { Controller, Get, Inject, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CAR_SERVICE } from './car.constants';
import { CarEntity } from '../entities/car.entity';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { DeleteResult } from 'typeorm';
import { ManufacturerEntity } from 'src/entities/manufacturer.entity';
import { OwnerEntity } from 'src/entities/owner.entity';

@Controller('cars')
export class CarController {
  constructor(
    @Inject(CAR_SERVICE) private readonly client: ClientProxy,
    private readonly carService: CarService
    ) {}

  // curl -X GET http://localhost:3001/cars
  @Get()
  getCars(): Observable<CarEntity[]> {
    return this.client.send<CarEntity[]>({ cmd: 'cars' }, []);
  }

  // curl -X GET http://localhost:3001/cars/1
  @Get(':id')
  getCar(@Param() params): Observable<CarEntity> {
    return this.client.send<CarEntity>({ cmd: 'car' }, +params.id);
  }

  // curl -X GET http://localhost:3001/cars/1/manufacturer
  @Get(':id/manufacturer')
  getManufacturer(@Param() params): Observable<ManufacturerEntity> {
    return this.client.send<ManufacturerEntity>({ cmd: 'car_manufacturer' }, +params.id);
  }

  // curl -d '{"manufacturer":1, "price":100.01, "owners":["Smith", "Wesson"]}' -H "Content-Type: application/json" -X POST http://localhost:3001/cars
  @Post()
  post(@Body() carData: CreateCarDto): Observable<CarEntity> {
    return this.client.send<CarEntity>({ cmd: 'create_car' }, carData);
  }

  // curl -d '{"price":200.01}' -H "Content-Type: application/json" -X PUT http://localhost:3001/cars/1
  @Put(':id')
  put(@Param() params, @Body() carData: UpdateCarDto): Observable<CarEntity> {
    return this.client.send<CarEntity>({ cmd: 'update_car' }, { id: +params.id, data: carData });
  }

  // curl -X DELETE http://localhost:3001/cars/1
  @Delete(':id')
  delete(@Param() params): Observable<DeleteResult> {
    return this.client.send<DeleteResult>({ cmd: 'delete_car' }, +params.id);
  }

  // curl -X GET http://localhost:3001/cars/jobs/owners
  @Get('jobs/owners')
  getJobsOwners(): Observable<OwnerEntity[]> {
    return this.client.send<OwnerEntity[]>({ cmd: 'cars_jobs_owners' }, []);
  }

  // curl -X GET http://localhost:3001/cars/jobs/discounts
  @Get('jobs/discounts')
  getJobsDiscounts(): Observable<CarEntity[]> {
    return this.client.send<CarEntity[]>({ cmd: 'cars_jobs_discounts' }, []);
  }

  @MessagePattern({ cmd: 'cars' })
  cars(): Promise<CarEntity[]> {
    return this.carService.findAll();
  }

  @MessagePattern({ cmd: 'car' })
  car(id: number): Promise<CarEntity> {
    return this.carService.find(id);
  }

  @MessagePattern({ cmd: 'car_manufacturer' })
  carManufacturer(id: number): Promise<ManufacturerEntity> {
    return this.carService.findManufacturer(id);
  }

  @MessagePattern({ cmd: 'create_car' })
  createCar(carData: CreateCarDto): Promise<CarEntity> {
    return this.carService.create(carData);
  }

  @MessagePattern({ cmd: 'update_car' })
  updateCar(carData: { id: number, data: UpdateCarDto }): Promise<CarEntity> {
    return this.carService.update(carData.id, carData.data);
  }

  @MessagePattern({ cmd: 'delete_car' })
  deleteCar(id: number): Promise<DeleteResult> {
    return this.carService.delete(id);
  }

  @MessagePattern({ cmd: 'cars_jobs_owners' })
  jobOwners(): Promise<DeleteResult> {
    return this.carService.checkOwners();
  }

  @MessagePattern({ cmd: 'cars_jobs_discounts' })
  jobDiscounts(): Promise<CarEntity[]> {
    return this.carService.checkDiscounts();
  }
}
