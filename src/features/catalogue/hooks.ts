import type {
  CategorizedProduct,
  Category,
  DatabaseQuery,
  DatabaseQueryResult,
  Product,
  RequireProperty,
  UserProfile,
} from '@shared/types';
import { err, HookUtils } from '@shared/utils';
import { useEffect, useState } from 'react';
import { CategoryCatalogue, ProductCatalogue } from './api';
import type { ProductFilterBuilder } from './types';

/**
 * The return type for the {@link useCategories()} hook.
 */
interface UseCategories {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain all category tags
   */
  result: UseCategoriesResult;
}

/**
 * An alias for the category tag array query result.
 */
type UseCategoriesResult = DatabaseQueryResult<Category[], '*'>;

/**
 * Hooks the functionality of fetching all category tags.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link CategoryCatalogue.getTags()} for more information
 */
export function useCategories(): UseCategories {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategoriesResult>(() =>
    err('No categories found'),
  );

  /**
   * Loads the category tags once per invocation.
   */
  useEffect(() => {
    void HookUtils.load(setLoading, CategoryCatalogue.getTags()).then(
      setResult,
    );
  }, []);

  return {
    loading,
    result,
  };
}

/**
 * The return type for the {@link useCategorizedProducts()} hook.
 */
interface UseCategorizedProducts {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain the specified categorized product(s)
   */
  result: UseCategorizedProductsResult;
}

/**
 * An alias for the categorized product array query result.
 */
type UseCategorizedProductsResult = DatabaseQueryResult<
  CategorizedProduct[],
  '*'
>;

/**
 * Hooks the functionality of fetching categorized product(s) by the given category tag.
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link CategoryCatalogue.getProductsByAssignedTag()} for more information
 */
export function useCategorizedProducts(
  category: RequireProperty<Category, 'id'>,
): UseCategorizedProducts {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategorizedProductsResult>(() =>
    err('No categorized products found'),
  );

  /**
   * Loads the categorized products once per invocation.
   * Updates the hook state when its dependencies (i.e., category) changes state.
   */
  useEffect(() => {
    void HookUtils.load(
      setLoading,
      CategoryCatalogue.getProductsByAssignedTag(category),
    ).then(setResult);
  }, [category]);

  return {
    loading,
    result,
  };
}

/**
 * The return type for the {@link useCategory()} hook.
 */
interface UseCategory {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain the specified category tag
   */
  result: UseCategoryResult;
}

/**
 * An alias for the category tag query result.
 */
type UseCategoryResult = DatabaseQueryResult<Category, '*'>;

/**
 * Hooks the functionality of fetching the given category tag.
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link CategoryCatalogue.getTag()} for more information
 */
export function useCategory(
  category: RequireProperty<Category, 'id'>,
): UseCategory {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategoryResult>(() =>
    err('No category found'),
  );

  /**
   * Loads the category tag once per invocation.
   * Updates the hook state when its dependencies (i.e., category) changes state.
   */
  useEffect(() => {
    void HookUtils.load(setLoading, CategoryCatalogue.getTag(category)).then(
      setResult,
    );
  }, [category]);

  return {
    loading,
    result,
  };
}

/**
 * The return type for the {@link useProductFilter()} hook.
 */
interface UseProductFilter {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain product(s) that passed the filters
   */
  result: UseProductFilterResult;
}

/**
 * An alias for the product filter query result.
 */
type UseProductFilterResult = DatabaseQueryResult<Product[], 'id'>;

/**
 * Hooks product filtering functionality.
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link ProductCatalogue.getByFilter()} for more information
 */
export function useProductFilter(
  run: (filter: ProductFilterBuilder) => DatabaseQuery<Product[], 'id'>,
): UseProductFilter {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductFilterResult>(() =>
    err('No products found'),
  );

  /**
   * Creates a new product filter once per invocation.
   * Updates the hook state when its dependencies (i.e., run()) changes state.
   */
  useEffect(() => {
    void HookUtils.load(setLoading, run(ProductCatalogue.getByFilter())).then(
      setResult,
    );
  }, [run]);

  return {
    loading,
    result,
  };
}

/**
 * The return type for the {@link useProductSearch()} hook.
 */
interface UseProductSearch {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain searched product(s)
   */
  result: UseProductSearchResult;
}

/**
 * An alias for the product search query result.
 */
type UseProductSearchResult = DatabaseQueryResult<Product[], '*'>;

/**
 * Hooks product searching functionality.
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link ProductCatalogue.getBySearch()} for more information
 */
export function useProductSearch(text: string): UseProductSearch {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductSearchResult>(() =>
    err('No products found'),
  );

  /**
   * Loads the products that matches the search query once per invocation.
   * Updates the hook state when its dependencies (i.e., text) changes state.
   */
  useEffect(() => {
    void HookUtils.load(setLoading, ProductCatalogue.getBySearch(text)).then(
      setResult,
    );
  }, [text]);

  return {
    loading,
    result,
  };
}

/**
 * The return type for the {@link useProducts()} hook.
 */
interface UseProducts {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain the given product(s)
   */
  result: UseProductsResult;
}

/**
 * An alias for the product array query result.
 */
type UseProductsResult = DatabaseQueryResult<Product[], '*'>;

/**
 * Hooks the functionality of fetching the given product(s).
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link ProductCatalogue.get()} for more information
 */
export function useProducts(
  products: RequireProperty<Product, 'id'>[],
): UseProducts {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductsResult>(() =>
    err('No products found'),
  );

  /**
   * Loads the products once per invocation.
   * Updates the hook state when its dependencies (i.e., products) changes state.
   */
  useEffect(() => {
    void HookUtils.load(setLoading, ProductCatalogue.get(products)).then(
      setResult,
    );
  }, [products]);

  return {
    loading,
    result,
  };
}

/**
 * The return type for the {@link useSellerProducts()} hook.
 */
interface UseProductsBySeller {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns the {@link DatabaseQueryResult} that may contain the given seller's product(s)
   */
  result: UseProductsBySellerResult;
}

/**
 * An alias for the seller product array query result.
 */
type UseProductsBySellerResult = DatabaseQueryResult<Product[], '*'>;

/**
 * Hooks the functionality of fetching products from the given seller.
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewal)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link ProductCatalogue.getBySeller()} for more information
 */
export function useSellerProducts(
  seller: RequireProperty<UserProfile, 'supabase_id'>,
): UseProductsBySeller {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductsBySellerResult>(() =>
    err('No products found'),
  );

  /**
   * Loads the seller once per invocation.
   * Updates the hook state when its dependencies (i.e., seller) changes state.
   */
  useEffect(() => {
    void HookUtils.load(setLoading, ProductCatalogue.getBySeller(seller)).then(
      setResult,
    );
  }, [seller]);

  return {
    loading,
    result,
  };
}
