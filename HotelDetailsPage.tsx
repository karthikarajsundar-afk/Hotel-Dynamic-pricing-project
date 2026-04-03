import { useParams, useNavigate } from "react-router-dom";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, MapPin, TrendingUp, TrendingDown, Minus, Bell, Wifi, Waves, Dumbbell, UtensilsCrossed, Wine, Car, Sparkles, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const amenityIcons: Record<string, any> = {
  WiFi: Wifi, Pool: Waves, Gym: Dumbbell, Restaurant: UtensilsCrossed,
  Bar: Wine, "Valet Parking": Car, Spa: Sparkles,
};

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotels } = useDynamicPricing(5000);
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [alertPrice, setAlertPrice] = useState("");
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Hotel not found</div>;

  const trendIcon = hotel.priceTrend === "rising" ? TrendingUp : hotel.priceTrend === "dropping" ? TrendingDown : Minus;
  const TIcon = trendIcon;
  const savings = hotel.basePrice - hotel.currentPrice;

  const demandFactor = hotel.demandLevel === "high" ? 1.25 : hotel.demandLevel === "low" ? 0.85 : 1.0;
  const isWeekend = [0, 5, 6].includes(new Date().getDay());
  const weekendSurge = isWeekend ? 1.1 : 1.0;

  const handleSetAlert = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!alertPrice) return;
    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      target_price: parseFloat(alertPrice),
    });
    if (error) {
      toast.error("Failed to set alert: " + error.message);
      return;
    }
    toast.success(`Price alert set for $${alertPrice}! We'll notify you when the price drops.`);
    setAlertPrice("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 rounded-lg overflow-hidden aspect-[16/10]">
            <img src={hotel.images[selectedImage]} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex lg:flex-col gap-2">
            {hotel.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className={`rounded-lg overflow-hidden flex-1 border-2 transition-colors ${i === selectedImage ? "border-accent" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover aspect-video" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="font-heading text-3xl font-bold">{hotel.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" /> {hotel.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="text-lg font-bold">{hotel.rating}</span>
                  <span className="text-sm text-muted-foreground">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-3">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hotel.amenities.map((a) => {
                  const Icon = amenityIcons[a] || Sparkles;
                  return (
                    <div key={a} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 text-sm">
                      <Icon className="h-4 w-4 text-accent" /> {a}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const roomSavings = room.basePrice - room.currentPrice;
                  return (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <img src={room.image} alt={room.name} className="w-full md:w-48 h-32 object-cover" />
                        <CardContent className="flex-1 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{room.name}</h3>
                            <p className="text-sm text-muted-foreground">{room.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {room.amenities.map((a) => (
                                <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Up to {room.capacity} guests</p>
                          </div>
                          <div className="text-right">
                            {roomSavings > 0 && <span className="text-xs text-muted-foreground line-through">${room.basePrice}</span>}
                            <div className="text-2xl font-bold">${room.currentPrice}</div>
                            <span className="text-xs text-muted-foreground">/night</span>
                            {roomSavings > 0 && <div className="text-xs text-success font-medium">Save ${roomSavings}</div>}
                            <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
                              onClick={() => navigate(`/booking/${hotel.id}/${room.id}`)}>
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Price History Chart */}
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">7-Day Price History</h2>
              <Card className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={hotel.priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v: number) => [`$${v}`, "Price"]} />
                    <Line type="monotone" dataKey="price" stroke="hsl(45,93%,58%)" strokeWidth={2} dot={{ fill: "hsl(45,93%,58%)", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Guest Reviews</h2>
              <div className="space-y-4">
                {hotel.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="p-6 border-accent/30 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={hotel.priceTrend === "dropping" ? "bg-success/10 text-success" : hotel.priceTrend === "rising" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}>
                  <TIcon className="h-3 w-3 mr-1" />
                  Price {hotel.priceTrend}
                </Badge>
                <Badge className={hotel.demandLevel === "high" ? "bg-destructive text-destructive-foreground" : hotel.demandLevel === "low" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                  {hotel.demandLevel === "high" ? "High Demand" : hotel.demandLevel === "low" ? "Low Demand" : "Moderate"}
                </Badge>
              </div>
              {savings > 0 && <span className="text-sm text-muted-foreground line-through">${hotel.basePrice}</span>}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">${hotel.currentPrice}</span>
                <span className="text-muted-foreground">/night</span>
              </div>
              {savings > 0 && <p className="text-sm text-success font-medium mb-4">You save ${savings} per night!</p>}

              {/* Dynamic breakdown */}
              <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1 mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Base price</span><span>${hotel.basePrice}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Demand factor</span><span>×{demandFactor}</span></div>
                {isWeekend && <div className="flex justify-between"><span className="text-muted-foreground">Weekend surge</span><span>×{weekendSurge}</span></div>}
                <div className="border-t border-border pt-1 flex justify-between font-semibold"><span>Current</span><span>${hotel.currentPrice}</span></div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                <Clock className="h-3 w-3" /> Prices update every 5 seconds
              </p>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4"
                onClick={() => navigate(`/booking/${hotel.id}/${hotel.rooms[0]?.id}`)}>
                Book Now
              </Button>

              {/* Price Alert */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold flex items-center gap-1 mb-2"><Bell className="h-4 w-4 text-accent" /> Set Price Alert</h4>
                <div className="flex gap-2">
                  <Input placeholder="Target $" type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} />
                  <Button variant="outline" onClick={handleSetAlert}>Set</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">We'll email you when the price drops to your target.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
