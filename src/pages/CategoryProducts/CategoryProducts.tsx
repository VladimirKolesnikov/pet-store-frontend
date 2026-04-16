import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { productService } from '../../api/product.service'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import styles from '../Home/Home.module.css'

export function CategoryProducts() {
  const { slug } = useParams<{ slug: string }>()

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', { category: slug }],
    queryFn: () => productService.findAll({ category: slug }),
    enabled: Boolean(slug),
  })

  if (isLoading) {
    return <div className={styles.loading}>Loading products...</div>
  }

  if (isError) {
    return (
      <div className={styles.error}>
        <p>Error loading products: {(error as Error).message}</p>
        <button className={styles.retryButton} onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3>Category: {slug}</h3>
      <div className={styles.grid}>
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products?.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
