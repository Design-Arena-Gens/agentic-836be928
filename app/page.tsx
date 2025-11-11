import { PlannerClient } from '@/components/PlannerClient';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-16">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-200">
              <RocketLaunchIcon className="h-4 w-4" />
              Go-To-Market AI Agent
            </span>
            <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl md:text-5xl">
              Orchestrate an end-to-end launch system without hiring a GTM task force.
            </h1>
            <p className="text-lg text-slate-300">
              Feed the agent with your product context and instantly receive narrative, activation, enablement, and growth loop plans tailored to your motion and budget.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-500/20 bg-primary-500/10 p-6 text-sm text-primary-100">
            <p className="font-semibold uppercase tracking-wide text-xs text-primary-200">Agent coverage</p>
            <ul className="mt-3 space-y-2 text-primary-100">
              <li>• Narrative + positioning snapshot</li>
              <li>• Battle cards & enablement hits</li>
              <li>• Phase-gated activation roadmap</li>
              <li>• Compounding growth loops</li>
              <li>• KPI guardrails & revenue model</li>
            </ul>
          </div>
        </div>
      </div>
      <PlannerClient />
    </main>
  );
}
