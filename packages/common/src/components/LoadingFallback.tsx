interface LoadingFallbackProps {
  message?: string
}

export default function LoadingFallback({ message = '加载中...' }: LoadingFallbackProps) {
  return (
    <div
      style={{
        padding: 24,
        color: '#999',
        fontSize: 14,
      }}
    >
      {message}
    </div>
  )
}
