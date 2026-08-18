import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const base = isGitHubActions ? '/securities.github.io/' : '/'

const foundationLectures = [
  { text: 'Tổng quan 24 bài', link: '/lectures/' },
  { text: '01. Kinh tế học vi mô', link: '/lectures/01-microeconomics/' },
  { text: '02. Kinh tế học vĩ mô', link: '/lectures/02-macroeconomics/' },
  { text: '03. Tài chính nền tảng', link: '/lectures/03-finance-foundations/' },
  { text: '04. Thị trường chứng khoán', link: '/lectures/04-securities-market/' },
  { text: '05. Phân tích đầu tư', link: '/lectures/05-investment-analysis/' }
]

const marketCoreLectures = [
  { text: '06. Order & Matching', link: '/lectures/06-order-matching/' },
  { text: '07. KRX / FIX / VSDC', link: '/lectures/07-clearing-settlement-krx-fix-vsdc/' },
  { text: '08. Account / Cash / Position / Buying Power', link: '/lectures/08-account-cash-position-buying-power/' },
  { text: '09. Security Master & Corporate Actions', link: '/lectures/09-security-master-corporate-actions/' },
  { text: '10. Market Data Engineering', link: '/lectures/10-market-data-engineering/' },
  { text: '11. Risk, Margin & Controls', link: '/lectures/11-risk-margin-controls/' },
  { text: '12. EOD, Reconciliation & Operations', link: '/lectures/12-eod-reconciliation-operations/' }
]

const productionLectures = [
  { text: '13. OMS Internals & State Machine', link: '/lectures/13-oms-internals-state-machine/' },
  { text: '14. FIX 4.4 Session Recovery', link: '/lectures/14-fix44-session-recovery/' },
  { text: '15. Exchange Gateway & KRX Connectivity', link: '/lectures/15-exchange-gateway-krx-connectivity/' },
  { text: '16. Trade Capture & Booking', link: '/lectures/16-trade-capture-booking/' },
  { text: '17. Clearing, Netting & Settlement', link: '/lectures/17-clearing-netting-settlement/' },
  { text: '18. Ledger, Accounting & Projections', link: '/lectures/18-ledger-accounting-projections/' },
  { text: '19. Event Delivery Semantics', link: '/lectures/19-event-driven-delivery-semantics/' },
  { text: '20. HA / DR / BCP / Observability', link: '/lectures/20-ha-dr-bcp-observability/' },
  { text: '21. Security / Compliance / Audit', link: '/lectures/21-security-compliance-audit/' },
  { text: '22. Performance / Capacity / Latency', link: '/lectures/22-performance-capacity-latency/' },
  { text: '23. Production Runbook & Incidents', link: '/lectures/23-production-runbook-incident-operations/' },
  { text: '24. Architecture Boundaries & DDD', link: '/lectures/24-architecture-boundaries-ddd-modular-monolith-microservices/' }
]

const domains = [
  { text: 'Tổng quan 8 domain', link: '/domains/' },
  { text: '01. Securities Core', link: '/domains/01-securities-core' },
  { text: '02. Derivatives Core', link: '/domains/02-derivatives-core' },
  { text: '03. Bonds Core', link: '/domains/03-bonds-core' },
  { text: '04. Funds Core', link: '/domains/04-funds-core' },
  { text: '05. Realtime Analytics', link: '/domains/05-realtime-analytics' },
  { text: '06. Conditional Orders', link: '/domains/06-conditional-orders' },
  { text: '07. Rewards', link: '/domains/07-rewards' },
  { text: '08. Enterprise Workflow', link: '/domains/08-enterprise-workflow' }
]

const engineering = [
  { text: 'Engineering overview', link: '/engineering/' },
  { text: 'Core Securities Engineering', link: '/engineering/core-securities-engineering' },
  { text: 'Reliability & Ledgers', link: '/engineering/reliability-and-ledgers' }
]

const projects = [
  { text: 'Tổng quan', link: '/projects/' },
  { text: '01. Order Lifecycle', link: '/projects/project-01-order-lifecycle' },
  { text: '02. Brokerage Platform', link: '/projects/project-02-brokerage-platform' },
  { text: '03. FIX Gateway Recovery Lab', link: '/projects/project-03-fix-gateway-recovery-lab' },
  { text: '04. Ledger & Reconciliation Lab', link: '/projects/project-04-ledger-reconciliation-lab' },
  { text: '05. Brokerage Production Game Day', link: '/projects/project-05-brokerage-production-game-day' }
]

const resources = [
  { text: 'Tổng quan', link: '/resources/' },
  { text: 'Glossary', link: '/resources/glossary' },
  { text: 'System Map', link: '/resources/system-map' },
  { text: 'Review Checklist', link: '/resources/checklist' },
  { text: 'Competency Matrix', link: '/resources/competency-matrix' },
  { text: '50 Failure Scenarios', link: '/resources/failure-scenarios' },
  { text: 'References', link: '/resources/references' }
]

export default withMermaid(defineConfig({
  title: 'Securities Engineering',
  description: 'Từ kinh tế học, tài chính và chứng khoán đến core securities engineering.',
  lang: 'vi-VN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#b45309' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],
  themeConfig: {
    logo: {
      light: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23b45309"/><path d="M13 43h8V29h-8v14zm15 0h8V19h-8v24zm15 0h8V10h-8v33z" fill="white"/><path d="M11 49h42" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>',
      dark: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%23f59e0b"/><path d="M13 43h8V29h-8v14zm15 0h8V19h-8v24zm15 0h8V10h-8v33z" fill="%23111827"/><path d="M11 49h42" stroke="%23111827" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    nav: [
      { text: 'Bài giảng', link: '/lectures/' },
      { text: '8 Domains', link: '/domains/' },
      { text: 'Engineering', link: '/engineering/' },
      { text: 'Projects', link: '/projects/' },
      { text: 'Resources', link: '/resources/' }
    ],
    sidebar: {
      '/lectures/': [
        { text: 'I. Economics & Finance', items: foundationLectures },
        { text: 'II. Market & Brokerage Core', items: marketCoreLectures },
        { text: 'III. Production Securities Engineering', items: productionLectures }
      ],
      '/domains/': [{ text: '8 Core Domains', items: domains }],
      '/engineering/': [{ text: 'Core Engineering', items: engineering }],
      '/projects/': [{ text: 'Projects', items: projects }],
      '/resources/': [{ text: 'Resources', items: resources }]
    },
    outline: { level: [2, 3], label: 'Trong bài này' },
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Trinhduyet/securities.github.io' }
    ],
    editLink: {
      pattern: 'https://github.com/Trinhduyet/securities.github.io/edit/main/docs/:path',
      text: 'Sửa trang này trên GitHub'
    },
    lastUpdated: { text: 'Cập nhật lần cuối' },
    docFooter: { prev: 'Bài trước', next: 'Bài tiếp theo' },
    footer: {
      message: 'Học nghiệp vụ trước, bảo vệ invariant sau, rồi mới chọn architecture.',
      copyright: 'Securities Engineering'
    }
  }
}))