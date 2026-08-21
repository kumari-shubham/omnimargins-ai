# OmniMetrics AI — Autonomous Multimodal Data Science & Strategy Studio
*Built for the Google for Startups AI Hackathon • Powered by Google Gemini 2.5*

---

## 📌 Executive Summary

**OmniMetrics AI** is an autonomous, agentic Data Science and Strategic Decision Studio engineered specifically for startup founders, venture investors, and enterprise executives. It transforms raw multimodal business metrics (CSVs, JSON, financial spreadsheets, voice briefings, customer cohort logs) into verified statistical models, live interactive BI dashboards, predictive forecasts, and board-ready strategy memos in seconds.

---

## 🎯 Architectural Justification & Technical Deep Dive

### 1. 🛡️ Accuracy & Anti-Hallucination Architecture

#### The Problem with Pure LLM Data Analysis
Standard Large Language Models (LLMs) operate as next-token predictors. When tasked with direct numerical calculations (e.g., calculating standard deviations, Pearson correlation coefficients, regression slopes, or compounding ARR), LLMs are prone to **mathematical hallucination, precision drift, and arithmetic approximation errors**. In institutional finance and venture analytics, even a 2% arithmetic drift in churn or CAC payback leads to flawed strategic decisions.

#### Our Deterministic Sandbox Solution (`src/lib/statsEngine.ts`)
OmniMetrics AI enforces a strict **separation of concerns between statistical computation and cognitive contextualization**:

```
[ Raw Tabular Data (CSV / JSON) ]
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│  Deterministic TypeScript Mathematical Sandbox Engine     │
│  - Pearson Correlation Matrix: r = Σ(dx·dy) / √(Σdx²·Σdy²)│
│  - Anomaly Isolation: Z-Score = (x - μ) / σ (>2.0σ, >3.0σ)│
│  - Autoregressive 12-Month Forecasting + 95% CI Bands    │
│  - Non-parametric Percentiles (P25, P50, P75, IQR)        │
│  - Compound ARR & Valuation Growth Simulation Models     │
└──────────────────────────────────────────────────────────┘
                 │
                 ▼ (Grounded Statistical Facts & Matrices)
┌──────────────────────────────────────────────────────────┐
│  Google Gemini 2.5 Multi-Agent Deliberation Layer        │
│  🔬 Dr. Aris Thorne (Statistical Quant Analysis)          │
│  🚀 Elena Rostova   (Unit Economics & Growth Strategy)    │
│  🛡️ Marcus Vance    (Downside Containment & Risk Audit)   │
└──────────────────────────────────────────────────────────┘
                 │
                 ▼
[ Live Interactive BI Dashboard + Board Strategy Memo ]
```

#### Analytical Rigor & Guarantees:
1. **Zero Math Hallucinations**: Every metric card, chart data point, correlation value ($r$), percentile, and forecast bound rendered in the UI is computed deterministically in the mathematical sandbox before reaching the AI agents.
2. **Grounded Context Injection**: When the multi-agent deliberation panel (Dr. Aris Thorne, Elena Rostova, Marcus Vance) runs, Gemini is provided with computed statistical primitives (e.g., exact $\mu$, $\sigma$, $r$, $z$-scores, and anomaly counts), allowing the LLM to focus purely on high-level strategic reasoning, pattern synthesis, and risk assessment rather than arithmetic estimation.
3. **Reproducibility & Verification**: Every outlier and correlation is mathematically auditable down to the row and entity level.

---

### 2. ⚡ Scalability & Hybrid Execution Architecture

#### The Challenge of Big Data vs. Real-Time UX
Startup data ingestion requires handling two distinct operational profiles:
- **Instant Client-Side Exploration**: Founders dropping sensitive pitch-deck CSVs who expect zero latency and zero data leakage.
- **Enterprise High-Volume Pipelines**: Ingesting hundreds of thousands of transactions, multi-channel ad logs, and complex multi-agent batch analyses.

#### Our Hybrid Processing Pipeline
OmniMetrics AI uses a **two-tier scalable execution architecture**:

```
                              ┌────────────────────────────────────────┐
                              │           Data Ingestion Hub           │
                              └──────────────────┬─────────────────────┘
                                                 │
                     ┌───────────────────────────┴───────────────────────────┐
                     ▼                                                       ▼
      [ Tier 1: Client-Side Engine ]                          [ Tier 2: Server-Side Pipeline ]
      - Browser PapaParse Stream Engine                       - Next.js Edge / API Route (`/api/analyze`)
      - In-Memory Web Worker Processing                       - High-Throughput Batch Processing
      - Zero Server Latency (<15ms)                           - Gemini 2.5 Flash / Pro Server SDK
      - 100% Local Privacy & Air-Gapped                       - Asynchronous Multi-Agent Deliberation
```

