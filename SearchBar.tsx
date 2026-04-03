import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const SearchBar = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-4 md:p-6 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="pl-9" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={handleSearch} className="bg-accent text-accent-foreground hover:bg-accent/90 h-10">
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
