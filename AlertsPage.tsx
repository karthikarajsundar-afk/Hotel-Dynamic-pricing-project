import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, TrendingDown, CheckCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  hotel_id: string;
  hotel_name: string;
  target_price: number;
  is_active: boolean;
}

const AlertsPage = () => {
  const { hotels } = useDynamicPricing(5000);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const fetchAlerts = async () => {
      const { data } = await supabase.from("price_alerts").select("*").eq("user_id", user.id).eq("is_active", true);
      if (data) setAlerts(data);
      setLoading(false);
    };
    fetchAlerts();
  }, [user]);

  // Check for triggered alerts
  useEffect(() => {
    alerts.forEach((alert) => {
      const hotel = hotels.find((h) => h.id === alert.hotel_id);
      if (hotel && hotel.currentPrice <= alert.target_price && !notifiedRef.current.has(alert.id)) {
        notifiedRef.current.add(alert.id);
        toast.success(`🔔 Price alert! ${alert.hotel_name} dropped to $${hotel.currentPrice} (target: $${alert.target_price})`);
      }
    });
  }, [hotels, alerts]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <Bell className="h-12 w-12 text-accent mx-auto" />
          <h2 className="font-heading text-xl font-bold">Sign in to manage alerts</h2>
          <p className="text-sm text-muted-foreground">Create an account to set price alerts and never miss a deal.</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate("/auth")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  const removeAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.info("Alert removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Price Alerts</h1>
        <p className="text-muted-foreground mb-6">Monitor hotel prices and get notified when they drop to your target.</p>

        {loading ? (
          <p className="text-muted-foreground">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No active alerts. Set one from any hotel page!</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/search")}>Browse Hotels</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const hotel = hotels.find((h) => h.id === alert.hotel_id);
              const currentPrice = hotel?.currentPrice ?? 0;
              const isTriggered = currentPrice > 0 && currentPrice <= alert.target_price;

              return (
                <Card key={alert.id} className={`overflow-hidden ${isTriggered ? "border-success/50" : ""}`}>
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isTriggered ? <CheckCircle className="h-8 w-8 text-success shrink-0" /> : <TrendingDown className="h-8 w-8 text-accent shrink-0" />}
                      <div>
                        <h3 className="font-semibold">{alert.hotel_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Target: <span className="font-medium text-foreground">${alert.target_price}</span> · Current: <span className="font-medium text-foreground">${currentPrice}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isTriggered ? <Badge className="bg-success text-success-foreground">Price Met!</Badge> : <Badge variant="secondary">Monitoring</Badge>}
                      {isTriggered && (
                        <Button size="sm" className="bg-accent text-accent-foreground" onClick={() => navigate(`/hotel/${alert.hotel_id}`)}>Book Now</Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => removeAlert(alert.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
