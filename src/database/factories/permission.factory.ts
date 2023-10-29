import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Permission } from '../../entities';

export const PermissionFactory = setSeederFactory(
  Permission,
  (faker: Faker) => {
    const permission = new Permission();
    permission.name = faker.internet.displayName();
    permission.codeName = faker.commerce.productName();
    return permission;
  },
);
