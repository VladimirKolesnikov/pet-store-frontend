import apiClient from './apiClient';
import type { Product, CreateProductDto, UpdateProductDto } from '../types/product';

export const productService = {
  findAll: async () => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  findOne: async (id: number) => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto) => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductDto) => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  uploadImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Product>(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  remove: async (id: number) => {
    const response = await apiClient.delete<void>(`/products/${id}`);
    return response.data;
  },
};
