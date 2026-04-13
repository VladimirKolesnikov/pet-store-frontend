import React from 'react';
import { ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.css';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className={styles.card}>
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
          <button className={styles.button} aria-label="Add to cart">
            <ShoppingCart size={18} />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
