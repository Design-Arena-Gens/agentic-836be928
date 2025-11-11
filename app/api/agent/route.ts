import { NextResponse } from 'next/server';
import { buildGtmStrategy, type AgentInput } from '@/lib/agent';

function sanitizeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<AgentInput>;
    const input: AgentInput = {
      productName: sanitizeString(payload.productName),
      productDescription: sanitizeString(payload.productDescription),
      targetAudience: sanitizeString(payload.targetAudience),
      primaryGoal: sanitizeString(payload.primaryGoal),
      differentiators: sanitizeString(payload.differentiators),
      tone: sanitizeString(payload.tone) || 'confident',
      launchDate: sanitizeString(payload.launchDate) || undefined,
      budgetLevel: (payload.budgetLevel as AgentInput['budgetLevel']) ?? 'standard',
      motion: (payload.motion as AgentInput['motion']) ?? 'hybrid'
    };

    const strategy = buildGtmStrategy(input);
    return NextResponse.json(strategy, { status: 200 });
  } catch (error) {
    console.error('Agent error', error);
    return NextResponse.json(
      { message: 'Unable to generate go-to-market plan. Please retry.' },
      { status: 400 }
    );
  }
}
