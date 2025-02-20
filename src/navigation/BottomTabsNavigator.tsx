import React from 'react'
import {Text} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {BottomTabParamList} from './types'
import CollectionStack from './AppNavigator'
import {useCart} from '../context/CartContext'
import CartScreen from '../screens/CartScreen'

const Tab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabsNavigator = () => {
  const {state} = useCart()
  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="CollectionStack"
        component={CollectionStack}
        options={{
          title: 'All Products',
          headerShown: false,
          tabBarIcon: () => <Text>🛍️</Text>,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: cartCount || undefined,
          tabBarIcon: () => <Text>🛒</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabsNavigator
