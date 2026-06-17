interface PriceBadgeProps {
  originalPrice: number
  discountPrice?: number
  unit: string
}

export default function PriceBadge({ originalPrice, discountPrice, unit }: PriceBadgeProps) {
  const hasDiscount = discountPrice !== undefined && discountPrice < originalPrice

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
      {hasDiscount ? (
        <>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f5222d' }}>
            ¥{discountPrice}
          </span>
          <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
            ¥{originalPrice}
          </span>
        </>
      ) : (
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          ¥{originalPrice}
        </span>
      )}
      <span style={{ fontSize: 12, color: '#666' }}>/{unit}</span>
    </span>
  )
}
