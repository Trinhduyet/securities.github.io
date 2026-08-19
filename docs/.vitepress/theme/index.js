import DefaultTheme from 'vitepress/theme'
import './style.css'

// Keep the theme intentionally minimal. Navigation already uses explicit
// static .html targets, so VitePress can own routing without custom redirects.
// This avoids client-side route interception from turning valid Pages URLs
// into unexpected locations under the project base path.
export default {
  extends: DefaultTheme
}
