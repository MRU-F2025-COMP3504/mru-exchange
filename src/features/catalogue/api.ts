import { query, supabase } from '@shared/api';
import type {
  DatabaseQuery,
  Category,
  RequiredColumns,
  CategorizedProduct,
  Product,
  UserProfile,
  Result,
} from '@shared/types';
import { err, ok } from '@shared/utils';
import type { ProductFilter } from '@features/catalogue';

/**
 * See the implementation below for more information.
 */
interface CategoryCatalogue {
  /**
   * Retrieves all category tags.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves to a collection of category tags
   */
  getTags: () => DatabaseQuery<Category[], '*'>;

  /**
   * Retrieves the given category tag.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param tag the given category tag identifier
   * @returns a promise that resolves to the corresponding category tag that corresponds to the identifier
   */
  getTag: (
    tag: RequiredColumns<Category, 'id'>,
  ) => DatabaseQuery<Category, '*'>;

  /**
   * Retrieves products by the given category tag that is assigned.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param tag the given category tag identifier
   * @returns a promise that resolves to the corresponding products with the given category
   */
  getProductsByAssignedTag: (
    tag: RequiredColumns<Category, 'id'>,
  ) => DatabaseQuery<CategorizedProduct[], '*'>;

  /**
   * Retrieves category tags that are assigned to the given product.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param product the given product identifier
   * @returns a promise that corresponds category tags with the given product
   */
  getAssignedTagsByProduct: (
    product: RequiredColumns<Product, 'id'>,
  ) => DatabaseQuery<CategorizedProduct[], '*'>;
}

/**
 * The category catalogue is used to assign products for search queries and product organization.
 * Sellers can assign their products with one or more category tags that can be best represented.
 * Category tags influences user recommendations and search queries, enhancing product exposure.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export const CategoryCatalogue: CategoryCatalogue = {
  getTags: async (): DatabaseQuery<Category[], '*'> => {
    return query(
      await supabase
        .from('Category_Tags')
        .select('*')
        .order('name', { ascending: true }),
    );
  },
  getTag: async (
    tag: RequiredColumns<Category, 'id'>,
  ): DatabaseQuery<Category, '*'> => {
    return query(
      await supabase
        .from('Category_Tags')
        .select('*')
        .eq('id', tag.id)
        .single(),
    );
  },
  getProductsByAssignedTag: async (
    tag: RequiredColumns<Category, 'id'>,
  ): DatabaseQuery<CategorizedProduct[], '*'> => {
    return query(
      await supabase
        .from('Category_Assigned_Products')
        .select('*')
        .eq('category_id', tag.id),
    );
  },
  getAssignedTagsByProduct: async (
    product: RequiredColumns<Product, 'id'>,
  ): DatabaseQuery<CategorizedProduct[], '*'> => {
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
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param products the given product identifier(s)
   * @returns a promise that resolves to the corresponding product(s)
   */
  get: (
    products: RequiredColumns<Product, 'id'>[],
  ) => DatabaseQuery<Product[], '*'>;

  /**
   * Retrieves products listed by the given seller.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param seller the given user identifier
   * @returns a promise that resolves to the corresponding products
   */
  getBySeller: (
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<Product[], '*'>;

  /**
   * Retrieves products by the given search query.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param text the given search query
   * @returns a promise that resolves the corresponding products
   */
  getBySearch: (text: string) => DatabaseQuery<Product[], '*'>;

  /**
   * Retrieves products by filters.
   * Uses a filter builder to adjust the query.
   * See the {@link ProductFilter} for more information.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a promise that resolves products passed from the selected filters
   */
  getByFilter: () => ProductFilter;
}

/**
 * The product catalogue is used to serve registered products to users.
 * Buyers can fetch a specific product, search via keywords, or filter to retrieve desired product(s), if avaiable.
 * Sellers must register products for public listing.
 * Only publicly listed products are shown to buyers.
 *
 * @see {@link ProductListing} for product registration and modification
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export const ProductCatalogue: ProductCatalogue = {
  get: async (
    products: RequiredColumns<Product, 'id'>[],
  ): DatabaseQuery<Product[], '*'> => {
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
  getBySeller: async (
    seller: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<Product[], '*'> => {
    return query(
      await supabase
        .from('Product_Information')
        .select('*')
        .eq('user_id', seller.supabase_id),
    );
  },
  getBySearch: async (text: string): DatabaseQuery<Product[], '*'> => {
    const search = text.replace(/[%_\\]/g, '\\$&'); // prevents sql injection
    return query(
      await supabase
        .from('Product_Information')
        .select('*')
        .or(`title.ilike.%${search}%,content.ilike.%${search}%`),
    );
  },
  getByFilter: (): ProductFilter => {
    let sql = supabase.from('Product_Information').select('id');
    let categories: RequiredColumns<Category, 'id'>[] = [];

    return {
      seller(
        seller: RequiredColumns<UserProfile, 'supabase_id'>,
      ): Result<ProductFilter> {
        if (!seller.supabase_id) {
          return err(new Error('Seller ID is not specified'));
        } else {
          sql = sql.eq('user_id', seller.supabase_id);
        }

        return ok(this);
      },
      price(a: number, b: number): Result<ProductFilter> {
        if (a < 0 || b < 0) {
          return err(
            new Error('Product price range cannot be negative', {
              cause: { a, b },
            }),
          );
        } else {
          sql = sql.gte('price', Math.min(a, b));
          sql = sql.lte('price', Math.max(a, b));
        }

        return ok(this);
      },
      stock(a: number, b: number): Result<ProductFilter> {
        if (a < 0 || b < 0) {
          return err(
            new Error('Product stock range cannot be negative', {
              cause: { a, b },
            }),
          );
        } else {
          sql = sql.gte('stock_count', Math.min(a, b));
          sql = sql.lte('stock_count', Math.max(a, b));
        }

        return ok(this);
      },
      categories(
        values: RequiredColumns<Category, 'id'>[],
      ): Result<ProductFilter> {
        categories = values;

        return ok(this);
      },
      async find(): DatabaseQuery<Product[], 'id'> {
        const products = query(await sql);

        if (categories.length === 0 || !products.ok) {
          return products;
        }

        return query(
          await supabase
            .from('Category_Assigned_Products')
            .select('id:product_id')
            .in(
              'product_id',
              products.data.map((product) => product.id),
            )
            .in(
              'category_id',
              categories.map((category) => category.id),
            ),
        );
      },
    };
  },
};
