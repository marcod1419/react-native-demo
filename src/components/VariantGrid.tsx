import React, {useState} from 'react'
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {Product, Variant} from '../types/productTypes'

interface Props {
  product: Product
  selectedVariant: Variant | null
  onSelectVariant: (v: Variant) => void
}

const VariantGrid: React.FC<Props> = ({
  product,
  selectedVariant,
  onSelectVariant,
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleSelectVariant = (v: Variant) => {
    if (!v.availableForSale) {
      return
    }
    onSelectVariant(v)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.expandButton}>
          {expanded ? 'Hide Variants' : 'Show Variants'} {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.variantContainer}>
          {product.variants.map(v => {
            const isSelected = selectedVariant?.id === v.id
            return (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.variantItem,
                  isSelected && styles.selectedVariant,
                  !v.availableForSale && styles.unavailableVariant,
                ]}
                onPress={() => handleSelectVariant(v)}
                disabled={!v.availableForSale}>
                <Image
                  source={{uri: v.image?.url}}
                  style={styles.productImage}
                />
                <Text>
                  {v.title} - ${parseFloat(v.price.amount).toFixed(2)}
                  {!v.availableForSale ? ' (Sold Out)' : ''}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}

export default VariantGrid

const styles = StyleSheet.create({
  container: {
    marginBottom: 64,
  },
  expandButton: {
    color: '#000',
    marginBottom: 8,
    fontSize: 22,
    width: '100%',
    height: 50,
    lineHeight: 48,
    backgroundColor: '#0cec93',
    textAlign: 'center',
  },
  variantContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantItem: {
    width: '50%',
    padding: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedVariant: {
    backgroundColor: '#0cec93',
  },
  unavailableVariant: {
    opacity: 0.5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
})
