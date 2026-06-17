export interface Product {
  id: string
  name: string
  icon?: string
}

export interface AuthState {
  user: string | null
  token: string | null
  permissions: string[]
}

export interface Region {
  id: string
  name: string
}

type EventPayloads = {
  'region:change': { region: string }
  'resource:created': { product: string; id: string; name: string }
  'resource:deleted': { product: string; id: string }
  'auth:login': { user: string; token: string }
  'auth:logout': {}
}

type EventName = keyof EventPayloads
type EventHandler<P> = (payload: P) => void

export class EventBus {
  private listeners = new Map<string, Set<Function>>()

  on<N extends EventName>(event: N, handler: EventHandler<EventPayloads[N]>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)
    return () => this.off(event, handler)
  }

  off<N extends EventName>(event: N, handler: EventHandler<EventPayloads[N]>) {
    this.listeners.get(event)?.delete(handler)
  }

  emit<N extends EventName>(event: N, payload: EventPayloads[N]) {
    this.listeners.get(event)?.forEach(handler => handler(payload))
  }
}

export const eventBus = new EventBus()
