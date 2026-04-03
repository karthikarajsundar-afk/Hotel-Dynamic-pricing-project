import { useSearchParams } from "react-router-dom";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import HotelCard from "@/components/HotelCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Clock } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { hotels, lastUpdate } = useDynamicPricing(5000);
  const [query, setQuery] = useState(searchParams.get("destination") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "popularity">("price");

  const results = useMemo(() => {
    let filtered = hotels.filter((h) => {
      const matchesQuery = !query || h.name.toLowerCase().includes(query.toLowerCase()) || h.location.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = h.currentPrice >= priceRange[0] && h.currentPrice <= priceRange[1];
      const matchesRating = h.rating >= minRating;
      return matchesQuery && matchesPrice && matchesRating;
    });

    filtered.sort((a, b) => {
      if (sortBy === "price") return a.currentPrice - b.currentPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

    return filtered;
  }, [hotels, query, priceRange, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 space-y-6">
            <div className="p-4 bg-card border border-border rounded-lg space-y-5">
              <h3 className="font-heading font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search hotels..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Rating: {minRating}+</label>
                <Slider min={0} max={5} step={0.5} value={[minRating]} onValueChange={(v) => setMinRating(v[0])} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {(["price", "rating", "popularity"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        sortBy === s ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-heading text-2xl font-bold">
                  {query ? `Results for "${query}"` : "All Hotels"}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Live prices · Updated {lastUpdate.toLocaleTimeString()} · {results.length} hotels
                </p>
              </div>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No hotels found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
