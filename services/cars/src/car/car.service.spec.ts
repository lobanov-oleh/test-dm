import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { CarEntity } from '../entities/car.entity';
import { ManufacturerEntity } from '../entities/manufacturer.entity';
import { OwnerEntity } from '../entities/owner.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { manufacturer, car } from '../data';

const mockManufacturerRepository = jest.fn(() => ({
  lastId: 0,
  metadata: {
    columns: [],
    relations: [],
  },
  findOne: () => {
    return manufacturer;
  }
}));

const mockOwnerRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
  findOne: () => null,
  save: entity => entity
}));

const mockCarRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
  find: () => [car],
  findOne: () => car,
  save: entity => entity
}));

describe('CarService', () => {
  let carService: CarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getRepositoryToken(CarEntity),
          useClass: mockCarRepository
        },
        {
          provide: getRepositoryToken(ManufacturerEntity),
          useClass: mockManufacturerRepository
        },
        {
          provide: getRepositoryToken(OwnerEntity),
          useClass: mockOwnerRepository
        }
      ],
    }).compile();

    carService = module.get<CarService>(CarService);
  });

  it('should be defined', () => {
    expect(carService).toBeDefined();
  });

  it('should find cars', async () => {
    const cars = await carService.findAll();

    expect(cars).toBeInstanceOf(Array);
    expect(cars).toHaveLength(1);
    expect(cars[0]).toBeInstanceOf(CarEntity);
    expect(cars[0].id).toEqual(car.id);
  });

  it('should find the car by id', async () => {
    const carEntity = await carService.find(car.id);

    expect(carEntity).toBeInstanceOf(CarEntity);
    expect(carEntity.id).toEqual(car.id);
  });

  it('should find the car manufacturer', async () => {
    const manufacturerEntity = await carService.findManufacturer(car.id);

    expect(manufacturerEntity).toBeInstanceOf(ManufacturerEntity);
    expect(manufacturerEntity).toEqual(car.manufacturer);
  });

  it('should create a car', async () => {
    const carDto: CreateCarDto = {
      manufacturer: manufacturer.id,
      price: 100,
      owners: ['Smith', 'Wessen']
    };

    const carEntity = await carService.create(carDto);

    expect(carEntity).toBeInstanceOf(CarEntity);
    expect(carEntity.manufacturer).toEqual(manufacturer);
    expect(carEntity.owners[0].name).toEqual('Smith');
    expect(carEntity.owners[1].name).toEqual('Wessen');
  });

  it('should update the car', async () => {
    const carDto: UpdateCarDto = {
      price: 200
    };

    const carEntity = await carService.update(car.id, carDto);
    expect(carEntity).toBeInstanceOf(CarEntity);
    expect(carEntity.price).toEqual(200);
  });
});