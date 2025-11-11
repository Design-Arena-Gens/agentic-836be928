'use client';

import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type {
  AgentInput,
  AgentResponse,
  ActivationPhase,
  ChannelPlan,
  GrowthLoop,
  BattleCard,
  MetricRecommendation
} from '@/lib/agent';

type FormState = AgentInput;

const DEFAULT_FORM: FormState = {
  productName: 'LaunchPilot AI',
  productDescription: 'helps GTM teams spin up AI-assisted launch playbooks in days',
  targetAudience: 'B2B SaaS GTM leaders in scale-ups',
  primaryGoal: 'ship a differentiated launch that converts fast',
  differentiators: 'autonomous playbook orchestration and proven narrative templates',
  tone: 'high-energy yet credible',
  budgetLevel: 'standard',
  motion: 'hybrid',
  launchDate: ''
};

const BUDGET_OPTIONS: { label: string; value: AgentInput['budgetLevel']; description: string }[] = [
  { label: 'Lean', value: 'lean', description: 'Scrappy activation with curated high-leverage plays.' },
  { label: 'Standard', value: 'standard', description: 'Balanced investment across motion + enablement.' },
  { label: 'Scale', value: 'scale', description: 'Resource for multi-channel acceleration and pods.' }
];

const MOTION_OPTIONS: { label: string; value: AgentInput['motion']; description: string }[] = [
  {
    label: 'Product-led',
    value: 'product-led',
    description: 'Self-serve first, lean human assist, activation telemetry at core.'
  },
  {
    label: 'Sales-led',
    value: 'sales-led',
    description: 'Strategic accounts, ABM plays, consultative enablement.'
  },
  {
    label: 'Community-led',
    value: 'community-led',
    description: 'Audience building, evangelists, and co-creation loops.'
  },
  {
    label: 'Hybrid',
    value: 'hybrid',
    description: 'Blend of PLG discovery with revenue desk rigor.'
  }
];

export function PlannerClient() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, launchDate: form.launchDate || undefined })
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = (await response.json()) as AgentResponse;
      setStrategy(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong generating the strategy. Please adjust inputs and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card backdrop-blur">
        <h2 className="text-xl font-semibold text-slate-100">Define your launch</h2>
        <p className="mt-2 text-sm text-slate-400">
          Feed the agent with context so it can orchestrate narrative, activation, and growth plays for your product.
        </p>
        <div className="mt-6 space-y-6">
          <Field
            label="Product name"
            value={form.productName}
            placeholder="e.g. OrbitOps AI"
            onChange={(value) => updateField('productName', value)}
          />
          <Field
            label="Product description"
            textarea
            value={form.productDescription}
            placeholder="What transformation do you deliver?"
            onChange={(value) => updateField('productDescription', value)}
          />
          <Field
            label="Target audience"
            value={form.targetAudience}
            placeholder="Who are you winning?"
            onChange={(value) => updateField('targetAudience', value)}
          />
          <Field
            label="Primary go-to-market goal"
            value={form.primaryGoal}
            placeholder="What outcome must this launch deliver?"
            onChange={(value) => updateField('primaryGoal', value)}
          />
          <Field
            label="Differentiators"
            textarea
            value={form.differentiators}
            placeholder="What makes you unfairly strong?"
            onChange={(value) => updateField('differentiators', value)}
          />
          <Field
            label="Preferred tone"
            value={form.tone}
            placeholder="e.g. bold, pragmatic, rebellious"
            onChange={(value) => updateField('tone', value)}
          />
          <Field
            label="Launch date (optional)"
            type="date"
            value={form.launchDate ?? ''}
            onChange={(value) => updateField('launchDate', value)}
          />
          <OptionGroup
            label="Budget posture"
            value={form.budgetLevel}
            options={BUDGET_OPTIONS}
            onChange={(value) => updateField('budgetLevel', value)}
          />
          <OptionGroup
            label="Commercial motion"
            value={form.motion}
            options={MOTION_OPTIONS}
            onChange={(value) => updateField('motion', value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-primary-900/30 transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Running go-to-market agent
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Generate GTM system
            </>
          )}
        </button>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <p className="mt-6 text-xs text-slate-500">
          Output includes positioning snapshot, battle cards, activation timeline, growth loops, and KPI guardrails.
        </p>
      </aside>
      <section className="space-y-8">
        <Transition
          show={!!strategy}
          enter="transition ease-out duration-500"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          {strategy ? (
            <div className="space-y-8">
              <MotionSummary selectedMotion={strategy.motion} summary={strategy.motionSummary} />
              <SnapshotCard snapshot={strategy.snapshot} />
              <BattleCards battleCards={strategy.battleCards} />
              <NarrativeCard narrative={strategy.launchNarrative} />
              <ActivationTimeline plan={strategy.activationPlan.phases} enablement={strategy.activationPlan.enablement} />
              <GrowthLoops loops={strategy.growthLoops} />
              <MetricsCard metrics={strategy.metrics} revenueModel={strategy.activationPlan.revenueModel} />
            </div>
          ) : (
            <EmptyState />
          )}
        </Transition>
        {!strategy && <EmptyState />}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center text-slate-400">
      <p className="text-base font-medium text-slate-300">No output yet</p>
      <p className="mt-2 text-sm">Enter product context and run the agent to orchestrate your GTM system.</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-200">
      <span>{label}</span>
      {textarea ? (
        <textarea
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
        />
      )}
    </label>
  );
}

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: { label: string; value: T; description: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-slate-200">{label}</legend>
      <div className="grid gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={clsx(
                'rounded-2xl border px-4 py-3 text-left transition',
                selected
                  ? 'border-primary-400 bg-primary-500/10 text-primary-100 shadow-lg shadow-primary-900/20'
                  : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-primary-500/40 hover:bg-slate-900'
              )}
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="mt-1 text-xs text-slate-400">{option.description}</p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SnapshotCard({ snapshot }: { snapshot: AgentResponse['snapshot'] }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
      <h3 className="text-lg font-semibold text-slate-100">Launch snapshot</h3>
      <p className="mt-2 text-sm text-slate-400">
        Immediate hooks, buyer jobs-to-be-done, positioning statement, and priority channels to light up the market.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <SnapshotList title="Core hooks" items={snapshot.coreHooks} />
        <SnapshotList title="Buyer jobs" items={snapshot.buyerJobs} />
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-200">Positioning</h4>
        <p className="mt-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-200">
          {snapshot.positioning}
        </p>
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-200">Channel system</h4>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {snapshot.recommendedChannels.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SnapshotList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChannelCard({ channel }: { channel: ChannelPlan }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm">
      <p className="font-semibold text-slate-100">{channel.name}</p>
      <p className="mt-1 text-slate-400">{channel.objective}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Cadence</p>
      <p className="text-slate-300">{channel.cadence}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Play</p>
      <p className="text-slate-300">{channel.play}</p>
    </div>
  );
}

