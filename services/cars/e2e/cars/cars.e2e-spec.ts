import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CarModule } from '../../src/car/car.module';
import { CarService } from '../../src/car/car.service';
import { getRepositoryToken, TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from '../../src/entities/car.entity';
import { ManufacturerEntity } from '../../src/entities/manufacturer.entity';
import { OwnerEntity } from '../../src/entities/owner.entity';
import { Transport } from '@nestjs/microservices';
import { manufacturer, car, firstOwner, secondOwner } from '../../src/data';
import { CreateCarDto } from '../../src/car/dto/create-car.dto';
import { getRepository, Repository } from 'typeorm';
import { UpdateCarDto } from '../../src/car/dto/update-car.dto';

const SQLITE_CONFIG: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  autoLoadEntities: true,
  synchronize: true,
  logging: false
};

describe('Cars', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(SQLITE_CONFIG),
        CarModule
      ]
    })
      .compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice({
      transport: Transport.TCP
    });
    await app.startAllMicroservicesAsync();

    await app.init();

    const manufacturerRepository: Repository<ManufacturerEntity>  = getRepository(ManufacturerEntity);
    manufacturerRepository.save(manufacturer);
  });

  it(`/POST cars`, () => {
    const carDto: CreateCarDto = {
      manufacturer: car.manufacturer.id,
      price: car.price,
      owners: car.owners.map(o => o.name)
    };

    return request(app.getHttpServer())
      .post('/cars')
      .send(carDto)
      .set('Accept', 'application/json')
      .expect(201)
      .then(response => {
        expect(response.body.id).toEqual(car.id);
        expect(response.body.manufacturer.id).toEqual(car.manufacturer.id);
        expect(response.body.price).toEqual(car.price);
        expect(response.body.owners).toHaveLength(2);
      });
  });

  it(`/GET cars`, () => {
    return request(app.getHttpServer())
      .get('/cars')
      .expect(200)
      .then(response => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0].id).toEqual(car.id);
        expect(response.body[0].price).toEqual(car.price);
      });
  });

  it(`/GET cars/:id`, () => {
    return request(app.getHttpServer())
      .get('/cars/' + car.id)
      .expect(200)
      .then(response => {
        expect(response.body.id).toEqual(car.id);
        expect(response.body.manufacturer.id).toEqual(car.manufacturer.id);
        expect(response.body.price).toEqual(car.price);
        expect(response.body.owners).toHaveLength(2);
      });
  });

  it(`/GET cars/:id/manufacturer`, () => {
    return request(app.getHttpServer())
      .get('/cars/' + car.id + '/manufacturer')
      .expect(200)
      .then(response => {
        expect(response.body.id).toEqual(manufacturer.id);
        expect(response.body.name).toEqual(manufacturer.name);
        expect(response.body.phone).toEqual(manufacturer.phone);
        expect(response.body.siret).toEqual(manufacturer.siret);
      });
  });


  it(`/PUT cars/:id`, () => {
    const price = 200;
    const carDto: UpdateCarDto = {
      price
    };

    return request(app.getHttpServer())
      .put('/cars/' + car.id)
      .send(carDto)
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body.id).toEqual(car.id);
        expect(response.body.price).toEqual(price);
      });
  });

  it(`/DELETE cars/:id`, () => {
    return request(app.getHttpServer())
      .delete('/cars/' + car.id)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
