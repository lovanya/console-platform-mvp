// Dev mode entry — used by vite build to populate dist/
// In production, billing is loaded via MF, not via this entry
import { mount, unmount } from './bootstrap'

mount({ container: 'root' }).catch((err) => {
  // biome-ignore lint/suspicious/noConsole: dev entry, errors expected here
  console.error('[billing dev]', err)
})

if (import.meta.hot) {
  import.meta.hot.dispose(() => unmount())
}
