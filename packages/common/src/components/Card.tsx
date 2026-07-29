import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  title?: ReactNode
  extra?: ReactNode
  children: ReactNode
  bodyStyle?: CSSProperties
}

const cardStyle: CSSProperties = {
  padding: 24,
  border: '1px solid #f0f0f0',
  borderRadius: 8,
  background: '#fafafa',
}

const titleBarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
}

export default function Card({ title, extra, children, bodyStyle }: CardProps) {
  return (
    <div style={{ ...cardStyle, ...bodyStyle }}>
      {(title || extra) && (
        <div style={titleBarStyle}>
          {title && <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
