'use client';

import AgentDetails from 'components/agents/AgentDetails';

export default function AgentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <AgentDetails agentId={params.id} />
    </div>
  );
}
