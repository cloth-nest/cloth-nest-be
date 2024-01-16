import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Product, ProductVariant } from '../../entities';
import * as ProductData from '../mocks/product.json';
import { In } from 'typeorm';

export class ProductProductVariantDefaultSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tableName = Product.name;
    const productRepository = dataSource.getRepository(Product);
    const productVariantRepository = dataSource.getRepository(ProductVariant);

    console.log(
      `[${tableName}]\x1b[33m ==========> SEEDING ${tableName} One-to-one \x1b[0m`,
    );
    const productVariantIds = ProductData.map(
      (product) => product.defaultVariantId,
    );
    const productIds = ProductData.map((product) => product.id);

    const productVariants = await productVariantRepository.find({
      where: { id: In(productVariantIds) },
    });

    const products = await productRepository.find({
      where: { id: In(productIds) },
    });

    for (const product of products) {
      const productId = product.id;

      // Get productVariantId from ProductData
      const productVariantId = ProductData.find(
        (product) => product.id === productId,
      ).defaultVariantId;

      const productVariant = productVariants.find(
        (productVariant) => productVariant.id === productVariantId,
      );
      product.defaultVariant = productVariant;
    }

    await productRepository.save(products);
    console.log(
      `[${tableName}]\x1b[32m ==========> FINISHED SEED ${tableName} \x1b[0m`,
    );
  }
}
