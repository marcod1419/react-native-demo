import {NavigatorScreenParams} from '@react-navigation/native'

export type BottomTabParamList = {
  CollectionStack: undefined
  CartTab: undefined
}

export type CollectionStackParamList = {
  ProductList: undefined
  ProductDetails: {productId: string}
}

export type RootNavigatorParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>
}
