import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../api/cart.service';
import { useAuth } from '../../context/AuthContext';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product.id),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart);
    },
  });

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCartMutation.mutateAsync();
    } catch {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick} role="button" tabIndex={0}>
      <div className={styles.imageContainer}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.image}
        />
        <div className={styles.badge}>{product.category?.name || 'New'}</div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formattedPrice}</span>
          <button 
            className={styles.button} 
            aria-label="Add to cart"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            <ShoppingCart size={18} />
            {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
