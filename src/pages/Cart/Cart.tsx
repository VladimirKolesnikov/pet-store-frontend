import React, { useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  cartService,
  type CartItem,
  type Cart as CartType,
} from '../../api/cart.service'
import { Loader } from '../../components/Loader/Loader'
import { useAuth } from '../../context/AuthContext'
import styles from './Cart.module.css'

const CartItemRow: React.FC<{
  item: CartItem
  updateQuantityMutation: UseMutationResult<
    CartType,
    Error,
    { id: number; quantity: number },
    unknown
  >
  removeMutation: UseMutationResult<CartType, Error, number, unknown>
}> = ({ item, updateQuantityMutation, removeMutation }) => {
  const [localQuantity, setLocalQuantity] = React.useState(item.quantity)

  React.useEffect(() => {
    setLocalQuantity(item.quantity)
  }, [item.quantity])

  const handleMinus = () => {
    if (localQuantity <= 1) return
    const newQty = localQuantity - 1
    setLocalQuantity(newQty)
    updateQuantityMutation.mutate({ id: item.id, quantity: newQty })
  }

  const handlePlus = () => {
    const newQty = localQuantity + 1
    setLocalQuantity(newQty)
    updateQuantityMutation.mutate({ id: item.id, quantity: newQty })
  }

  const isUpdating =
    updateQuantityMutation.isPending &&
    updateQuantityMutation.variables?.id === item.id
  const isRemoving =
    removeMutation.isPending && removeMutation.variables === item.id

  return (
    <div className={styles.cartItem} style={{ opacity: isRemoving ? 0.5 : 1 }}>
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className={styles.image}
      />
      <div className={styles.details}>
        <h3 className={styles.productName}>{item.product.name}</h3>
        <div className={styles.price}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(item.product.price)}
        </div>
        <div className={styles.price}>
          Line total:{' '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(item.product.price * localQuantity)}
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.quantityControl}>
          <button
            className={styles.qtyBtn}
            onClick={handleMinus}
            disabled={localQuantity <= 1 || isUpdating}
          >
            <Minus size={16} />
          </button>
          <span className={styles.quantity}>{localQuantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={handlePlus}
            disabled={isUpdating}
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          className={styles.removeBtn}
          onClick={() => removeMutation.mutate(item.id)}
          disabled={isRemoving}
          aria-label="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}

export const Cart: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  })

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartService.updateQuantity(id, quantity),
    onSuccess: (nextCart) => {
      queryClient.setQueryData(['cart'], nextCart)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => cartService.removeFromCart(id),
    onSuccess: (nextCart) => {
      queryClient.setQueryData(['cart'], nextCart)
    },
  })

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthLoading, isAuthenticated, navigate])

  if (isAuthLoading || isLoading) return <Loader />
  if (!isAuthenticated) return null
  if (error) {
    return (
      <div className={styles.error}>An error occurred loading your cart.</div>
    )
  }

  const items = cart?.items || []
  const isEmpty = items.length === 0

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total)

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        <ArrowLeft size={20} /> Continue Shopping
      </button>

      <h1 className={styles.title}>Your Cart</h1>

      {isEmpty ? (
        <div className={styles.emptyCart}>
          <ShoppingBag size={80} className={styles.emptyIcon} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => navigate('/')} className={styles.shopButton}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                updateQuantityMutation={updateQuantityMutation}
                removeMutation={removeMutation}
              />
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Items</span>
              <span>{totalQuantity}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formattedTotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>
            <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
