import DefaultTheme from 'vitepress/theme'
import './style.css'

function staticHtmlTarget(pathname, base) {
  if (!pathname.startsWith(base)) return null

  const relative = pathname.slice(base.length)
  if (!relative || relative === 'index.html') return null

  // Directory-style docs routes are emitted by VitePress as <dir>/index.html.
  if (relative.endsWith('/')) return `${base}${relative}index.html`

  const lastSegment = relative.split('/').pop() || ''

  // Extensionless docs routes are emitted as <route>.html.
  // Leave assets/files such as .png, .svg, .css and existing .html untouched.
  if (!lastSegment.includes('.')) return `${base}${relative}.html`

  return null
}

function normalizeInternalUrl(rawUrl, base) {
  const url = new URL(rawUrl, window.location.href)
  if (url.origin !== window.location.origin) return null

  let pathname = url.pathname

  // VitePress router hooks may expose a site-root route without the configured
  // project base. Convert it back to the deployed GitHub Pages base first.
  if (!pathname.startsWith(base) && base !== '/' && pathname.startsWith('/')) {
    pathname = `${base}${pathname.slice(1)}`
  }

  const targetPath = staticHtmlTarget(pathname, base)
  if (!targetPath || targetPath === url.pathname) return null

  return `${targetPath}${url.search}${url.hash}`
}

export default {
  extends: DefaultTheme,
  enhanceApp({ router, siteData }) {
    if (typeof window === 'undefined') return

    const base = siteData.value.base || '/'

    // Recover direct visits/bookmarks that still use the previous clean URLs.
    const currentTarget = normalizeInternalUrl(window.location.href, base)
    if (currentTarget) {
      window.location.replace(currentTarget)
      return
    }

    // Intercept normal anchor clicks before the VitePress SPA router so old
    // trailing-slash / extensionless links resolve to exact static HTML files.
    document.addEventListener(
      'click',
      (event) => {
        if (event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        const anchor = event.target?.closest?.('a[href]')
        if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

        const target = normalizeInternalUrl(anchor.href, base)
        if (!target) return

        event.preventDefault()
        event.stopImmediatePropagation()
        window.location.assign(target)
      },
      true
    )

    // Also cover programmatic VitePress router navigation (e.g. local search).
    const previousBeforeRouteChange = router.onBeforeRouteChange
    router.onBeforeRouteChange = async (to) => {
      if (previousBeforeRouteChange) {
        const result = await previousBeforeRouteChange(to)
        if (result === false) return false
      }

      const target = normalizeInternalUrl(to, base)
      if (!target) return

      window.location.assign(target)
      return false
    }
  }
}
