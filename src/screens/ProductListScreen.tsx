import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {CollectionStackParamList} from '../navigation/types'
import {Product} from '../types/productTypes'
import testProducts from '../assets/testProducts.json'

type Props = NativeStackScreenProps<CollectionStackParamList, 'ProductList'>

const ProductListScreen: React.FC<Props> = ({navigation}) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(testProducts as Product[])
  }, [])

  const renderItem = ({item}: {item: Product}) => {
    // Grab the first image (if any)
    const imageUrl = item.images[0]?.url ?? ''
    // Find the first available variant to display a price
    const firstAvailableVariant = item.variants.find(v => v.availableForSale)
    const displayPrice = firstAvailableVariant
      ? parseFloat(firstAvailableVariant.price.amount).toFixed(2)
      : 'N/A'

    return (
      <TouchableOpacity
        style={styles.productContainer}
        onPress={() =>
          navigation.navigate('ProductDetails', {productId: item.id})
        }>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.image} />
        ) : null}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${displayPrice}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/reactiv.png')} style={styles.logo} />
      <Text style={styles.storeText}>Store</Text>
      <View style={styles.dividerLine} />
      <FlatList
        data={products}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListItem}
      />
    </View>
  )
}

export default ProductListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  logo: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
  },
  storeText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: 12,
    lineHeight: 30,
    zIndex: 1,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    borderRadius: 5,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
  price: {
    marginTop: 5,
    fontWeight: '600',
  },
  flatListItem: {
    paddingHorizontal: 10,
  },
  dividerLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 12,
    marginTop: 12,
  },
})
