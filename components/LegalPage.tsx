export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-mobile py-10 md:max-w-2xl">
      <h1 className="mb-1">{title}</h1>
      <p className="mb-8 text-xs text-ink-500">Last updated: {lastUpdated}</p>
      <div className="space-y-6 text-sm leading-relaxed text-ink-500">{children}</div>
    </div>
  );
}
