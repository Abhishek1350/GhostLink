# 👻 GhostLink

[![GitLab](https://img.shields.io/badge/GitLab-Project-orange.svg)](https://gitlab.com/abhishek1350/ghostlink)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://gitlab.com/abhishek1350/ghostlink/-/blob/main/LICENSE)
[![Stack: React Router v7](https://img.shields.io/badge/Stack-React_Router_v7-blue.svg)](https://reactrouter.com)

**GhostLink** is a high-performance 404 monitoring and redirection app for Shopify. It helps merchants capture lost sales by identifying broken links in real-time and automating the redirection process.

---

## ✨ Features

- **📡 Automatic 404 Logging**: Real-time tracking of every 404 hit on your storefront.
- **⚡ Ultra-Low Latency**: Uses Vercel's `waitUntil` and background jobs to ensure zero impact on storefront speed.
- **🛡️ Smart Deduplication**: Redis-powered throttling (2s for logs, 1m for fixes) to protect your database and Shopify API quota from bot storms.
- **✈️ Auto-Pilot Mode**: Automatically redirect new 404s to a safe page (home, collections, etc.) of your choice.
- **🔧 One-Click Fixes**: Create standard Shopify URL redirects directly from the dashboard.
- **🎨 Zero Theme Edits**: Powered by a tiny Shopify Theme App Extension. No Liquid code to paste.

---

## 🛠️ Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (formerly Remix)
- **UI Components**: [Shopify Polaris](https://polaris.shopify.com/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Caching/Queue**: [Upstash Redis](https://upstash.com/)
- **Hosting**: [Vercel](https://vercel.com/) (optimized for Serverless Functions)
- **Deployment**: Shopify CLI 3.x

---

## 🏗️ Architecture

GhostLink is designed for extreme scale on serverless infrastructure:

1.  **Storefront Scout**: A lightweight theme app extension sends 404 events to the app proxy.
2.  **App Proxy**: Authenticates the request and schedules background work using Vercel's `waitUntil`.
3.  **Redis Shield**: Before any I/O, Redis checks for duplicates.
    -   **Logs**: Throttled to 1 hit per 2 seconds per URL to prevent DB connection exhaustion.
    -   **Fixes**: Throttled to 1 fix per 1 minute per URL to stay within Shopify Admin API limits.
4.  **Background Jobs**: Heavy operations (DB writes, Shopify API calls) run asynchronously *after* the storefront receives a response.

---

## 🚀 Getting Started

### Prerequisites

- [Shopify Partner Account](https://partners.shopify.com/)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Upstash Redis](https://upstash.com/) (REST URL & Token)
- PostgreSQL Database

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://gitlab.com/abhishek1350/ghostlink
    cd ghostlink
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root:
    ```env
    SHOPIFY_API_KEY=your_api_key
    SHOPIFY_API_SECRET=your_api_secret
    SHOPIFY_APP_URL=https://your-app-url.vercel.app
    DB_URL=your_postgres_url
    DB_DIRECT_URL=your_postgres_direct_url
    UPSTASH_REDIS_REST_URL=your_upstash_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_token
    ```

4.  **Prisma Setup**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

## 📦 Deployment

### Deploying to Vercel

GhostLink is optimized for Vercel. Ensure you add all `.env` variables to your Vercel project settings.

1.  **Build the app**:
    ```bash
    npm run build
    ```
2.  **Deploy**:
    ```bash
    shopify app deploy
    ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Merge Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
