# Ghost Link: The "Saviour of SEO" Agent

## 1. The Core Mission
Create a zero-friction, autonomous SEO agent for Shopify that identifies 404 errors (Ghost Links) and repairs them using 301 redirects via the Shopify Admin API.

---

## 2. Technical Philosophy

- **Framework:** React Router v7 (Official Shopify Template)  
- **Architecture:** Native-First  
  - Redirects are pushed to Shopify instead of being hosted externally  
  - Keeps merchant sites fast and optimized  
- **Data Flow:**  
  App Embed (Scout) → App Proxy (Log) → Database (Store) → Admin API (Repair)  
- **Vibe:** Minimalist, fast, and “set-it-and-forget-it”

---

## 3. The Implementation Roadmap

### Phase 1: The "Scout" (Theme App Extension)
- Create an **App Embed Block**
- **Logic:**
  - Detect if the current page template is a 404  
  - Capture the current URL and referrer  
- **Optimization:**
  - Use `navigator.sendBeacon` or a non-blocking fetch  
  - Ensure zero impact on site speed  

---

### Phase 2: The "Receptionist" (App Proxy)
- Build a **Resource Route** in React Router v7  
  - Endpoint: `/apps/ghost-link/log-404`  
- **Logic:**
  - Authenticate request using Shopify Proxy headers  
- **Database:**
  - Use Prisma (Postgres)  
  - Perform an **upsert** to:
    - Track unique broken URLs  
    - Increment a **Hit Count**  

---

### Phase 3: The "Brain" (Dashboard & Logic)
- **Homepage Status Panel:**
  - Display whether the **App Embed Block is enabled or not**
  - Show clear status:
    - ✅ Enabled  
    - ❌ Not Enabled  
  - Provide a **"Enable App Embed" button**
    - Deep links directly to Shopify theme editor  
    - Allows merchants to quickly toggle the embed on/off  

- **The Table:**
  - Display all 404s sorted by **highest hits (impact)**  
  
- **The Action:**
  - “One-Click Fix” button  
  - Sends POST request to Shopify Admin API Redirect resource  

---

### Phase 4: The "Guardian" (Auto-Pilot)
- **Settings:**
  - Toggle options:
    - Auto-Redirect to Homepage  
    - Auto-Redirect to Similar  
- **Workflow:**
  - When enabled:
    - Automatically create a permanent **301 redirect** immediately after a 404 is logged  

---

## 4. Why This Approach Wins

- **SEO Performance:**
  - 301 redirects handled directly by Shopify servers  
  - Preserves link equity (“link juice”)  

- **Merchant Trust:**
  - Dashboard shows number of recovered visitors (“lost customers saved”)  

- **Low Overhead:**
  - Once fixed, the Scout stops reporting that URL  

---

## 5. Definition of Done

- [ ] App Embed successfully detects a 404  
- [ ] Homepage shows App Embed status + deep link to enable it  
- [ ] Broken link appears in the React Router v7 dashboard  
- [ ] Clicking “Fix” creates a native 301 redirect in Shopify Admin  
- [ ] Fixed link no longer returns a 404  

---

## 6. Important Things to Follow

- Always read Shopify documentation (use Shopify MCP access)  
- Always refer to official docs for all related packages:
  - React Router  
  - Prisma  
  - Any other libraries used  
- Always write **modular, clean, and scalable code**  
- These rules apply to:
  - Planning  
  - Writing code  
  - Debugging / fixing issues  
- These are **non-negotiable first steps** before doing anything  