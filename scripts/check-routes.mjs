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

  // Remove deployed project base if it appears in authored links.
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
  if (ext) return [] // asset/file link; route checker focuses on pages

  return [`${clean}.md`, path.join(clean, 'index.md')]
}

function extractLinks(text, includeConfigLinks = false) {
  const links = new Set()

  // Markdown links (ignore images).
  for (const match of text.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    links.add(match[1])
  }

  // Raw HTML anchors used heavily by VitePress course cards.
  for (const match of text.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    links.add(match[1])
  }

  if (includeConfigLinks) {
    for (const match of text.matchAll(/\blink\s*:\s*["']([^"']+)["']/g)) {
      links.add(match[1])
    }
  }

  return [...links]
}

const errors = []
const warnings = []

if (!(await exists(distDir))) {
  errors.push(`Build output not found: ${posix(path.relative(root, distDir))}. Run npm run build first.`)
} else {
  const markdownFiles = await walk(docsDir, (file) => file.endsWith('.md'))

  // 1) Every authored Markdown page must produce an HTML file.
  for (const source of markdownFiles) {
    const html = sourceToHtml(source)
    if (!(await exists(path.join(distDir, html)))) {
      errors.push(`Missing build output: ${html} <- ${posix(path.relative(root, source))}`)
    }
  }

  // 2) Validate authored internal links against source AND generated output.
  const filesToScan = [...markdownFiles, configFile]
  let checkedLinks = 0

  for (const file of filesToScan) {
    const text = await readFile(file, 'utf8')
    const links = extractLinks(text, file === configFile)

    for (const link of links) {
      const candidates = sourceCandidates(link, file)
      if (!candidates.length) continue
      checkedLinks++

      let resolved = null
      for (const candidate of candidates) {
        if (await exists(candidate)) {
          resolved = candidate
          break
        }
      }

      if (!resolved) {
        errors.push(
          `Broken internal link: ${link} in ${posix(path.relative(root, file))} -> expected ${candidates
            .map((c) => posix(path.relative(root, c)))
            .join(' OR ')}`
        )
        continue
      }

      const html = sourceToHtml(resolved)
      if (!(await exists(path.join(distDir, html)))) {
        errors.push(
          `Link target was not built: ${link} in ${posix(path.relative(root, file))} -> ${html}`
        )
      }
    }
  }

  // 3) Critical navigation targets: these are the routes users hit first.
  const criticalHtml = [
    'index.html',
    'lectures/index.html',
    'domains/index.html',
    'case-studies/index.html',
    'case-studies/visual-gallery.html',
    'case-studies/broker-domain-matrix.html',
    'case-studies/screenshots/index.html',
    'engineering/index.html',
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

  console.log(`Route audit: ${markdownFiles.length} Markdown pages; ${checkedLinks} internal page links checked.`)
}

for (const warning of warnings) console.warn(`WARN: ${warning}`)

if (errors.length) {
  console.error(`\nRoute audit FAILED with ${errors.length} problem(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Route audit PASSED: all page sources, internal page links and critical build outputs are present.')
