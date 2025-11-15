import type {
  DatabaseQueryResult,
  Category,
  CategorizedProduct,
  RequiredColumns,
  DatabaseQuery,
  Product,
  UserProfile,
} from '@shared/types';
import { empty, HookUtils } from '@shared/utils';
import { useState, useEffect } from 'react';
import { CategoryCatalogue, ProductCatalogue } from './api';
import type { ProductFilter } from './types';

/**
 * The return type for the {@link useCategories()} hook.
 */
interface UseCategoriesReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain all category tags
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
 * @see {@link CategoryCatalogue.getTags()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useCategories(): UseCategoriesReturn {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategoriesResult>(() => empty());

  /**
   *Loads the category tags once.
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
interface UseCategorizedProductsReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain the specified categorized product(s)
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
 * @see {@link CategoryCatalogue.getProductsByAssignedTag()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useCategorizedProducts(
  category: RequiredColumns<Category, 'id'>,
): UseCategorizedProductsReturn {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategorizedProductsResult>(() =>
    empty(),
  );

  /**
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
interface UseCategoryReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain the specified category tag
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
 * @see {@link CategoryCatalogue.getTag()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useCategory(
  category: RequiredColumns<Category, 'id'>,
): UseCategoryReturn {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseCategoryResult>(() => empty());

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
interface UseProductFilterReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain product(s) that passed the filters
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
 * @see {@link ProductCatalogue.getByFilter()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useProductFilter(
  run: (filter: ProductFilter) => DatabaseQuery<Product[], 'id'>,
): UseProductFilterReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductFilterResult>(() => empty());

  /**
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
interface UseProductSearchReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain searched product(s)
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
 * @see {@link ProductCatalogue.getBySearch()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useProductSearch(text: string): UseProductSearchReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductSearchResult>(() => empty());

  /**
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
interface UseProductsReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain the given product(s)
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
 * @see {@link ProductCatalogue.get()} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useProducts(
  products: RequiredColumns<Product, 'id'>[],
): UseProductsReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductsResult>(() => empty());

  /**
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
interface UseProductsBySellerReturn {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current query result state.
   *
   * @returns a wrapped query result that may contain the given seller's product(s)
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
 * @see {@link ProductCatalogue.getBySeller()} for more information
 *
 * @author Sahil Grewal (SahilGrewal)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useSellerProducts(
  seller: RequiredColumns<UserProfile, 'supabase_id'>,
): UseProductsBySellerReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<UseProductsBySellerResult>(() =>
    empty(),
  );

  /**
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
