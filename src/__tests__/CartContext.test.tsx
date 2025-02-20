import React from 'react'
import {View, Text, Button} from 'react-native'
import {render, fireEvent} from '@testing-library/react-native'

import {CartProvider, useCart} from '../context/CartContext'

/**
 * Test Component that uses our CartContext.
 * We’ll have buttons that call the context methods,
 * and a small display of the cart length and item quantity.
 */
const TestCartComponent = () => {
  const {state, addToCart, removeFromCart, changeQuantity} = useCart()

  const totalItems = state.items.length
  const firstItemQuantity = totalItems > 0 ? state.items[0].quantity : 0

  return (
    <View>
      <Text testID="totalItems">{totalItems}</Text>
      <Text testID="firstItemQuantity">{firstItemQuantity}</Text>

      {/* Add an item to the cart */}
      <Button
        testID="addButton"
        title="Add to Cart"
        onPress={() =>
          addToCart({
            productId: '1',
            variantId: '1',
            title: 'Product 1',
            variantTitle: 'Variant 1',
            price: 10,
            imageUrl: 'https://example.com/image',
            quantity: 1,
          })
        }
      />

      {/* Add the same item again to see if quantity increments */}
      <Button
        testID="addSameItemButton"
        title="Add Same Item"
        onPress={() =>
          addToCart({
            productId: '1',
            variantId: '1',
            title: 'Product 1',
            variantTitle: 'Variant 1',
            price: 10,
            imageUrl: 'https://example.com/image',
            quantity: 2,
          })
        }
      />

      {/* Remove the item by variantId */}
      <Button
        testID="removeButton"
        title="Remove from Cart"
        onPress={() => removeFromCart('1')}
      />

      {/* Change the quantity to a specific value */}
      <Button
        testID="changeQuantityButton"
        title="Change Quantity"
        onPress={() => changeQuantity('1', 5)}
      />
    </View>
  )
}

describe('CartContext', () => {
  test('adds a new item to the cart', () => {
    const {getByTestId} = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>,
    )

    const totalItemsText = getByTestId('totalItems')
    expect(totalItemsText.props.children).toBe(0)

    fireEvent.press(getByTestId('addButton'))
    expect(totalItemsText.props.children).toBe(1)
  })

  test('increments the quantity if the same variant is added again', () => {
    const {getByTestId} = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>,
    )

    const totalItemsText = getByTestId('totalItems')
    const firstItemQuantityText = getByTestId('firstItemQuantity')

    // Initially cart should be empty
    expect(totalItemsText.props.children).toBe(0)
    expect(firstItemQuantityText.props.children).toBe(0)

    // Add first time
    fireEvent.press(getByTestId('addButton'))
    expect(totalItemsText.props.children).toBe(1)
    expect(firstItemQuantityText.props.children).toBe(1)

    // Add the same item again, but quantity=2
    fireEvent.press(getByTestId('addSameItemButton'))
    expect(totalItemsText.props.children).toBe(1) // still one item
    expect(firstItemQuantityText.props.children).toBe(3) // 1 + 2 = 3
  })

  test('removes an item from the cart', () => {
    const {getByTestId} = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>,
    )

    const totalItemsText = getByTestId('totalItems')

    // Add item so we can remove it
    fireEvent.press(getByTestId('addButton'))
    expect(totalItemsText.props.children).toBe(1)

    // Remove the item
    fireEvent.press(getByTestId('removeButton'))
    expect(totalItemsText.props.children).toBe(0)
  })

  test('changes the quantity of an existing item', () => {
    const {getByTestId} = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>,
    )

    const totalItemsText = getByTestId('totalItems')
    const firstItemQuantityText = getByTestId('firstItemQuantity')

    // Add an item first
    fireEvent.press(getByTestId('addButton'))
    expect(totalItemsText.props.children).toBe(1)
    expect(firstItemQuantityText.props.children).toBe(1)

    // Change the item quantity to 5
    fireEvent.press(getByTestId('changeQuantityButton'))
    expect(firstItemQuantityText.props.children).toBe(5)
  })
})
