import type { ProductFilter, ProductFilterBuilder } from '@features/catalogue';
import { supabase } from '@shared/api';
import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  ExtractArrayType,
  Product,
  RequireProperty,
  Result,
  UserProfile,
} from '@shared/types';
import { err, FormUtils, ok, query, REGEX_LETTERS_ONLY } from '@shared/utils';

/**
 * See the implementation below for more information.
 */
interface CategoryCatalogue {
  /**
   * Retrieves all category tags.
   * Selects all columns.
   *
   * @returns the {@link Promise} that resolves to a collection of category tags
   */
  getTags: () => DatabaseQuery<Category[], '*'>;

  /**
   * Retrieves the given category tag.
   * Selects all columns.
   *
   * @param tag the given category tag identifier
   * @returns the {@link Promise} that resolves to the corresponding category tag that corresponds to the identifier
   */
  getTag: (
    tag: RequireProperty<Category, 'id'>,
  ) => DatabaseQuery<Category, '*'>;

  /**
   * Retrieves products by the given category tag that is assigned.
   * Selects all columns.
   *
   * @param tag the given category tag identifier
   * @returns the {@link Promise} that resolves to the corresponding products with the given category
   */
  getProductsByAssignedTag: (
    tag: RequireProperty<Category, 'id'>,
  ) => DatabaseQuery<CategorizedProduct[], '*'>;

  /**
   * Retrieves category tags that are assigned to the given product.
   * Selects all columns.
   *
   * @param product the given product identifier
   * @returns the {@link Promise} that corresponds category tags with the given product
   */
  getAssignedTagsByProduct: (
    product: RequireProperty<Product, 'id'>,
  ) => DatabaseQuery<CategorizedProduct[], '*'>;
}

/**
 * The category catalogue feature is used to fetch products based on its assigned category tags for search queries and product organization.
 * Sellers may assign their products with one or more category tags that can be best represented.
 * Category tags influences user recommendations and search queries, enhancing product exposure.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 * @see {@link CategoryListing} for registering and modifying existing category tags
 */
export const CategoryCatalogue: CategoryCatalogue = {
  async getTags(): DatabaseQuery<Category[], '*'> {
    return query(
      await supabase
        .from('Category_Tags')
        .select('*')
        .order('name', { ascending: true }),
    );
  },
  async getTag(
    tag: RequireProperty<Category, 'id'>,
  ): DatabaseQuery<Category, '*'> {
    return query(
      await supabase
        .from('Category_Tags')
        .select('*')
        .eq('id', tag.id)
        .single(),
    );
  },
  async getProductsByAssignedTag(
    tag: RequireProperty<Category, 'id'>,
  ): DatabaseQuery<CategorizedProduct[], '*'> {
    return query(
      await supabase
        .from('Category_Assigned_Products')
        .select('*')
        .eq('category_id', tag.id),
    );
  },
  async getAssignedTagsByProduct(
    product: RequireProperty<Product, 'id'>,
  ): DatabaseQuery<CategorizedProduct[], '*'> {
    return query(
      await supabase
        .from('Category_Assigned_Products')
        .select('*')
        .eq('product_id', product.id),
    );
  },
};

/**
 * See the implementation below for more information.
 */
interface ProductCatalogue {
  /**
   * Retrieves products by the given product identifier(s).
   * Selects all columns.
   *
   * @param products the given product identifier(s)
   * @returns the {@link Promise} that resolves to the corresponding product(s)
   */
  get: (
    products: RequireProperty<Product, 'id'>[],
  ) => DatabaseQuery<Product[], '*'>;

