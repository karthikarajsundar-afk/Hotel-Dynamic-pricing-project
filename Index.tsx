import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Zap, Shield, BarChart3, Clock } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { hotels, lastUpdate } = useDynamicPricing(5000);
  const [filter, setFilter] = useState<"all" | "deals" | "trending">("all");

  const filtered = hotels.filter((h) => {
    if (filter === "deals") return h.demandLevel === "low" || h.priceTrend === "dropping";
    if (filter === "trending") return h.demandLevel === "high" || h.priceTrend === "rising";
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
              <Zap className="h-3 w-3 mr-1" /> AI-Powered Dynamic Pricing
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Book Smart. Save More.
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl">
              Our AI tracks real-time demand to find you the best hotel prices. Prices update every few seconds.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
          <div className="flex justify-center gap-8 mt-10 text-primary-foreground/70">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">2,400+</div>
              <div className="text-xs">Hotels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">$42M</div>
              <div className="text-xs">Saved by Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">98%</div>
              <div className="text-xs">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">How Dynamic Pricing Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: BarChart3, title: "Real-Time Analysis", desc: "Our AI analyzes demand, seasonality, and events to predict price changes." },
              { icon: TrendingDown, title: "Price Drop Alerts", desc: "Set target prices and get notified instantly when prices drop." },
              { icon: Shield, title: "Best Price Guarantee", desc: "We ensure you always book at the optimal price point." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-lg bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Hotels</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> Prices updated {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              {(["all", "deals", "trending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {f === "all" ? "All" : f === "deals" ? "Best Deals" : "Trending"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-primary-foreground">
          {[
            { val: "15%", label: "Avg. Savings" },
            { val: "50K+", label: "Happy Travelers" },
            { val: "120+", label: "Countries" },
            { val: "4.8★", label: "App Rating" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-bold text-accent">{val}</div>
              <div className="text-sm text-primary-foreground/70">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
