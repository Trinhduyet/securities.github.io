# System Map — Công ty chứng khoán nhìn từ Backend

Sơ đồ này là mental map để định vị 8 domain trong một platform tổng thể.

```mermaid
flowchart TB
    INV[Investor Web / Mobile] --> API[API Gateway / BFF]
    API --> IAM[Customer / IAM / Account]

    API --> EQ[1. Securities Core]
    API --> DER[2. Derivatives Core]
    API --> BOND[3. Bond Core]
    API --> FUND[4. Fund Core]

    MD[Market Data Feed] --> RT[5. Realtime Analytics]
    RT --> INV
    RT --> CO[6. Conditional Orders]
    CO --> EQ

    EQ --> EXGW[Exchange Gateway / Adapter]
    EXGW --> KRX[KRX / Market Infrastructure]
    KRX --> EXGW

    EQ --> PT[Post Trade]
    PT --> VSDC[VSDC / Clearing / Depository]
    PT --> BANK[Settlement Bank]

    IAM --> WF[8. Enterprise Workflow]
    PT --> WF

    EQ --> EVT[Business Events]
    DER --> EVT
    BOND --> EVT
    FUND --> EVT
    EVT --> REWARD[7. Rewards]

    EQ --> LEDGER[Cash / Securities Ledger]
    DER --> LEDGER
    BOND --> LEDGER
    FUND --> LEDGER

    PT --> RECON[Reconciliation]
    EXGW --> RECON
    LEDGER --> RECON
```

## Luồng kiến thức

```text
Economics
  ↓ explains incentives / price / macro drivers
Finance
  ↓ explains time value / risk / valuation
Securities
  ↓ defines instruments / orders / positions
Market Microstructure
  ↓ explains book / matching / liquidity
Market Infrastructure
  ↓ KRX / FIX / VSDC / settlement
Core Domains
  ↓ implement product lifecycles
Reliability
  ↓ protects business invariants
Reconciliation
  ↓ proves internal state agrees with external reality
```

## Source-of-truth thinking

Không có một source of truth duy nhất cho toàn platform.

Ví dụ:

```text
Customer profile        → customer/IAM core
Internal order intent   → OMS
Venue-assigned status   → venue message/reconciliation evidence
Internal cash ledger    → ledger core
Depository holdings     → depository/custodian evidence
Settlement result       → post-trade/VSDC/bank evidence
Market price            → approved market data source
```

Kiến trúc tốt document authority cho từng fact thay vì gọi chung một database là “source of truth”.