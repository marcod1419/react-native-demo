import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import BottomTabsNavigator from './navigation/BottomTabsNavigator.tsx'
import {RootNavigatorParamList} from './navigation/types.ts'
import {CartProvider} from './context/CartContext.tsx'

const RootStack = createNativeStackNavigator<RootNavigatorParamList>()

const App: React.FC = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          <RootStack.Screen name="BottomTabs" component={BottomTabsNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </CartProvider>
  )
}

export default App
