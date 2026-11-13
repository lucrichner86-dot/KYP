import { Sprout, FlaskConical, Truck, Store, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Sprout,
    label: "CULTIVATION",
    title: "Origin Verified",
    desc: "Seed-to-harvest tracking with environmental data, pesticide records, and cultivation parameters.",
    data: "GPS • Climate • Soil",
  },
  {
    icon: FlaskConical,
    label: "TESTING",
    title: "Lab Certified",
    desc: "Independent COA verification. Cannabinoid profiles, terpene analysis, contaminant screening.",
    data: "THC • CBD • Terpenes",
  },
  {
    icon: Truck,
    label: "DISTRIBUTION",
    title: "Chain of Custody",
    desc: "Temperature-controlled logistics tracking. Every handoff documented and timestamped.",
    data: "Temp • Humidity • Time",
  },
  {
    icon: Store,
    label: "RETAIL",
    title: "Point of Sale",
    desc: "Final quality check at dispensary level. Storage conditions and shelf-life monitoring.",
    data: "Storage • Freshness",
  },
  {
    icon: ShieldCheck,
    label: "CONSUMER",
    title: "Full Transparency",
    desc: "Scan, verify, and compare. Access the complete product journey from your device.",
    data: "QR • Batch ID • COA",
  },
];

const SupplyChainFlow = () => {
  return (
    <section id="supply-chain" className="relative border-t border-border py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-widest text-primary">SUPPLY CHAIN</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Every step. Recorded.
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            From seed to sale, every data point is captured, verified, and made accessible. 
            No blind spots.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-chain-line md:left-1/2 md:block" />

          <div className="space-y-6 md:space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`relative flex flex-col gap-6 md:flex-row md:items-center ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div className={`rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/20 ${
                    i % 2 === 0 ? "md:ml-auto" : ""
                  } md:max-w-md`}>
                    <span className="font-mono text-[10px] tracking-widest text-primary">
                      {step.label}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                    <div className="mt-3 font-mono text-xs text-muted-foreground/60">{step.data}</div>
                  </div>
                </div>

                {/* Node */}
                <div className="absolute left-6 top-6 z-10 hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplyChainFlow;
