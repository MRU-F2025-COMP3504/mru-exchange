import { err, ok } from '@shared/utils';
import type {
  DatabaseQuery,
  RequiredColumns,
  Product,
  Result,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import type {
  ProductAttributeModifier,
  ProductBuilder,
} from '@features/listing';

export function register(): ProductBuilder {
  const product: Partial<Product> = {};
  return {
    seller(
      seller: RequiredColumns<UserProfile, 'supabase_id'>,
    ): Result<ProductBuilder> {
      if (!seller.supabase_id) {
        return err(new Error('Product ID is not specified'));
      } else {
        product.user_id = seller.supabase_id;
      }

      return ok(this);
    },
    title(title: string): Result<ProductBuilder> {
      return setTitle(this, product, title);
    },
    description(description: string): Result<ProductBuilder> {
      return setDescription(this, product, description);
    },
    image(url: string): Result<ProductBuilder> {
      return setImage(this, product, url);
    },
    price(price: number): Result<ProductBuilder> {
      if (price < 0) {
        return err(
          new Error('Product price cannot be negative', { cause: price }),
        );
      } else {
        product.price = price;
      }

      return ok(this);
    },
    stock(stock: number): Result<ProductBuilder> {
      if (stock < 0) {
        return err(
          new Error('Product stock cannot be negative', { cause: stock }),
        );
      } else {
        product.stock_count = stock;
      }

      return ok(this);
    },
    async build(): DatabaseQuery<Product, 'id'> {
      return query(
        await supabase
          .from('Product_Information')
          .insert(product)
          .select('id')
          .single(),
      );
    },
  };
}

export async function set(
  isListed: boolean,
  ...products: RequiredColumns<Product, 'id'>[]
): DatabaseQuery<Product[], 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        isListed,
      })
      .in(
        'id',
        products.map((product) => product.id),
      )
      .select('id'),
  );
}

export async function remove(
  ...products: RequiredColumns<Product, 'id'>[]
): DatabaseQuery<Product[], 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .in(
        'id',
        products.map((product) => product.id),
      )
      .select('id'),
  );
}

export function attribute(
  product: RequiredColumns<Product, 'id'>,
): ProductAttributeModifier {
  const change: Partial<Product> = {};

  return {
    title(title: string): Result<ProductAttributeModifier> {
      return setTitle(this, product, title);
    },
    description(description: string): Result<ProductAttributeModifier> {
      return setDescription(this, product, description);
    },
    image(url: string): Result<ProductAttributeModifier> {
      return setImage(this, product, url);
    },
    async modify(): DatabaseQuery<Product, 'id'> {
      return query(
        await supabase
          .from('Product_Information')
          .update(change)
          .eq('id', product.id)
          .select('id')
          .single(),
      );
    },
  };
}

export async function stock(
  product: RequiredColumns<Product, 'id'>,
  stock: number,
): DatabaseQuery<Product, 'id'> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        stock_count: stock,
      })
      .eq('id', product.id)
      .select()
      .single(),
  );
}

function setTitle<T>(
  controller: T,
  product: Partial<Product>,
  title: string,
): Result<T> {
  if (!title) {
    return err(new Error('Product title is not specified'));
  } else {
    product.title = title;
  }

  return ok(controller);
}

function setDescription<T>(
  controller: T,
  product: Partial<Product>,
  description: string,
): Result<T> {
  if (!description) {
    return err(new Error('Product description is not specified'));
  } else {
    product.description = description;
  }

  return ok(controller);
}

function setImage<T>(
  controller: T,
  product: Partial<Product>,
  url: string,
): Result<T> {
  try {
    product.image = new URL(url).toJSON();
  } catch (error: unknown) {
    product.image = null;

    if (error instanceof Error) {
      return err(error);
    }
  }

  return ok(controller);
}
