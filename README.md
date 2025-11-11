# Go-To-Market AI Agent

A production-ready Next.js agentic workspace that generates narrative, activation, enablement, and growth plans to take an AI product to market.

## Features

- **Interactive GTM Brief** – capture product context, ICP, budget posture, and motion in an opinionated form.
- **Instant Strategy Output** – deterministic agent builds positioning hooks, launch narrative, battle cards, and primary channels.
- **Activation Timeline** – phase-gated launch roadmap with tactics, dependencies, and enablement kit recommendations.
- **Growth Loops & Metrics** – compounding loop ideas and KPI guardrails aligned to your chosen commercial motion.
- **API-First Architecture** – `/api/agent` route composes the full strategy from reusable strategy libraries.

## Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router
- TypeScript + Tailwind CSS for styling
- Headless UI transitions, Heroicons, and Framer Motion-ready architecture

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and provide product details to generate a tailored go-to-market plan.

## Scripts

- `npm run dev` – start the development server
- `npm run lint` – lint with ESLint and Next.js rules
- `npm run build` – create an optimized production build
- `npm start` – run the production server locally

## Deployment

The project is optimized for Vercel. After building locally, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-836be928
```

## Project Structure

```
app/
  page.tsx          # Hero + client agent workspace
  api/agent/route.ts# Strategy generation API
components/         # Planner UI components
lib/agent.ts        # Agent logic and reusable playbooks
```

## License

MIT
