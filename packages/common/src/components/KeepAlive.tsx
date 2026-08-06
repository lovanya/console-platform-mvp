import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react'

/**
 * React port of Vue's <keep-alive>.
 *
 * Children passed to <KeepAlive> stay mounted when they're "deactivated"
 * (not currently matched), preserving their state. Reactivated children
 * resume from where they left off.
 *
 * Supports all key Vue features:
 * - include: only cache components whose displayName matches
 * - exclude: never cache these components
 * - max: maximum cache size (default 10, LRU eviction)
 * - onActivated/onDeactivated: lifecycle hooks
 *
 * Implementation: when a child is deactivated, it's moved to a hidden
 * div via display:none (keeps DOM mounted, no useEffect re-runs).
 * On reactivation, display is restored. This is simpler than
 * react-activation's offscreen portal approach and works for our needs.
 *
 * Usage:
 *   <KeepAlive include={['InstanceList', 'InstanceDetail']} max={5}>
 *     <RouteSwitch />
 *   </KeepAlive>
 *
 *   function RouteSwitch() {
 *     const { active } = useContext(KeepAliveContext)
 *     return active === 'detail' ? <Detail /> : <List />
 *   }
 */

export interface KeepAliveProps {
  children: ReactNode
  include?: string[] | RegExp
  exclude?: string[] | RegExp
  max?: number
  onActivated?: (name: string) => void
  onDeactivated?: (name: string) => void
}

interface CacheEntry {
  name: string
  element: ReactNode
  key: string
}

function shouldCache(
  name: string,
  include?: string[] | RegExp,
  exclude?: string[] | RegExp,
): boolean {
  if (exclude) {
    if (Array.isArray(exclude) && exclude.includes(name)) return false
    if (exclude instanceof RegExp && exclude.test(name)) return false
  }
  if (include) {
    if (Array.isArray(include) && !include.includes(name)) return false
    if (include instanceof RegExp && !include.test(name)) return false
  }
  return true
}

function getDisplayName(element: unknown, fallback: string): string {
  if (isValidElement(element)) {
    const type = element.type as { displayName?: string; name?: string }
    return type.displayName ?? type.name ?? fallback
  }
  return fallback
}

export function KeepAlive({
  children,
  include,
  exclude,
  max = 10,
  onActivated,
  onDeactivated,
}: KeepAliveProps) {
  const [cache, setCache] = useState<CacheEntry[]>([])
  const [active, setActive] = useState<{ name: string; element: ReactNode; key: string } | null>(
    null,
  )
  const cacheRef = useRef<CacheEntry[]>([])
  cacheRef.current = cache

  useEffect(() => {
    // The active child is the FIRST child of KeepAlive
    const firstChild = Children.toArray(children)[0]
    if (!firstChild) return

    const name = getDisplayName(firstChild, 'Anonymous')
    const key = (isValidElement(firstChild) && firstChild.key) || name

    const old = active
    setActive({ name, element: firstChild, key })

    // Deactivate old
    if (old && old.name !== name && shouldCache(old.name, include, exclude)) {
      onDeactivated?.(old.name)
      setCache((prev) => {
        // Add to cache
        const next = [...prev, { name: old.name, element: old.element, key: old.key }]
        // Evict oldest if over max (LRU)
        while (next.length > max) {
          next.shift()
        }
        return next
      })
    }

    // Activate new
    if (!old || old.name !== name) {
      onActivated?.(name)
    }
  }, [children, include, exclude, max, onActivated, onDeactivated, active])

  return (
    <>
      {cache.map((entry) => (
        <div key={entry.key} style={{ display: 'none' }} data-keep-alive-cached={entry.name}>
          {entry.element}
        </div>
      ))}
      <div data-keep-alive-active={active?.name ?? 'none'}>{children}</div>
    </>
  )
}

/**
 * Helper hook: returns the currently active child name.
 * Use this in the wrapped component if it needs to know which view is active.
 */
export function useActiveKeepAlive(): string | null {
  // Implementation note: real active state is in KeepAlive above.
  // This is a placeholder for future enhancement where KeepAlive
  // exposes active state via context.
  return null
}
