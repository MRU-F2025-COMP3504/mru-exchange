import type {
  ProductAttributeModifier,
  ProductBuilder,
} from '@features/listing';
import { supabase } from '@shared/api';
import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  Product,
  RequireProperty,
  Result,
} from '@shared/types';
import {
  err,
  FormUtils,
  ok,
  query,
  REGEX_IMAGE_PATH,
  REGEX_LETTER_NUMBERS_ONLY,
} from '@shared/utils';

/**
 * See the implementation below for more information.
 */
interface CategoryListing {
  /**
   * Registers the category tag.
   * Selects all columns.
   *
   * @param category the given category tag to register
   * @returns the {@link Promise} that resolves the registered category tag
   */
  create: (
    category: RequireProperty<Category, 'name' | 'description'>,
  ) => DatabaseQuery<Category, '*'>;

  /**
   * Removes the given category tag(s).
   *
   * @param categories the given category tag identifier(s) to remove
   * @returns the {@link Promise} that resolves the deleted category tag(s)
   */
  remove: (
    categories: RequireProperty<Category, 'id'>[],
  ) => DatabaseQuery<Category[], 'id'>;

  /**
   * Modifies the name and/or description of the given category tag.
   * Selects all columns.
   *
   * @param target the given category tag identifier to modify
   * @param change the new name and/or description
   * @returns the {@link Promise} that resolves the modified category tag
   */
  modify: (
    target: RequireProperty<Category, 'id'>,
    change: Pick<Partial<Category>, 'name' | 'description'>,
  ) => DatabaseQuery<Category, '*'>;

  /**
   * Assigns the given product with the given category tag(s).
   * Selects all columns.
   *
   * @param product the given product identifier
   * @param categories the given category tag identifier(s) to modify
   */
  tag: (
    product: RequireProperty<Product, 'id'>,
    categories: RequireProperty<Category, 'id'>[],
  ) => DatabaseQuery<CategorizedProduct[], '*'>;
}

/**
 * The category listing feature is used to assign products for product organization and exposure.
 * Sellers may assign their products with one or more category tags that can be best represented.
 * Sellers may register for one or more new category tags and modify them.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 * @see {@link CategoryCatalogue} for fetching existing category tags
 */
