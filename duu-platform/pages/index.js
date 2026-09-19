import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import TopPerformanceCards from '../components/TopPerformanceCards';
import PerformanceInsights from '../components/PerformanceInsights';
import LearnedSignals from '../components/LearnedSignals';
import NextPostRecommendation from '../components/NextPostRecommendation';
import IdeaGenerator from '../components/IdeaGenerator';
import CampaignGenerator from '../components/CampaignGenerator';
import FutureMeasurement from '../components/FutureMeasurement';
import { GOALS } from '../lib/recommendations';

export default function Home() {
  const [goal, setGoal] = useState(GOALS[0].id);
  const goalLabel = GOALS.find((g) => g.id === goal)?.label;

  return (
    <>
      <Head>
        <title>DUU Tech × Small Town Records — Content Decisions</title>
      </Head>
      <main className="min-h-screen bg-charcoal pb-16">
        <Header goal={goal} setGoal={setGoal} />
        <TopPerformanceCards />
        <div className="torn-divider mx-auto max-w-6xl opacity-40" />
        <PerformanceInsights />
        <div className="torn-divider mx-auto max-w-6xl opacity-40" />
        <LearnedSignals />
        <div className="torn-divider mx-auto max-w-6xl opacity-40" />
        <NextPostRecommendation goal={goal} />
        <div className="torn-divider mx-auto max-w-6xl opacity-40" />
        <IdeaGenerator goalHint={goalLabel} />
        <CampaignGenerator goalHint={goalLabel} />
        <div className="torn-divider mx-auto max-w-6xl opacity-40" />
        <FutureMeasurement />

        <footer className="mx-auto mt-10 max-w-6xl px-6 text-xs text-creamdim/60">
          Built from a 12-record Instagram export. Rows without usable post-level metrics (unmatched audience
          screenshots, header-less posts) are excluded from rankings but preserved in the source data.
        </footer>
      </main>
    </>
  );
}
