import type { Category } from './category'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  category?: Category
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  category_id: number
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  category_id?: number
}
