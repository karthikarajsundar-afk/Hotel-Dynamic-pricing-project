const PriceSparkline = ({ data }: { data: { date: string; price: number }[] }) => {
  if (!data || data.length < 2) return null;

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const width = 120;
  const height = 30;
  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  });

  const isDown = prices[prices.length - 1] < prices[0];

  return (
    <div className="flex items-center gap-2">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isDown ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
          strokeWidth="2"
          points={points.join(" ")}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[10px] text-muted-foreground">7d trend</span>
    </div>
  );
};

export default PriceSparkline;
