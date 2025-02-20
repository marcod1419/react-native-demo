export interface Product {
  id: string
  title: string
  description: string
  availableForSale: boolean
  productType: string
  images: Array<{
    id: string
    url: string
  }>
  variants: Variant[]
}

export interface Variant {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string // e.g. "28.52"
    currencyCode: string // e.g. "CAD"
  }
  compareAtPrice?: {
    amount: string
    currencyCode: string
  } | null
  image?: {
    id: string
    url: string
  }
}
