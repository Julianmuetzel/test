import { cn, getPercentileColor, getPercentileLabel } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillCardProps {
  name: string;
  icon: string;
  score: number;
  unit: string;
  percentile?: number | null;
  color: string;
}

export function SkillCard({ name, icon, score, unit, percentile, color }: SkillCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:border-white/20 transition-all">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle at top left, ${color}10, transparent 70%)` }}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-2xl">{icon}</div>
          {percentile != null && (
            <Badge variant={percentile >= 75 ? "purple" : percentile >= 50 ? "default" : "secondary"}>
              {getPercentileLabel(percentile)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-1">{name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">
            {score.toLocaleString("de-DE")}
          </span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
        {percentile != null && (
          <p className={cn("text-xs mt-2 font-medium", getPercentileColor(percentile))}>
            Besser als {percentile}% aller Nutzer
          </p>
        )}
      </CardContent>
    </Card>
  );
}