function BattleCards({ battleCards }: { battleCards: BattleCard[] }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
      <h3 className="text-lg font-semibold text-slate-100">Battle cards</h3>
      <p className="mt-2 text-sm text-slate-400">
        Equip marketing, sales, and success teams with crisp proof points to close loops fast.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {battleCards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm font-semibold text-slate-100">{card.title}</p>
            <p className="mt-2 text-sm text-slate-300">{card.value}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-primary-300">Proof</p>
            <p className="text-sm text-slate-300">{card.proof}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NarrativeCard({ narrative }: { narrative: AgentResponse['launchNarrative'] }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
      <h3 className="text-lg font-semibold text-slate-100">Narrative spine</h3>
      <div className="mt-4 space-y-6 text-sm text-slate-300">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-300">Headline</p>
          <p className="mt-1 text-base font-semibold text-slate-100">{narrative.headline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-300">Elevator pitch</p>
          <p className="mt-1 leading-relaxed">{narrative.elevatorPitch}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-300">Narrative arcs</p>
          <ul className="mt-2 space-y-2">
            {narrative.narrativeArcs.map((arc) => (
              <li key={arc} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                {arc}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-300">Primary CTA</p>
          <p className="mt-1 font-semibold text-slate-100">{narrative.callToAction}</p>
        </div>
      </div>
    </div>
  );
}

function ActivationTimeline({ plan, enablement }: { plan: ActivationPhase[]; enablement: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Activation timeline</h3>
          <p className="mt-2 text-sm text-slate-400">Sequenced phases that ladder into launch momentum and revenue capture.</p>
        </div>
        <div className="rounded-2xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-xs text-primary-100">
          Enablement focus: {enablement[0]}
        </div>
      </div>
      <div className="mt-6 space-y-6">
        {plan.map((phase) => (
          <div key={phase.name} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-200">{phase.duration}</p>
                <p className="text-base font-semibold text-slate-100">{phase.name}</p>
              </div>
              <p className="text-sm text-slate-400 md:max-w-xl">{phase.focus}</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {phase.tactics.map((tactic) => (
                <li key={tactic} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  {tactic}
                </li>
              ))}
            </ul>
            {phase.dependency && (
              <p className="mt-3 text-xs text-slate-500">Dependency: {phase.dependency}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <p className="text-xs uppercase tracking-wide text-primary-300">Enablement kit</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {enablement.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GrowthLoops({ loops }: { loops: GrowthLoop[] }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
      <h3 className="text-lg font-semibold text-slate-100">Growth loops</h3>
      <p className="mt-2 text-sm text-slate-400">Mechanisms that compound demand and activation post-launch.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {loops.map((loop) => (
          <div key={loop.name} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm">
            <p className="font-semibold text-slate-100">{loop.name}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-primary-300">Trigger</p>
            <p className="text-slate-300">{loop.trigger}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Motion</p>
            <p className="text-slate-300">{loop.motion}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Instrumentation</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
              {loop.instrumentation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsCard({ metrics, revenueModel }: { metrics: MetricRecommendation[]; revenueModel: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
      <h3 className="text-lg font-semibold text-slate-100">Operating dashboard</h3>
      <p className="mt-2 text-sm text-slate-400">Track the right leading indicators and align teams on revenue mechanics.</p>
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <p className="text-xs uppercase tracking-wide text-primary-300">Revenue model</p>
        <p className="mt-1 text-sm text-slate-200">{revenueModel}</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.name} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm">
            <p className="font-semibold text-slate-100">{metric.name}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Leading indicator</p>
            <p className="text-slate-300">{metric.leadingIndicator}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Cadence</p>
            <p className="text-slate-300">{metric.cadence}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-primary-300">Target</p>
            <p className="text-slate-300">{metric.targetFormula}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MotionSummary({ selectedMotion, summary }: { selectedMotion: AgentInput['motion']; summary: string }) {
  const currentMotion = MOTION_OPTIONS.find((item) => item.value === selectedMotion);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-3xl border border-primary-500/20 bg-primary-500/10 p-6 text-sm text-primary-100"
    >
      <p className="text-xs uppercase tracking-wide text-primary-200">Commercial motion</p>
      <p className="mt-1 text-base font-semibold text-primary-100">
        {currentMotion ? currentMotion.label : 'Selected motion'}
      </p>
      <p className="mt-3 text-primary-100/90">{summary}</p>
      {currentMotion && <p className="mt-3 text-xs text-primary-200/80">Focus: {currentMotion.description}</p>}
    </motion.div>
  );
}