export const CategoryListing: CategoryListing = {
  async create(
    category: RequireProperty<Category, 'name' | 'description'>,
  ): DatabaseQuery<Category, '*'> {
    return query(
      await supabase
        .from('Category_Tags')
        .insert(category)
        .select('*')
        .single(),
    );
  },
  async remove(
    categories: RequireProperty<Category, 'id'>[],
  ): DatabaseQuery<Category[], 'id'> {
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
  async modify(
    target: RequireProperty<Category, 'id'>,
    change: Pick<Partial<Category>, 'name' | 'description'>,
  ): DatabaseQuery<Category, '*'> {
    return query(
      await supabase
        .from('Category_Tags')
        .update(change)
        .eq('id', target.id)
        .select('*')
        .single(),
    );
  },
  async tag(
    product: RequireProperty<Product, 'id'>,
    categories: RequireProperty<Category, 'id'>[],
  ): DatabaseQuery<CategorizedProduct[], '*'> {
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
  create: () => ProductBuilder;

  /**
   * Modifies the attributes of the given product.
   * Attributes, such as the title, description, and images are specified.
   *
   * @param the given product identifier to modify its attributes
   * @returns the {@link Promise} that resolves the modified product
   * @see {@link ProductAttributeModifier} for more information on its builder features
   */
  attribute(product: RequireProperty<Product, 'id'>): ProductAttributeModifier;

  /**
   * Specifies the listing visibility of the given product.
   *
   * @param isListed the visibility flag
   * @param products the given product identifier(s)
   * @returns the {@link Promise} that resolves the product visibility
   */
  list: (
    isListed: boolean,
    products: RequireProperty<Product, 'id'>[],
  ) => DatabaseQuery<Product[], 'id'>;

  /**
   * Removes the given product(s).
   *
   * @param products the given product identifier(s) to remove
   * @returns the {@link Promise} that resolves the deleted product(s)
   */
  remove: (
    products: RequireProperty<Product, 'id'>[],
  ) => DatabaseQuery<Product[], 'id'>;

  /**
   * Modifies the price of the given product.
   * By default, the form `key` parameter is `price`.
   *
   * @param product the given product identifier to modify its stock
   * @param form the given {@link FormData}
   * @param key the given key (`price`) to {@link FormDataEntryValue}
   * @return the {@link Promise} that resolves the modified product
   */
  price(
    product: RequireProperty<Product, 'id'>,
    form: FormData,
    key?: string,
  ): DatabaseQuery<Product, '*'>;

  /**
   * Modifies the stock of the given product.
   * By default, the form `key` parameter is `stock`.
   *
   * @param product the given product identifier to modify its stock
   * @param form the given {@link FormData}
   * @param key the given key (`stock`) to {@link FormDataEntryValue}
   * @return the {@link Promise} that resolves the modified product
   */
  stock(
    product: RequireProperty<Product, 'id'>,
    form: FormData,
    key?: string,
  ): DatabaseQuery<Product, '*'>;
}

/**
 * The product listing feature is used to put a seller's product up for sale.
 * Sellers must only register products that does not yet exist in the database.
 * Sellers may choose to show, hide, or unlist products from the public.
 * Only publicly listed products are shown to buyers.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 * @see {@link ProductCatalogue} for fetching existing products
 */
export const ProductListing: ProductListing = {
  create(): ProductBuilder {
    const product: Partial<Product> = {};
    const images: File[] = [];

    return {
      title(form: FormData, key = 'title'): Result<string> {
        return setTitle(product, form, key);
      },
      description(form: FormData, key = 'description'): Result<string> {
        return setDescription(product, form, key);
      },
      images(form: FormData, key = 'images'): Result<File[]> {
        return setImages(product, images, form, key);
      },
      price(form: FormData, key = 'price'): Result<number> {
        return setPrice(product, form, key);
      },
      stock(form: FormData, key = 'stock'): Result<number> {
        return setStock(product, form, key);
      },
      isSatisfied(): boolean {
        if (!product.title) {
          return false;
        } else if (!product.description) {
          return false;
        } else if (!product.price) {
          return false;
        }

        return true;
      },
      async submit(): DatabaseQuery<Product, '*'> {
        if (!this.isSatisfied()) {
          return err('Missing required product properties');
        }

        for (const image of images) {
          await supabase.storage
            .from('product-images')
            .upload(image.name, image, { upsert: true });
        }

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
  async list(
    isListed: boolean,
    products: RequireProperty<Product, 'id'>[],
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
  },
  async remove(
    products: RequireProperty<Product, 'id'>[],
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
  },
  attribute: (
    product: RequireProperty<Product, 'id'>,
  ): ProductAttributeModifier => {
    const change: Partial<Product> = {};
    const images: File[] = [];

    return {
      title(form: FormData, key = 'title'): Result<string> {
        return setTitle(change, form, key);
      },
      description(form: FormData, key = 'description'): Result<string> {
        return setDescription(change, form, key);
      },
      images(form: FormData, key = 'images'): Result<File[]> {
        return setImages(change, images, form, key);
      },
      async submit(): DatabaseQuery<Product, '*'> {
        for (const image of images) {
          await supabase.storage
            .from('product-images')
            .upload(image.name, image, { upsert: true });
        }

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
  async price(
    product: RequireProperty<Product, 'id'>,
    form: FormData,
    key = 'price',
  ): DatabaseQuery<Product, '*'> {
    const price = setPrice(product, form, key);

    if (price.ok) {
      return query(
        await supabase
          .from('Product_Information')
          .update({
            price: price.data,
          })
          .eq('id', product.id)
          .select()
          .single(),
      );
    }

    return price;
  },
  async stock(
    product: RequireProperty<Product, 'id'>,
    form: FormData,
    key = 'stock',
  ): DatabaseQuery<Product, '*'> {
    const stock = setStock(product, form, key);

    if (stock.ok) {
      return query(
        await supabase
          .from('Product_Information')
          .update({
            stock_count: stock.data,
          })
          .eq('id', product.id)
          .select()
          .single(),
      );
    }

    return stock;
  },
};

/**
 * Modifies the product title.
 * If the given title is empty, the function returns an error.
 *
 * @internal
 * @param product the given incomplete product modification
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the {@link Result} that may contain the product title
 */
function setTitle(
  product: Partial<Product>,
  form: FormData,
  key: string,
): Result<string> {
  const { data, error } = FormUtils.getString(form, key);

  if (error) {
    return err('Invalid product title', error);
  } else if (!data) {
    return err('Title cannot be empty');
  } else if (!REGEX_LETTER_NUMBERS_ONLY.test(data)) {
    return err('Title cannot have special characters', data);
  } else {
    return ok((product.title = data));
  }
}

/**
 * Modifies the product description.
 * If the given description is empty, the function returns an error.
 *
 * @internal
 * @param product the given incomplete product modification
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the {@link Result} that may contain the product description
 */
function setDescription(
  product: Partial<Product>,
  form: FormData,
  key: string,
): Result<string> {
  const { data, error } = FormUtils.getString(form, key);

  if (error) {
    return err('Invalid product description', error);
  } else if (!data) {
    return err('Description cannot be empty');
  } else {
    return ok((product.description = data));
  }
}

/**
 * Modifies the product image.
 * If the given image is invalid, the function returns an error.
 *
 * @internal
 * @param product the given incomplete product modification
 * @param images the given images in {@link File} format for upload
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the {@link Result} that may contain the product images
 * @see {@link REGEX_IMAGE_PATH}
 */
function setImages(
  product: Partial<Product>,
  images: File[],
  form: FormData,
  key: string,
): Result<File[]> {
  const { data, error } = FormUtils.getFiles(form, key);

  if (error) {
    return err('Invalid product image(s)', error);
  } else {
    const paths: string[] = [];

    for (const image of data) {
      const name = image.name;

      if (!REGEX_IMAGE_PATH.test(name)) {
        return err('Invalid image');
      } else {
        paths.push(name);
      }
    }

    images.splice(0, images.length, ...data);

    product.image = {
      images: paths,
    };

    return ok(images);
  }
}

/**
 * Modifies the product price amount.
 * If the given price is empty, negative, or invalid, the function returns an error.
 *
 * @internal
 * @param product the given incomplete product modification
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the {@link Result} that may contain the product price amount
 */
function setPrice(
  product: Partial<Product>,
  form: FormData,
  key: string,
): Result<number> {
  const { data, error } = FormUtils.getString(form, key);

  if (error) {
    return err('Invalid product price', error);
  } else if (!data) {
    return err('Price cannot be empty', data);
  } else if (+data < 0) {
    return err('Price cannot be negative', +data);
  } else {
    return ok((product.price = +data));
  }
}

/**
 * Modifies the product stock amount.
 * If the given price is empty, negative, or invalid, the function returns an error.
 *
 * @internal
 * @param product the given incomplete product modification
 * @param form the given {@link FormData}
 * @param key the given key to {@link FormDataEntryValue}
 * @returns the {@link Result} that may contain the product stock amount
 */
function setStock(
  product: Partial<Product>,
  form: FormData,
  key: string,
): Result<number> {
  const { data, error } = FormUtils.getString(form, key);

  if (error) {
    return err('Invalid product stock', error);
  } else if (!data) {
    return err('Stock cannot be empty', data);
  } else if (+data < 0) {
    return err('Stock cannot be negative', +data);
  } else {
    return ok((product.stock_count = +data));
  }
}
