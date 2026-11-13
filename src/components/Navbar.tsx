import { Shield, Database, Eye } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/30 bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-foreground">KYP</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">Know Your Product</span>
          </div>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#supply-chain" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Supply Chain
          </a>
          <a href="#products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Products
          </a>
          <a href="#transparency" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Transparency
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-sm border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground transition-colors hover:bg-muted">
            <Database className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Data Portal</span>
          </button>
          <button className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Eye className="h-3.5 w-3.5" />
            <span>Verify</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
