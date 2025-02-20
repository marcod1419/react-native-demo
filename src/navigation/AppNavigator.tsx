import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {CollectionStackParamList} from './types'
import ProductListScreen from '../screens/ProductListScreen'
import ProductDetailsScreen from '../screens/ProductDetailsScreen'

const Stack = createNativeStackNavigator<CollectionStackParamList>()

const CollectionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{title: 'All Products'}}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{title: 'Details'}}
      />
    </Stack.Navigator>
  )
}

export default CollectionStack