#### Scalability Pillars:
1. **Client-Side Stream Parsing (`PapaParse`)**:
   - Parses multi-megabyte CSV and tabular files directly in the browser.
   - Automatically infers column schemas (numeric, categorical, temporal, boolean) without requiring server upload trips.
   - Enables instant, air-gapped offline analysis where confidential financial data never leaves the user's device unless explicitly requested.
2. **Server-Side Scalability (`/api/analyze`)**:
   - Next.js App Router API route powered by the Google GenAI SDK (`@google/genai`).
   - Supports parallel multi-agent reasoning, streaming structured JSON responses, and batch processing for enterprise datasets.
3. **Dual-Mode Graceful Fallback**:
   - The entire application operates flawlessly offline or with limited connectivity using the built-in deterministic agent reasoning engine, while seamlessly upgrading to live Gemini 2.5 Flash inference whenever an API key is connected.

---

## 🌟 Core Features

| Feature | Description | Google AI / Tech Advantage |
| :--- | :--- | :--- |
| **Multi-Agent Strategy Board** | 3 specialized AI personas (🔬 Quant, 🚀 Growth, 🛡️ Risk) analyze data in parallel. | Gemini 2.5 structured agent deliberation + Web Audio voice briefing synthesis. |
| **Predictive 12M Forecast** | 12-month autoregressive projection with 95% Confidence Interval band. | Deterministic linear regression with standard error variance calculation. |
| **Cohort Retention Heatmap** | 12-month decay matrix tracking user retention and cohort revenue decay. | Dynamic heat-scaled color intensity mapping across signup vintages. |
| **Pearson Correlation & Scatter** | Dynamic correlation heatmap ($r$) with 2D interactive scatter plot. | Real-time multi-dimensional dependency discovery. |
| **Statistical Anomaly Watch** | Automated isolation of entities deviating $>2.0\sigma$ or $>3.0\sigma$ from the mean. | Z-Score & IQR outlier algorithms to prevent revenue leakage and fraud. |
| **What-If Scenario Simulator** | Live reactive sliders (Pricing, Churn, CAC, Expansion) recalculating 12M ARR. | Real-time compounding simulation with runway extension & valuation multiples. |
| **Voice & NLP Query Console** | Ask complex data questions via speech or natural language. | Web Speech API + Gemini intent extraction with instant chart rendering. |
| **Pitch Deck & Memo Exporter** | Full-screen 5-slide pitch mode and institutional printable strategy memo. | 1-click Markdown copy and PDF print formatting for investor meetings. |

---

## 🚀 Quick Start & Local Installation

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd omnimargins-ai

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 📁 Pre-Packaged Startup Datasets

1. **NexusFlow AI (B2B SaaS)**: 180 enterprise/mid-market customer accounts with MRR, ARR, CAC, NPS, Churn Risk Score, and Cohort vintages.
2. **AuraWear Studio (DTC Brand)**: 150 multi-channel marketing campaigns across Meta Ads, Google Search, TikTok, and Email with ROAS, AOV, and Repeat Rates.
3. **ApexCapital (FinTech Lending)**: 160 loan underwriting records with Credit Scores, DTI, Default Probabilities, and Fraud Scores.
4. **Custom File Ingestion**: Full drag-and-drop support for any standard `.csv` file with automatic column inference and instant statistical modeling.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Webpack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom dark glassmorphism theme
- **Visualizations**: Recharts
- **Data Ingestion**: PapaParse
- **AI / LLM SDK**: Google GenAI SDK (`@google/genai` — Gemini 2.5 Flash)
- **Audio / Voice**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **UI FX**: Lucide React, Canvas-Confetti, Tailwind Merge

---

## 🏆 Google for Startups AI Hackathon Pitch Summary

> *"OmniMetrics AI bridges the gap between pure data science and executive decision-making. By combining deterministic mathematical rigor with Google Gemini's cognitive multi-agent reasoning, we deliver non-hallucinatory, institutional-grade strategic intelligence that empowers founders to optimize unit economics, extend cash runway, and pitch with undeniable data."*
