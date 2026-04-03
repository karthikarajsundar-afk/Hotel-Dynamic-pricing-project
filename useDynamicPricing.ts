import { useState, useEffect, useCallback } from "react";
import { Hotel } from "@/types/hotel";
import { hotels as initialHotels } from "@/data/hotels";

const DEMAND_FACTORS = {
  low: 0.85,
  medium: 1.0,
  high: 1.25,
};

const randomDemandShift = (): "low" | "medium" | "high" => {
  const r = Math.random();
  if (r < 0.3) return "low";
  if (r < 0.7) return "medium";
  return "high";
};

const calculatePrice = (basePrice: number, demandLevel: "low" | "medium" | "high") => {
  const factor = DEMAND_FACTORS[demandLevel];
  const noise = 1 + (Math.random() - 0.5) * 0.06;
  return Math.round(basePrice * factor * noise);
};

export const useDynamicPricing = (intervalMs = 5000) => {
  const [dynamicHotels, setDynamicHotels] = useState<Hotel[]>(initialHotels);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updatePrices = useCallback(() => {
    setDynamicHotels((prev) =>
      prev.map((hotel) => {
        const newDemand = randomDemandShift();
        const newPrice = calculatePrice(hotel.basePrice, newDemand);
        const prevPrice = hotel.currentPrice;
        const trend: Hotel["priceTrend"] =
          newPrice > prevPrice ? "rising" : newPrice < prevPrice ? "dropping" : "stable";

        const newHistory = [
          ...hotel.priceHistory.slice(-6),
          { date: new Date().toISOString().split("T")[0], price: newPrice },
        ];

        return {
          ...hotel,
          currentPrice: newPrice,
          priceTrend: trend,
          demandLevel: newDemand,
          priceHistory: newHistory,
          rooms: hotel.rooms.map((room) => ({
            ...room,
            currentPrice: calculatePrice(room.basePrice, newDemand),
          })),
        };
      })
    );
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(updatePrices, intervalMs);
    return () => clearInterval(timer);
  }, [updatePrices, intervalMs]);

  return { hotels: dynamicHotels, lastUpdate, refreshPrices: updatePrices };
};
