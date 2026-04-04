import { Bot, Map, LineChart } from 'lucide-react';

const features = [
  {
    name: 'AI Mock Interviews',
    description: 'Experience realistic technical interviews powered by advanced AI. Select your target role and difficulty level, and practice answering targeted questions.',
    icon: Bot,
  },
  {
    name: 'Learning Roadmaps',
    description: 'Follow curated learning paths designed by industry experts. Track your progress step-by-step from beginner fundamentals to advanced concepts.',
    icon: Map,
  },
  {
    name: 'Progress Tracking',
    description: 'Get actionable feedback after every interview. Understand your strengths, identify areas for improvement, and measure your growth over time.',
    icon: LineChart,
  },
];

export default function FeaturesSection() {
  return (
    <div className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Prepare Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to succeed
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            BreshUP provides a complete ecosystem for interview preparation, combining structured learning with realistic AI-driven practice.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col bg-card/60 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-sm transition-transform hover:-translate-y-1">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
