import { Hotel } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6 text-accent" />
            <span className="font-heading text-lg font-bold">StayDynamic</span>
          </div>
          <p className="text-sm text-primary-foreground/70">AI-powered dynamic pricing for smarter hotel bookings. Save more by booking at the right time.</p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/search" className="hover:text-accent transition-colors">Search Hotels</Link></li>
            <li><Link to="/" className="hover:text-accent transition-colors">Best Deals</Link></li>
            <li><Link to="/" className="hover:text-accent transition-colors">How It Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><span className="hover:text-accent transition-colors cursor-pointer">Help Center</span></li>
            <li><span className="hover:text-accent transition-colors cursor-pointer">Contact Us</span></li>
            <li><span className="hover:text-accent transition-colors cursor-pointer">Privacy Policy</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Stay Updated</h4>
          <p className="text-sm text-primary-foreground/70">Get notified about the best deals and price drops.</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} StayDynamic. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
