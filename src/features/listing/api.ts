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

/**
 * See the implementation below for more information.
 */
interface CategoryListing {
  /**
   * Registers the category tag.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
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
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param categories the given category tag identifier(s) to remove
   * @returns a promise that resolves the deleted category tag(s)
   */
  remove: (
    categories: RequiredColumns<Category, 'id'>[],
  ) => DatabaseQuery<Category[], 'id'>;

  /**
   * Modifies the name and/or description of the given category tag.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
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
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param product the given product identifier
   * @param categories the given category tag identifier(s) to modify
   */
  tag: (
    product: RequiredColumns<Product, 'id'>,
    categories: RequiredColumns<Category, 'id'>[],
  ) => DatabaseQuery<CategorizedProduct[], '*'>;
}

/**
 * The category listing is used to assign products for product organization and exposure.
 * Sellers may assign their products with one or more category tags that can be best represented.
 * Sellers may register for one or more new category tags and modify them.
 *
 * @see {@link CategoryCatalogue} for fetching existing category tags
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
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

/**
 * See the implementation below for more information.
 */
interface ProductListing {
  /**
   * Builds and registers a product.
   *
   * @see {@link ProductBuilder} for more information on its builder features
   * @returns the product builder
   */
  register: () => ProductBuilder;

  /**
   * Specifies the listing visibility of the given product.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
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
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
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
   * @see {@link ProductAttributeModifier} for more information on its builder features
   *
   * @param the given product identifier to modify its attributes
   * @returns a promise that resolves the modified product
   */
  attribute(product: RequiredColumns<Product, 'id'>): ProductAttributeModifier;

  /**
   * Modifies the stock of the given product.
   * The stock amount must be greater than or equal to zero (0).
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param product the given product identifier to modify its stock
   * @return a promise that resolves the modified product
   */
  stock(
    product: RequiredColumns<Product, 'id'>,
    stock: number,
  ): DatabaseQuery<Product, 'id'>;
}

/**
 * The product listing is used to put a seller's product up for sale.
 * Sellers must only register products that does not yet exist in the database.
 * Sellers may choose to show, hide, or unlist products from the public.
 * Only publicly listed products are shown to buyers.
 *
 * @see {@link ProductCatalogue} for fetching existing products
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
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
      image(paths: string[]): Result<ProductBuilder> {
        return setImage(this, product, paths);
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

/**
 * Modifies the product title.
 * If the given title is empty, the function returns an error.
 *
 * @internal
 * @param controller the given product attribute modifier
 * @param product the given incomplete product modification
 * @param title the given new product title
 * @returns a wrapped result that may contain the product attribute modifier
 */
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

/**
 * Modifies the product description.
 * If the given description is empty, the function returns an error.
 *
 * @internal
 * @param controller the given product attribute modifier
 * @param product the given incomplete product modification
 * @param title the given new product description
 * @returns a wrapped result that may contain the product attribute modifier
 */
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

/**
 * Modifies the product image.
 * If the given image is invalid, the function returns an error.
 *
 * @see {@link REGEX_IMAGE_PATH} for more information on the image path validation algorithm
 *
 * @internal
 * @param controller the given product attribute modifier
 * @param product the given incomplete product modification
 * @param title the given new product description
 * @returns a wrapped result that may contain the product attribute modifier
 */
function setImage<T>(
  controller: T,
  product: Partial<Product>,
  paths: string[],
): Result<T> {
  for (const path of paths) {
    if (!REGEX_IMAGE_PATH.test(path)) {
      return err(new Error('Product image path is invalid', { cause: path }));
    }
  }

  // TODO: Accept multiple image paths from the database
  // product.image = url;

  return ok(controller);
}
