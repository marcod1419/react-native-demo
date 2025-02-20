import React, {createContext, useReducer, useContext} from 'react'

interface CartItem {
  productId: string
  variantId: string
  title: string
  variantTitle: string
  price: number
  imageUrl: string
  quantity: number
}

type CartAction =
  | {type: 'ADD_TO_CART'; payload: CartItem}
  | {type: 'REMOVE_FROM_CART'; payload: {variantId: string}}
  | {type: 'CHANGE_QUANTITY'; payload: {variantId: string; quantity: number}}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.variantId === action.payload.variantId,
      )

      if (existingItemIndex >= 0) {
        // Increase quantity
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return {...state, items: updatedItems}
      } else {
        return {...state, items: [...state.items, action.payload]}
      }
    }
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(
        item => item.variantId !== action.payload.variantId,
      )
      return {...state, items: updatedItems}
    }
    case 'CHANGE_QUANTITY': {
      const {variantId, quantity} = action.payload
      const existingItem = state.items.find(
        item => item.variantId === variantId,
      )

      if (!existingItem) {
        return state
      }

      const updatedItems = state.items.map(item =>
        item.variantId === variantId ? {...item, quantity} : item,
      )

      return {...state, items: updatedItems}
    }
    default:
      return state
  }
}

export const CartContext = createContext<{
  state: CartState
  addToCart: (item: CartItem) => void
  removeFromCart: (variantId: string) => void
  changeQuantity: (variantId: string, quantity: number) => void
}>({
  state: initialState,
  addToCart: () => {},
  removeFromCart: () => {},
  changeQuantity: () => {},
})

export const CartProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addToCart = (item: CartItem) => {
    dispatch({type: 'ADD_TO_CART', payload: item})
  }

  const removeFromCart = (variantId: string) => {
    dispatch({type: 'REMOVE_FROM_CART', payload: {variantId}})
  }

  const changeQuantity = (variantId: string, quantity: number) => {
    dispatch({type: 'CHANGE_QUANTITY', payload: {variantId, quantity}})
  }

  return (
    <CartContext.Provider
      value={{state, addToCart, removeFromCart, changeQuantity}}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook for convenience
export function useCart() {
  return useContext(CartContext)
}
