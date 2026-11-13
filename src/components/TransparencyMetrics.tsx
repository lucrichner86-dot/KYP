import { Lock, Eye, FileCheck, Users } from "lucide-react";

const metrics = [
  {
    icon: FileCheck,
    value: "100%",
    label: "COA Verification Rate",
    desc: "Every certificate of analysis is independently verified against the issuing laboratory.",
  },
  {
    icon: Eye,
    value: "0",
    label: "Sponsored Listings",
    desc: "No product pays for placement. Rankings are determined exclusively by verified quality data.",
  },
  {
    icon: Lock,
    value: "256-bit",
    label: "Data Encryption",
    desc: "All supply chain data is encrypted end-to-end. Batch records are immutable once verified.",
  },
  {
    icon: Users,
    value: "Open",
    label: "Public Audit Trail",
    desc: "Every data point traceable. Consumers and regulators access the same verified information.",
  },
];

const TransparencyMetrics = () => {
  return (
    <section id="transparency" className="relative border-t border-border py-24">
      <div className="absolute inset-0 grid-clinical opacity-20" />
      <div className="container relative mx-auto px-6">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs tracking-widest text-primary">TRANSPARENCY</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Built on trust, not marketing.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            KYP exists because consumers deserve to know exactly what they're buying.
            Every metric is backed by verifiable data.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group rounded-sm border border-border bg-card p-6 transition-all hover:border-primary/20 hover:border-glow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary transition-colors group-hover:border-primary/20">
                <metric.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div className="font-mono text-3xl font-bold text-foreground">{metric.value}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{metric.label}</div>
              <p className="mt-2 text-sm text-muted-foreground">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransparencyMetrics;
