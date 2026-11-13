import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SupplyChainFlow from "@/components/SupplyChainFlow";
import ProductCards from "@/components/ProductCards";
import TransparencyMetrics from "@/components/TransparencyMetrics";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SupplyChainFlow />
      <ProductCards />
      <TransparencyMetrics />
      <Footer />
    </div>
  );
};

export default Index;
