export default function StatsBar() {
  const stats = [
    { id: 1, name: 'Interviews Practiced', value: '500+' },
    { id: 2, name: 'Learning Roadmaps', value: '10+' },
    { id: 3, name: 'Always', value: '100% Free' },
  ];

  return (
    <div className="bg-indigo-600/10 py-16 sm:py-24 border-y border-indigo-600/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-muted-foreground">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
