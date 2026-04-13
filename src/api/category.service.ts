import apiClient from './apiClient';
import type { Category } from '../types/category';

const ROOT_CATEGORY_ID = '53';

export const categoryService = {
  getChildren: async (parentId: string = ROOT_CATEGORY_ID) => {
    const response = await apiClient.get<Category[]>(`/categories/${parentId}/children`);
    return response.data;
  }
};
