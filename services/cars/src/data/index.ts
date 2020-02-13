import { ManufacturerEntity } from "../entities/manufacturer.entity";
import { OwnerEntity } from "../entities/owner.entity";
import { CarEntity } from "../entities/car.entity";

export const manufacturer = new ManufacturerEntity();
manufacturer.id = 1;
manufacturer.name = 'test';
manufacturer.phone = '03';
manufacturer.siret = 13;

export const firstOwner = new OwnerEntity();
firstOwner.id = 1;
firstOwner.name = 'Smith';

export const secondOwner = new OwnerEntity();
secondOwner.id = 2;
secondOwner.name = 'Wessen';

export let car = new CarEntity();
car.id = 1;
car.price = 100;
car.manufacturer = manufacturer;
car.owners = [firstOwner, secondOwner];
