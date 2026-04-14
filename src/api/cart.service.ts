import apiClient from './apiClient'

export interface CartProduct {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
}

export interface CartItem {
  id: number
  quantity: number
  product: CartProduct
}

export interface Cart {
  id: number
  createdAt: string
  items: CartItem[]
}

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<Cart>('/cart')
    return response.data
  },

  addToCart: async (productId: number, quantity = 1) => {
    const response = await apiClient.post<Cart>('/cart', { productId, quantity })
    return response.data
  },

  updateQuantity: async (id: number, quantity: number) => {
    const response = await apiClient.patch<Cart>(`/cart/${id}`, { quantity })
    return response.data
  },

  removeFromCart: async (id: number) => {
    const response = await apiClient.delete<Cart>(`/cart/${id}`)
    return response.data
  },
}
