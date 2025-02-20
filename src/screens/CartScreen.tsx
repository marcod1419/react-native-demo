import React from 'react'
import {
  Alert,
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useCart} from '../context/CartContext'

const CartScreen: React.FC = () => {
  const {state, removeFromCart, changeQuantity} = useCart()

  const handleRemove = (variantId: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFromCart(variantId),
      },
    ])
  }

  const handleQuantityChange = (variantId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemove(variantId)
      return
    }
    changeQuantity(variantId, quantity)
  }

  const totalPrice = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        {state.items.length === 0 ? (
          <View style={styles.emptyCartCard}>
            <Text style={styles.emptyCartCardText}>🛒</Text>
            <Text style={styles.emptyCartCardText}>Your cart is empty!</Text>
            <Text style={styles.emptyCartCardSubtext}>Start shopping now!</Text>
          </View>
        ) : (
          <FlatList
            data={state.items}
            keyExtractor={item => item.variantId}
            renderItem={({item}) => (
              <View style={styles.cartItem}>
                <Image source={{uri: item.imageUrl}} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.bold}>{item.title}</Text>
                  <Text>Variant: {item.variantTitle}</Text>
                  <Text style={styles.bold}>
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    {'  '}({`$${item.price.toFixed(2)} x ${item.quantity}`})
                  </Text>
                </View>

                {/* Quantity controls + remove button */}
                <View style={styles.quantitySection}>
                  <View style={styles.quantityChanger}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleQuantityChange(item.variantId, item.quantity - 1)
                      }>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <TextInput
                      style={styles.quantityInput}
                      keyboardType="number-pad"
                      defaultValue={item.quantity.toString()}
                      maxLength={2}
                      onEndEditing={e => {
                        const finalValue = parseInt(e.nativeEvent.text, 10)
                        handleQuantityChange(
                          item.variantId,
                          isNaN(finalValue) ? 1 : finalValue,
                        )
                      }}
                    />

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleQuantityChange(item.variantId, item.quantity + 1)
                      }>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Button
                    title="Remove"
                    color="red"
                    onPress={() => handleRemove(item.variantId)}
                  />
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Checkout section */}
      <View style={styles.checkoutCard}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <View style={styles.checkoutButtonContainer}>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              state.items.length === 0 && styles.disabled,
            ]}
            disabled={state.items.length === 0}
            onPress={() =>
              Alert.alert(
                'Thank you!',
                'Your time checking out this app is appreciated!',
              )
            }>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 6,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  emptyCartCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    backgroundColor: '#fff',
    height: 400,
  },
  emptyCartCardText: {
    fontSize: 32,
    textAlign: 'center',
  },
  emptyCartCardSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  quantitySection: {
    height: 80,
    justifyContent: 'space-between',
  },
  quantityChanger: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    marginBottom: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#22985b',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  quantityInput: {
    flex: 1,
    width: 24,
    height: 36,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    paddingVertical: 4,
  },
  bold: {
    fontWeight: '600',
  },
  checkoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
  },
  totalText: {
    width: '50%',
    fontSize: 18,
    lineHeight: 36,
    fontWeight: '600',
  },
  checkoutButtonContainer: {
    width: 160,
  },
  checkoutButton: {
    backgroundColor: '#0cec93',
    padding: 8,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
})
