# Abhyaan — Frontend

React frontend for Abhyaan, an AI-native mini CRM for retail and D2C brands.

**Live:** [abhyaan-frontend.vercel.app](https://abhyaan-frontend.vercel.app)

**Backend:** [github.com/baibhavbaidya/Abhyaan-Backend](https://github.com/baibhavbaidya/Abhyaan-Backend)

**Channel Stub:** [github.com/baibhavbaidya/Abhyaan-Channel-Stub](https://github.com/baibhavbaidya/Abhyaan-Channel-Stub)

---

## What is Abhyaan

Abhyaan (Hindi for "campaign") is an AI-native CRM that helps retail brands decide who to talk to, what to say, and reach them through messaging channels. Instead of making marketers manually filter and segment, Abhyaan proactively surfaces campaign opportunities and lets marketers describe intent in plain English.

---

## Architecture

![Abhyaan Architecture](./Abhyaan%20Architecture%20Diagram.jpg)

---

## Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | AI opportunity cards + customer stats |
| Ask Abhyaan | `/chat` | Natural language campaign creation |
| Campaigns | `/campaigns` | All launched campaigns with stats |
| Analytics | `/analytics/:id` | Campaign funnel + AI insight |

---

## Tech Stack

- React 18 + Vite
- React Router DOM
- Axios
- Tailwind CSS
- Deployed on Vercel

---

## Local Setup

```bash
git clone https://github.com/baibhavbaidya/Abhyaan-Frontend
cd Abhyaan-Frontend
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:8000
```

Run:
```bash
npm run dev
```

Make sure the backend is running on port 8000.

---

## Key Features

- **AI Opportunity Discovery** — on dashboard load, AI scans customer data and surfaces top 3-5 campaign opportunities with revenue estimates and reasoning
- **Natural Language Campaigns** — describe a campaign in plain English, AI finds the segment, drafts the message, suggests the channel
- **Edit and Launch** — pre-filled campaign modal with editable name, message and channel before launching
- **Live Analytics** — campaign funnel showing sent, delivered, opened, clicked rates
- **AI Insight** — post-campaign analysis with actionable recommendations
