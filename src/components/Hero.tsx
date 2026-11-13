import { ArrowRight, ShieldCheck, Activity } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 grid-clinical opacity-40" />
      
      {/* Subtle radial glow */}
      <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
        {/* Status badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-verified animate-pulse-slow" />
          <span className="font-mono text-xs text-muted-foreground">LIVE DATA FEED</span>
          <span className="font-mono text-xs text-verified">● 2,847 BATCHES TRACKED</span>
        </div>

        {/* Main headline */}
        <h1 className="max-w-4xl text-center text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Know Your{" "}
          <span className="text-gradient-primary">Product</span>
          <span className="text-muted-foreground">.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
          Full supply chain transparency for cannabis. Real-time batch records, 
          verified COAs, and quality metrics — no pay-to-play, no marketing noise. 
          Just data.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button className="group flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-primary">
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button className="flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
            <ShieldCheck className="h-4 w-4" />
            Verify a Batch
          </button>
        </div>

        {/* Data ticker */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-px rounded-sm border border-border bg-border sm:grid-cols-4">
          {[
            { label: "PRODUCERS", value: "142", icon: "◆" },
            { label: "COAs VERIFIED", value: "8,291", icon: "◇" },
            { label: "BATCHES", value: "2,847", icon: "□" },
            { label: "DATA POINTS", value: "1.2M", icon: "○" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 bg-background px-4 py-6">
              <span className="font-mono text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground animate-pulse-slow" />
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
