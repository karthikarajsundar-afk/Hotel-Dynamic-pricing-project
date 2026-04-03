import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Hotel, User, LogOut, Bell, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Hotel className="h-7 w-7 text-accent" />
          <span className="font-heading text-xl font-bold text-primary-foreground">StayDynamic</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/search" className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors">
            Search Hotels
          </Link>
          {user && (
            <Link to="/alerts" className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-1">
              <Bell className="h-4 w-4" /> Alerts
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-primary-foreground/70 truncate max-w-[150px]">{user.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()} className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-primary-foreground/80 hover:text-accent">
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth?tab=signup")} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Sign Up
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-primary p-4 space-y-3">
          <Link to="/search" className="block text-sm text-primary-foreground/80 hover:text-accent" onClick={() => setMobileOpen(false)}>Search Hotels</Link>
          {user && (
            <Link to="/alerts" className="block text-sm text-primary-foreground/80 hover:text-accent" onClick={() => setMobileOpen(false)}>Price Alerts</Link>
          )}
          {user ? (
            <Button variant="outline" size="sm" onClick={() => { signOut(); setMobileOpen(false); }} className="w-full border-accent text-accent">
              Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="w-full bg-accent text-accent-foreground">
              Sign In / Sign Up
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
