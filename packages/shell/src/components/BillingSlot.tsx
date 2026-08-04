import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Slot for embedding a Vue 3 sub-application (Type C) inside the React Shell.
 *
 * Mounting strategy:
 * - Mount the Vue app ONCE when first entering /billing subtree
 * - Keep it mounted across internal navigation (e.g., /billing/overview
 *   -> /billing/orders) so that Vue's <KeepAlive> cache survives
 * - Unmount only when leaving /billing subtree entirely
 *
 * This is critical for Vue's keep-alive to work: if we re-mounted the
 * app on every route change, the keep-alive cache would be destroyed.
 */
export default function BillingSlot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<unknown>(null)
  const location = useLocation()
  const isInBilling = location.pathname.startsWith('/billing')

  useEffect(() => {
    // Leaving the /billing subtree: unmount the Vue app
    if (!isInBilling) {
      if (appRef.current) {
        import('billing/bootstrap').then(({ unmount }) => {
          unmount()
        })
        appRef.current = null
      }
      return
    }

    // Already mounted: do nothing. Vue Router inside handles navigation.
    if (appRef.current) return

    // First mount
    if (!containerRef.current) return
    const mounted = true
    ;(async () => {
      const { mount } = await import('billing/bootstrap')
      if (!mounted) return
      await mount({
        container: containerRef.current!,
        basename: '/billing',
      })
      appRef.current = true // sentinel — real app ref is in mount's return
    })()
  }, [isInBilling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      import('billing/bootstrap').then(({ unmount }) => {
        unmount()
      })
    }
  }, [])

  return <div ref={containerRef} style={{ padding: 24 }} />
}
