import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react'
import { productService } from '../../api/product.service'
import { cartService } from '../../api/cart.service'
import { Loader } from '../../components/Loader/Loader'
import { useAuth } from '../../context/AuthContext'
import styles from './ProductDetail.module.css'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.findOne(Number(id)),
    enabled: !!id,
  })

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(Number(id)),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart)
    },
  })

  if (isLoading) return <Loader />
  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!product) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      await addToCartMutation.mutateAsync()
    } catch {
      alert('Failed to add to cart')
    }
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className={styles.productGrid}>
        <div className={styles.imageSection}>
          <div className={styles.imageCard}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
            />
            <div className={styles.badge}>
              {product.category?.name || 'New'}
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.breadCrumb}>
            Home / Products / {product.category?.name || 'General'}
          </div>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#ffc107" color="#ffc107" />
              ))}
            </div>
            <span className={styles.reviews}>(4.8 / 5.0 - 124 reviews)</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceSection}>
            <div className={styles.priceLabel}>Price</div>
            <div className={styles.price}>{formattedPrice}</div>
          </div>

          <div className={styles.actionSection}>
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              <ShoppingCart size={20} />
              {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className={styles.wishlistButton}>Add to Wishlist</button>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <strong>Free Shipping</strong> on orders over $100
            </div>
            <div className={styles.featureItem}>
              <strong>Easy Returns</strong> within 30 days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
