import React, {useEffect, useState, useRef} from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
} from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {CollectionStackParamList} from '../navigation/types'
import {Product, Variant} from '../types/productTypes'
import testProducts from '../assets/testProducts.json'
import {useCart} from '../context/CartContext'
import VariantGrid from '../components/VariantGrid'

// A single toast item: unique ID + separate animation values
type ToastItem = {
  id: number
  opacityAnim: Animated.Value
  translateYAnim: Animated.Value
}

type Props = NativeStackScreenProps<CollectionStackParamList, 'ProductDetails'>

const ProductDetailsScreen: React.FC<Props> = ({route}) => {
  const {productId} = route.params
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

  const {addToCart} = useCart()

  // Keep an array of toast items so we can show multiple simultaneously
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Counter for generating unique toast IDs
  const toastIdCounter = useRef(0)

  useEffect(() => {
    const data = testProducts as Product[]
    const found = data.find(p => p.id === productId)
    if (found) {
      setProduct(found)
      const firstAvail = found.variants.find(v => v.availableForSale)
      if (firstAvail) {
        setSelectedVariant(firstAvail)
      }
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      return
    }

    const variantImage = selectedVariant.image?.url
      ? selectedVariant.image.url
      : product.images[0]?.url || ''

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: parseFloat(selectedVariant.price.amount),
      imageUrl: variantImage,
      quantity: 1,
    })

    Vibration.vibrate(50)
    spawnToast()
  }

  // Spawns a new toast with its own animation, auto-removes after fade out
  const spawnToast = () => {
    const id = toastIdCounter.current++
    const opacityAnim = new Animated.Value(0)
    const translateYAnim = new Animated.Value(20)

    const newToast: ToastItem = {id, opacityAnim, translateYAnim}

    // Add new toast to state
    setToasts(prev => [...prev, newToast])

    // Animate in
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait 2 seconds, then animate out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Remove this toast from state
          setToasts(prev => prev.filter(t => t.id !== id))
        })
      }, 2000)
    })
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found.</Text>
      </View>
    )
  }

  const mainImageUrl =
    selectedVariant?.image?.url || product.images[0]?.url || ''
  const displayPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount).toFixed(2)
    : 'N/A'

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View>
          <View style={styles.bgImageContainer}>
            <Image source={{uri: mainImageUrl}} style={styles.bgImage} />
          </View>
          <Image source={{uri: mainImageUrl}} style={styles.image} />
        </View>
        <View style={styles.dividerLine} />
        <View style={styles.productInfo}>
          <View style={styles.titleAndVariant}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.variant}>{selectedVariant?.title}</Text>
            </View>
            <Text style={styles.price}>${displayPrice}</Text>
          </View>
          <View style={styles.dividerLine} />
          <Text style={styles.descriptionHeading}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.dividerLine} />
          <VariantGrid
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
          />
        </View>
      </ScrollView>

      {/* Render all toasts */}
      {toasts.map(toast => (
        <Animated.View
          key={toast.id}
          style={[
            styles.cartToast,
            {
              opacity: toast.opacityAnim,
              transform: [{translateY: toast.translateYAnim}],
            },
          ]}>
          <Text style={styles.cartToastText}>Added to cart!</Text>
        </Animated.View>
      ))}

      <TouchableOpacity
        style={styles.floatingCartAdd}
        onPress={handleAddToCart}>
        <Text style={styles.floatingCartAddText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productInfo: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  titleAndVariant: {
    marginBottom: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bgImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  bgImage: {
    width: '110%',
    height: '110%',
    right: '5%',
    bottom: '5%',
    opacity: 0.4,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  dividerLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  titleContainer: {
    width: '75%',
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  variant: {
    fontSize: 20,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    marginVertical: 8,
    fontWeight: '600',
  },
  descriptionHeading: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 600,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  floatingCartAdd: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#22985b',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    justifyContent: 'center',
  },
  floatingCartAddText: {
    fontSize: 36,
    lineHeight: 40,
    color: '#fff',
    textAlign: 'center',
  },
  cartToast: {
    position: 'absolute',
    width: '25%',
    bottom: 85,
    right: 8,
    padding: 8,
    backgroundColor: '#0cec93',
    borderRadius: 4,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  cartToastText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
})
