import apiClient from './apiClient';
import type { Category } from '../components/Header/types';

const ROOT_CATEGORY_ID = '23';

export const categoryService = {
  getChildren: async (parentId: string = ROOT_CATEGORY_ID) => {
    const response = await apiClient.get<Category[]>(`/categories/${parentId}/children`);
    return response.data;
  }
};
