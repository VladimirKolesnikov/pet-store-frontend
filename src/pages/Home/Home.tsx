import { useQuery } from '@tanstack/react-query'
import { productService } from '../../api/product.service'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import styles from './Home.module.css'

export function Home() {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.findAll(),
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
      <h3>
        Welcome to Pet Store. Find the best products for your furry friends.
      </h3>
      <div className={styles.grid}>
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products?.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