  /**
   * Retrieves products listed by the given seller.
   * Selects all columns.
   *
   * @param seller the given user identifier
   * @returns the {@link Promise} that resolves to the corresponding products
   */
  getBySeller: (
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Product[], '*'>;

  /**
   * Retrieves products by the given search query.
   * Selects all columns.
   *
   * @param text the given search query
   * @returns the {@link Promise} that resolves the corresponding products
   */
  getBySearch: (text: string) => DatabaseQuery<Product[], '*'>;

  /**
   * Retrieves products by filters.
   * Uses a filter builder to adjust the query.
   *
   * @see {@link ProductFilterBuilder} for more information on its builder features
   * @returns the {@link Promise} that resolves products passed from the selected filters
   */
  getByFilter: () => ProductFilterBuilder;
}

/**
 * The product catalogue feature is used to serve registered products to users.
 * Buyers may fetch a specific product, search via keywords, or filter to retrieve desired product(s), if avaiable.
 * Sellers must register products for public listing.
 * Only publicly listed products are shown to buyers.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 * @see {@link ProductListing} for product registration and modification
 */
export const ProductCatalogue: ProductCatalogue = {
  async get(
    products: RequireProperty<Product, 'id'>[],
  ): DatabaseQuery<Product[], '*'> {
    return query(
      await supabase
        .from('Product_Information')
        .select('*')
        .in(
          'id',
          products.map((product) => product.id),
        ),
    );
  },
  async getBySeller(
    seller: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Product[], '*'> {
    return query(
      await supabase
        .from('Product_Information')
        .select('*')
        .eq('user_id', seller.supabase_id),
    );
  },
  async getBySearch(text: string): DatabaseQuery<Product[], '*'> {
    const search = text.replace(/[%_\\]/g, '\\$&'); // prevents sql injection
    return query(
      await supabase
        .from('Product_Information')
        .select('*')
        .or(`title.ilike.%${search}%,content.ilike.%${search}%`),
    );
  },
  getByFilter(): ProductFilterBuilder {
    const filter: Partial<ProductFilter> = {};

    return {
      seller(
        seller: RequireProperty<UserProfile, 'supabase_id'>,
      ): Result<string> {
        const id = seller.supabase_id;

        if (!id) {
          return err('Missing product seller', seller);
        } else {
          return ok((filter.seller = id));
        }
      },
      price(
        form: FormData,
        key = ['min-price', 'max-price'],
      ): [Result<number>, Result<number>] {
        const min: () => Result<number> = () => {
          const { data, error } = FormUtils.getString(form, key[0]);

          if (error) {
            return err('Invalid minimum product price', error);
          } else if (!data) {
            return err('Minimum price is empty');
          } else if (REGEX_LETTERS_ONLY.test(data)) {
            return err('Minimum price cannot have letters', data);
          } else {
            const value = +data;

            if (value < 0) {
              return err('Minimum price cannot be negative', value);
            } else {
              return ok(value);
            }
          }
        };

        const max: () => Result<number> = () => {
          const { data, error } = FormUtils.getString(form, key[1]);

          if (error) {
            return err('Invalid maximum product price', error);
          } else if (!data) {
            return err('Maximum price is empty');
          } else if (REGEX_LETTERS_ONLY.test(data)) {
            return err('Maximum price cannot have letters', data);
          } else {
            const value = +data;

            if (value < 0) {
              return err('Maximum price cannot be negative', value);
            } else {
              return ok(value);
            }
          }
        };

        const range: [Result<number>, Result<number>] = [min(), max()];
        const [pmin, pmax] = range;

        if (pmin.ok && pmax.ok) {
          if (pmin.data > pmax.data) {
            return [
              err('Minimum price exceeds maximum price', range),
              err('Maximum price is less than minimum price', range),
            ];
          }

          filter.price = {
            min: pmin.data,
            max: pmax.data,
          };
        }

        return range;
      },
      stock(
        form: FormData,
        key = ['min-stock', 'max-stock'],
      ): [Result<number>, Result<number>] {
        const min: () => Result<number> = () => {
          const { data, error } = FormUtils.getString(form, key[0]);

          if (error) {
            return err('Invalid minimum product stock', error);
          } else if (!data) {
            return err('Minimum stock is empty');
          } else if (REGEX_LETTERS_ONLY.test(data)) {
            return err('Minimum stock cannot have letters', data);
          } else {
            const value = +data;

            if (value < 0) {
              return err('Minimum stock cannot be negative', value);
            } else {
              return ok(value);
            }
          }
        };

        const max: () => Result<number> = () => {
          const { data, error } = FormUtils.getString(form, key[1]);

          if (error) {
            return err('Invalid maximum product stock', error);
          } else if (!data) {
            return err('Maximum stock is empty');
          } else if (REGEX_LETTERS_ONLY.test(data)) {
            return err('Maximum stock cannot have letters', data);
          } else {
            const value = +data;

            if (value < 0) {
              return err('Maximum stock cannot be negative', value);
            } else {
              return ok(value);
            }
          }
        };

        const range: [Result<number>, Result<number>] = [min(), max()];
        const [smin, smax] = range;

        if (smin.ok && smax.ok) {
          if (smin.data > smax.data) {
            return [
              err('Minimum stock exceeds maximum stock', range),
              err('Maximum stock is less than minimum stock', range),
            ];
          }

          filter.stock = {
            min: smin.data,
            max: smax.data,
          };
        }

        return range;
      },
      categories(form: FormData, key = 'categories'): Result<number[]> {
        const { data, error } = FormUtils.getStrings(form, key);

        if (error) {
          return err('Invalid product category tag(s)', error);
        } else {
          const ids: number[] = [];

          for (const value of data) {
            const id = +value;

            if (!value || isNaN(id) || id < 0) {
              return err('Invalid product category tag', value);
            } else {
              ids.push(id);
            }
          }

          return ok(ids);
        }
      },
      async submit(): DatabaseQuery<Product[], '*'> {
        const prepare = supabase
          .from('Product_Information')
          .select('*, categorized:category_assigned_products(*)');

        if (filter.seller) {
          prepare.eq('user_id', filter.seller);
        }

        if (filter.categories) {
          prepare.in('categorized.category_id', filter.categories);
        }

        if (filter.price) {
          prepare.gte('price', filter.price.min);
          prepare.lte('price', filter.price.max);
        }

        if (filter.stock) {
          prepare.gte('price', filter.stock.min);
          prepare.lte('price', filter.stock.max);
        }

        return query(await prepare);
      },
    };
  },
};
