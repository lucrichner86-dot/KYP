import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-primary/30 bg-primary/10">
                <Shield className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-base font-bold text-foreground">KYP</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Know Your Product. Full supply chain transparency for cannabis.
            </p>
            <p className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground/40">
              © 2026 KYP. ALL DATA VERIFIED.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground">
              PLATFORM
            </h4>
            <ul className="space-y-3">
              {["Product Database", "Batch Verification", "COA Library", "Quality Rankings"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground">
              FOR BUSINESS
            </h4>
            <ul className="space-y-3">
              {["Producer Portal", "Lab Integration", "API Access", "Supply Chain Tools"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground">
              RESOURCES
            </h4>
            <ul className="space-y-3">
              {["Documentation", "Data Standards", "Open Source", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
