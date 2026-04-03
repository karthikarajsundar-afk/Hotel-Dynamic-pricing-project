import { Hotel } from "@/types/hotel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PriceSparkline from "./PriceSparkline";

const trendConfig = {
  rising: { icon: TrendingUp, label: "Rising", className: "bg-destructive/10 text-destructive border-destructive/20" },
  dropping: { icon: TrendingDown, label: "Dropping", className: "bg-success/10 text-success border-success/20" },
  stable: { icon: Minus, label: "Stable", className: "bg-muted text-muted-foreground border-border" },
};

const demandConfig = {
  high: { label: "High Demand", className: "bg-destructive text-destructive-foreground" },
  medium: { label: "Moderate", className: "bg-warning text-warning-foreground" },
  low: { label: "Best Deal", className: "bg-success text-success-foreground" },
};

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const navigate = useNavigate();
  const trend = trendConfig[hotel.priceTrend];
  const demand = demandConfig[hotel.demandLevel];
  const TrendIcon = trend.icon;
  const savings = hotel.basePrice - hotel.currentPrice;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={demand.className}>{demand.label}</Badge>
        </div>
        <Badge variant="outline" className={`absolute top-3 right-3 ${trend.className} flex items-center gap-1`}>
          <TrendIcon className="h-3 w-3" />
          {trend.label}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{hotel.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" /> {hotel.location}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold text-sm">{hotel.rating}</span>
          <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
        </div>

        <PriceSparkline data={hotel.priceHistory} />

        <div className="flex items-end justify-between">
          <div>
            {savings > 0 && (
              <span className="text-xs text-muted-foreground line-through">${hotel.basePrice}</span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">${hotel.currentPrice}</span>
              <span className="text-xs text-muted-foreground">/night</span>
            </div>
            {savings > 0 && (
              <span className="text-xs font-medium text-success">Save ${savings}</span>
            )}
          </div>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate(`/hotel/${hotel.id}`)}>
            View Deal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
