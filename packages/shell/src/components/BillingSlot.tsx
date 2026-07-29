import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Slot for embedding a Vue 3 sub-application (Type C) inside the React Shell.
 *
 * The Vue app's bootstrap is loaded from MF, then mounted into a DOM
 * container. When the route leaves the Vue subtree, the app is unmounted.
 */
export default function BillingSlot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (!containerRef.current) return

    let mounted = true
    let unmountFn: (() => Promise<void>) | null = null

    const loadAndMount = async () => {
      const { mount, unmount } = await import('billing/bootstrap')
      if (!mounted) return
      await unmount()
      await mount({
        container: containerRef.current!,
        basename: '/billing',
      })
      unmountFn = unmount
    }

    loadAndMount()

    return () => {
      mounted = false
      if (!location.pathname.startsWith('/billing')) return
      unmountFn?.()
    }
  }, [location.pathname])

  return <div ref={containerRef} style={{ padding: 24 }} />
}
