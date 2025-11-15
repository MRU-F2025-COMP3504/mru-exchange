import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  RequiredColumns,
  Product,
  Result,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import { err, ok, REGEX_IMAGE_PATH } from '@shared/utils';
import type {
  ProductBuilder,
  ProductAttributeModifier,
} from '@features/listing';

interface CategoryListing {
  /**
   * Registers the category tag.
   * All columns are selected.
   *
   * @param category the given category tag to register
   * @returns a promise that resolves the registered category tag
   */
  register: (
    category: RequiredColumns<Category, 'name' | 'description'>,
  ) => DatabaseQuery<Category, '*'>;

  /**
   * Removes the given category tag(s).
   *
   * @param categories the given category tag identifier(s) to remove
   * @returns a promise that resolves the deleted category tag(s)
   */
  remove: (
    categories: RequiredColumns<Category, 'id'>[],
  ) => DatabaseQuery<Category[], 'id'>;

  /**
   * Modifies the name and/or description of the given category tag.
   * All columns are selected.
   *
   * @param target the given category tag identifier to modify
   * @param change the new name and/or description
   * @returns a promise that resolves the modified category tag
   */
  modify: (
    target: RequiredColumns<Category, 'id'>,
    change: Pick<Partial<Category>, 'name' | 'description'>,
  ) => DatabaseQuery<Category, '*'>;

  /**
   * Assigns the given product with the given category tag(s).
   * All columns are selected.
   *
   * @param product the given product identifier
   * @param categories the given category tag identifier(s) to modify
   */
  tag: (
    product: RequiredColumns<Product, 'id'>,
    categories: RequiredColumns<Category, 'id'>[],
  ) => DatabaseQuery<CategorizedProduct[], '*'>;
}

export const CategoryListing: CategoryListing = {
  register: async (
    category: RequiredColumns<Category, 'name' | 'description'>,
  ): DatabaseQuery<Category, '*'> => {
    return query(
      await supabase
        .from('Category_Tags')
        .insert(category)
        .select('*')
        .single(),
    );
  },
  remove: async (
    categories: RequiredColumns<Category, 'id'>[],
  ): DatabaseQuery<Category[], 'id'> => {
    return query(
      await supabase
        .from('Category_Tags')
        .delete()
        .in(
          'id',
          categories.map((category) => category.id),
        )
        .select('id'),
    );
  },
  modify: async (
    target: RequiredColumns<Category, 'id'>,
    change: Pick<Partial<Category>, 'name' | 'description'>,
  ): DatabaseQuery<Category, '*'> => {
    return query(
      await supabase
        .from('Category_Tags')
        .update(change)
        .eq('id', target.id)
        .select('*')
        .single(),
    );
  },
  tag: async (
    product: RequiredColumns<Product, 'id'>,
    categories: RequiredColumns<Category, 'id'>[],
  ): DatabaseQuery<CategorizedProduct[], '*'> => {
    return query(
      await supabase
        .from('Category_Assigned_Products')
        .insert(
          categories.map((category) => ({
            category_id: category.id,
            product_id: product.id,
          })),
        )
        .select('*'),
    );
  },
};

interface ProductListing {
  /**
   * Builds and registers a product.
   *
   * @returns the product builder
   */
  register: () => ProductBuilder;

  /**
   * Specifies the listing visibility of the given product.
   *
   * @param isListed the visibility flag
   * @param products the given product identifier(s)
   * @returns a promise that resolves the product visibility
   */
  list: (
    isListed: boolean,
    products: RequiredColumns<Product, 'id'>[],
  ) => DatabaseQuery<Product[], 'id'>;

  /**
   * Removes the given product(s).
   *
   * @param products the given product identifier(s) to remove
   * @returns a promise that resolves the deleted product(s)
   */
  remove: (
    products: RequiredColumns<Product, 'id'>[],
  ) => DatabaseQuery<Product[], 'id'>;

  /**
   * Modifies the attributes of the given product.
   * Attributes, such as the title, description, and images are specified.
   *
   * @param the given product identifier to modify its attributes
   * @returns a promise that resolves the modified product
   */
  attribute(product: RequiredColumns<Product, 'id'>): ProductAttributeModifier;

  /**
   * Modifies the stock of the given product.
   * The stock amount must be greater than or equal to zero (0).
   *
   * @param product the given product identifier to modify its stock
   * @return a promise that resolves the modified product
   */
  stock(
    product: RequiredColumns<Product, 'id'>,
    stock: number,
  ): DatabaseQuery<Product, 'id'>;
}

export const ProductListing: ProductListing = {
  register: (): ProductBuilder => {
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
            .insert(product as Product)
            .select('id')
            .single(),
        );
      },
    };
  },
  list: async (
    isListed: boolean,
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<Product[], 'id'> => {
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
  },
  remove: async (
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<Product[], 'id'> => {
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
  },
  attribute: (
    product: RequiredColumns<Product, 'id'>,
  ): ProductAttributeModifier => {
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
  },
  stock: async (
    product: RequiredColumns<Product, 'id'>,
    stock: number,
  ): DatabaseQuery<Product, 'id'> => {
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
  },
};

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
  if (!REGEX_IMAGE_PATH.test(url)) {
    return err(new Error('Product image path is not specified'));
  } else {
    product.image = url;
  }

  return ok(controller);
}
