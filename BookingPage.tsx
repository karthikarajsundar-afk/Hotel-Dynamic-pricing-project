import { useParams, useNavigate } from "react-router-dom";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Calendar, Users, CreditCard, ArrowLeft } from "lucide-react";

const BookingPage = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { hotels } = useDynamicPricing(5000);
  const { user } = useAuth();

  const hotel = hotels.find((h) => h.id === hotelId);
  const room = hotel?.rooms.find((r) => r.id === roomId);

  const [step, setStep] = useState<"details" | "confirmed">("details");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!hotel || !room) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Room not found</div>;

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const subtotal = room.currentPrice * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;
  const savings = (room.basePrice - room.currentPrice) * nights;

  const handleBook = async () => {
    if (!name || !email || !checkIn || !checkOut) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      navigate("/auth");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      hotel_id: hotel.id,
      room_id: room.id,
      hotel_name: hotel.name,
      room_name: room.name,
      check_in: checkIn,
      check_out: checkOut,
      guests: parseInt(guests),
      total_price: total,
      status: "confirmed",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to save booking: " + error.message);
      return;
    }
    setStep("confirmed");
    toast.success("Booking confirmed and saved!");
  };

  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
          <h1 className="font-heading text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your reservation at {hotel.name} has been confirmed.</p>
          <div className="bg-secondary/50 rounded-lg p-4 text-left text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-medium">{room.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-medium">{checkIn}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-medium">{checkOut}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{guests}</span></div>
            <div className="border-t border-border pt-2 flex justify-between font-bold"><span>Total</span><span>${total}</span></div>
            {savings > 0 && <div className="text-success text-xs font-medium text-center">You saved ${savings} with dynamic pricing!</div>}
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate("/search")}>Search More Hotels</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-accent" /> Stay Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Check-in</Label><Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
                <div><Label>Check-out</Label><Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></div>
                <div><Label>Guests</Label><Input type="number" min="1" max={room.capacity} value={guests} onChange={(e) => setGuests(e.target.value)} /></div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Guest Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Full Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" /></div>
                <div><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" /></div>
                <div><Label>Phone</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" /></div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-accent" /> Payment</h2>
              <p className="text-sm text-muted-foreground">Payment will be collected at check-in. No credit card required now.</p>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-20 space-y-4">
              <div className="flex gap-3">
                <img src={hotel.images[0]} alt={hotel.name} className="w-20 h-16 rounded-md object-cover" />
                <div>
                  <h3 className="font-semibold text-sm">{hotel.name}</h3>
                  <p className="text-xs text-muted-foreground">{room.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">{room.capacity} guests max</Badge>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">${room.currentPrice} × {nights} night{nights > 1 ? "s" : ""}</span><span>${subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Taxes & fees</span><span>${taxes}</span></div>
                {savings > 0 && <div className="flex justify-between text-success"><span>Dynamic savings</span><span>-${savings}</span></div>}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>${total}</span></div>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleBook} disabled={submitting}>
                {submitting ? "Confirming..." : "Confirm Booking"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
