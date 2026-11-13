import { ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";

interface Product {
  name: string;
  strain: string;
  producer: string;
  thc: string;
  cbd: string;
  topTerpene: string;
  batchId: string;
  coaStatus: "verified" | "pending";
  qualityScore: number;
  irradiated: boolean;
}

const products: Product[] = [
  {
    name: "Nordic Haze",
    strain: "Sativa",
    producer: "GreenPharma GmbH",
    thc: "22.4%",
    cbd: "0.8%",
    topTerpene: "Myrcene",
    batchId: "BP-2026-0291",
    coaStatus: "verified",
    qualityScore: 94,
    irradiated: false,
  },
  {
    name: "Clinical Kush",
    strain: "Indica",
    producer: "MedCanna AG",
    thc: "19.1%",
    cbd: "3.2%",
    topTerpene: "Limonene",
    batchId: "MC-2026-0847",
    coaStatus: "verified",
    qualityScore: 91,
    irradiated: false,
  },
  {
    name: "Alpine White",
    strain: "Hybrid",
    producer: "Swiss Botanical Ltd",
    thc: "17.8%",
    cbd: "1.4%",
    topTerpene: "Linalool",
    batchId: "SB-2026-1203",
    coaStatus: "pending",
    qualityScore: 87,
    irradiated: true,
  },
  {
    name: "Berliner Diesel",
    strain: "Sativa",
    producer: "CannaWerk Berlin",
    thc: "24.1%",
    cbd: "0.3%",
    topTerpene: "Caryophyllene",
    batchId: "CW-2026-0562",
    coaStatus: "verified",
    qualityScore: 96,
    irradiated: false,
  },
];

const getScoreColor = (score: number) => {
  if (score >= 95) return "text-verified";
  if (score >= 90) return "text-primary";
  if (score >= 85) return "text-data";
  return "text-warning";
};

const ProductCards = () => {
  return (
    <section id="products" className="relative border-t border-border py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-xs tracking-widest text-primary">PRODUCTS</span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Quality first. Always.
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Every product ranked by verified lab data. No sponsored listings, no paid placements.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80">
            View all products <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-px rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.batchId}
              className="group flex flex-col bg-background p-5 transition-colors hover:bg-card"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{product.producer}</p>
                </div>
                <span className={`font-mono text-2xl font-bold ${getScoreColor(product.qualityScore)}`}>
                  {product.qualityScore}
                </span>
              </div>

              {/* Strain badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="data-badge border-border text-muted-foreground">{product.strain}</span>
                {product.irradiated && (
                  <span className="data-badge border-warning/30 text-warning flex items-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    IRR
                  </span>
                )}
              </div>

              {/* Data grid */}
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
                <div>
                  <span className="block font-mono text-[10px] tracking-widest text-muted-foreground/60">THC</span>
                  <span className="font-mono text-sm font-medium text-foreground">{product.thc}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] tracking-widest text-muted-foreground/60">CBD</span>
                  <span className="font-mono text-sm font-medium text-foreground">{product.cbd}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] tracking-widest text-muted-foreground/60">TERP</span>
                  <span className="font-mono text-xs font-medium text-foreground">{product.topTerpene}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-[10px] text-muted-foreground/60">{product.batchId}</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className={`h-3.5 w-3.5 ${
                    product.coaStatus === "verified" ? "text-verified" : "text-muted-foreground"
                  }`} />
                  <span className={`font-mono text-[10px] uppercase ${
                    product.coaStatus === "verified" ? "text-verified" : "text-muted-foreground"
                  }`}>
                    {product.coaStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCards;
