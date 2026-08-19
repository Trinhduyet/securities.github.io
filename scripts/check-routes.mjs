import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const distDir = path.join(docsDir, '.vitepress', 'dist')
const configFile = path.join(docsDir, '.vitepress', 'config.mts')

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function walk(dir, predicate = () => true) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full === path.join(docsDir, '.vitepress')) continue
      result.push(...(await walk(full, predicate)))
    } else if (predicate(full)) {
      result.push(full)
    }
  }
  return result
}

function posix(value) {
  return value.split(path.sep).join('/')
}

function sourceToHtml(sourceFile) {
  const relative = posix(path.relative(docsDir, sourceFile))
  return relative.replace(/\.md$/i, '.html')
}

function stripUrl(url) {
  return url.trim().replace(/^<|>$/g, '').split('#')[0].split('?')[0]
}

function isExternalOrSpecial(url) {
  return (
    !url ||
    url.startsWith('#') ||
    /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(url)
  )
}

function sourceCandidates(rawUrl, fromFile) {
  let url = stripUrl(rawUrl)
  if (isExternalOrSpecial(url)) return []

  if (url.startsWith('/securities.github.io/')) {
    url = `/${url.slice('/securities.github.io/'.length)}`
  }

  const fromDir = fromFile === configFile ? docsDir : path.dirname(fromFile)
  const absolute = url.startsWith('/')
    ? path.join(docsDir, url.slice(1))
    : path.resolve(fromDir, url)

  const clean = path.normalize(absolute)
  if (!clean.startsWith(path.normalize(docsDir))) return []

  if (url === '/' || url === '') return [path.join(docsDir, 'index.md')]
  if (url.endsWith('/')) return [path.join(clean, 'index.md')]
  if (/\.md$/i.test(clean)) return [clean]
  if (/\.html$/i.test(clean)) return [clean.replace(/\.html$/i, '.md')]

  const ext = path.extname(clean)
  if (ext) return []

  return [`${clean}.md`, path.join(clean, 'index.md')]
}

function extractMarkdownLinks(text) {
  const links = new Set()
  for (const match of text.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    links.add(match[1])
  }
  for (const match of text.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    links.add(match[1])
  }
  return [...links]
}

function extractConfigLinks(text) {
  return [...text.matchAll(/\blink\s*:\s*["']([^"']+)["']/g)].map((match) => match[1])
}

async function resolveSource(link, fromFile) {
  const candidates = sourceCandidates(link, fromFile)
  for (const candidate of candidates) {
    if (await exists(candidate)) return { candidate, candidates }
  }
  return { candidate: null, candidates }
}

const errors = []
const warnings = []

if (!(await exists(distDir))) {
  errors.push(`Build output not found: ${posix(path.relative(root, distDir))}. Run npm run build first.`)
} else {
  const markdownFiles = await walk(docsDir, (file) => file.endsWith('.md'))

  // Non-navigation Markdown pages are useful to audit, but do not block the whole
  // project site. VitePress itself already failed if a source could not be parsed.
  for (const source of markdownFiles) {
    const html = sourceToHtml(source)
    if (!(await exists(path.join(distDir, html)))) {
      warnings.push(`Non-critical source has no matching HTML output: ${html} <- ${posix(path.relative(root, source))}`)
    }
  }

  // Navigation/sidebar links are the contract users click first: these are blocking.
  const configText = await readFile(configFile, 'utf8')
  const configLinks = extractConfigLinks(configText)
  for (const link of configLinks) {
    const { candidate, candidates } = await resolveSource(link, configFile)
    if (!candidates.length) continue
    if (!candidate) {
      errors.push(`Broken navigation link: ${link} -> expected ${candidates.map((c) => posix(path.relative(root, c))).join(' OR ')}`)
      continue
    }
    const html = sourceToHtml(candidate)
    if (!(await exists(path.join(distDir, html)))) {
      errors.push(`Navigation target was not built: ${link} -> ${html}`)
    }
  }

  // In-article links are still reported, but one secondary reference cannot keep
  // the entire GitHub Pages deployment stale.
  let checkedSecondaryLinks = 0
  for (const file of markdownFiles) {
    const text = await readFile(file, 'utf8')
    for (const link of extractMarkdownLinks(text)) {
      const { candidate, candidates } = await resolveSource(link, file)
      if (!candidates.length) continue
      checkedSecondaryLinks++
      if (!candidate) {
        warnings.push(`Broken secondary link: ${link} in ${posix(path.relative(root, file))}`)
        continue
      }
      const html = sourceToHtml(candidate)
      if (!(await exists(path.join(distDir, html)))) {
        warnings.push(`Secondary link target was not built: ${link} in ${posix(path.relative(root, file))} -> ${html}`)
      }
    }
  }

  const criticalHtml = [
    'index.html',
    'lectures/index.html',
    'domains/index.html',
    ...Array.from({ length: 8 }, (_, i) => {
      const names = [
        '01-securities-core',
        '02-derivatives-core',
        '03-bonds-core',
        '04-funds-core',
        '05-realtime-analytics',
        '06-conditional-orders',
        '07-rewards',
        '08-enterprise-workflow'
      ]
      return `domains/${names[i]}.html`
    }),
    'case-studies/index.html',
    'case-studies/visual-gallery.html',
    'case-studies/broker-domain-matrix.html',
    'case-studies/ssi-iboard.html',
    'case-studies/vps-smartone.html',
    'case-studies/tcbs-tcinvest.html',
    'case-studies/screenshots/index.html',
    'engineering/index.html',
    'engineering/core-securities-engineering.html',
    'engineering/reliability-and-ledgers.html',
    'projects/index.html',
    'resources/index.html'
  ]

  for (let i = 1; i <= 24; i++) {
    const prefix = String(i).padStart(2, '0')
    const lectureSource = markdownFiles.find((file) => {
      const rel = posix(path.relative(docsDir, file))
      return rel.startsWith(`lectures/${prefix}-`) && rel.endsWith('/index.md')
    })
    if (!lectureSource) {
      errors.push(`Missing lecture source index for lecture ${prefix}`)
    } else {
      criticalHtml.push(sourceToHtml(lectureSource))
    }
  }

  for (const html of criticalHtml) {
    if (!(await exists(path.join(distDir, html)))) {
      errors.push(`Critical route output missing: ${html}`)
    }
  }

  // A project Pages build with the wrong base can contain every HTML file but still
  // break JS/CSS/nav in the browser. Verify the deployed base is embedded in output.
  const domainIndex = path.join(distDir, 'domains', 'index.html')
  if (await exists(domainIndex)) {
    const html = await readFile(domainIndex, 'utf8')
    if (!html.includes('/securities.github.io/')) {
      errors.push('domains/index.html was built without the /securities.github.io/ project base')
    }
  }

  console.log(
    `Route audit: ${markdownFiles.length} Markdown pages; ${configLinks.length} navigation links; ${checkedSecondaryLinks} secondary links.`
  )
}

for (const warning of warnings) console.warn(`WARN: ${warning}`)

if (errors.length) {
  console.error(`\nRoute audit FAILED with ${errors.length} critical problem(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Route audit PASSED: navigation and critical Pages routes are present. Secondary warnings: ${warnings.length}.`)
