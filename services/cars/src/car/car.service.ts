import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DeleteResult, MoreThan, LessThan, Between } from 'typeorm';
import { CarEntity } from '../entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { ManufacturerEntity } from '../entities/manufacturer.entity';
import { OwnerEntity } from '../entities/owner.entity';
import { UpdateCarDto } from './dto/update-car.dto';
import * as moment from 'moment';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    @InjectRepository(ManufacturerEntity)
    private readonly manufacturerRepository: Repository<ManufacturerEntity>,
    @InjectRepository(OwnerEntity)
    private readonly ownerRepository: Repository<OwnerEntity>
  ) { }

  async findAll(): Promise<CarEntity[]> {
    return this.carRepository.find();
  }

  async findManufacturer(id: number): Promise<ManufacturerEntity> {
    const car = this.carRepository.findOne({ where: { id }, relations: ['manufacturer'] });
    return (await car).manufacturer;
  }

  async find(id: number): Promise<CarEntity> {
    return this.carRepository.findOne({ where: { id }, relations: ['manufacturer', 'owners'] });
  }

  async create(carData: CreateCarDto): Promise<CarEntity> {
    let car = new CarEntity();
    car.price = carData.price;

    const manufacturer = await this.manufacturerRepository.findOne({ where: { id: carData.manufacturer } });
    car.manufacturer = manufacturer;

    car.owners = [];
    for (const ownerName of carData.owners) {
      let carOwner = await this.ownerRepository.findOne({ where: { name: ownerName } });

      if (!carOwner) {
        const owner = new OwnerEntity();
        owner.name = ownerName;

        const newOwner = await this.ownerRepository.save(owner);

        carOwner = newOwner;
      }

      car.owners.push(carOwner);
    }

    const newCar = await this.carRepository.save(car);

    return newCar;
  }

  async update(id: number, carData: UpdateCarDto): Promise<CarEntity> {
    let toUpdate = await this.carRepository.findOne(id);
    let updated = Object.assign(toUpdate, carData);

    const car = await this.carRepository.save(updated);

    return car;
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.carRepository.delete(id);
  }

  async checkOwners(): Promise<DeleteResult> {
    const date = moment().subtract(18, 'months');

    return this.ownerRepository.delete({
      purchaseDate: LessThan(date.format('YYYY-MM-DD hh:mm:ss'))
    });
  }

  async checkDiscounts(): Promise<CarEntity[]> {
    const dateFrom = moment().subtract(18, 'months');
    const dateTo = moment().subtract(12, 'months');

    const cars = await this.carRepository.find({
      firstRegistationDate: Between(
        dateFrom.format('YYYY-MM-DD hh:mm:ss'),
        dateTo.format('YYYY-MM-DD hh:mm:ss')
      )
    });

    for (const car of cars) {
      car.price = car.price * 0.8;
      await this.carRepository.save(car);
    }

    return cars;
  }
}
