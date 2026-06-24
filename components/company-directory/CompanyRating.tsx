import { Star } from "lucide-react";
import type { CompanyRating as CompanyRatingData } from "@/lib/demoCompanies";

const sourceClasses: Record<CompanyRatingData["source"], string> = {
  Google: "bg-blue-50 text-blue-700",
  Trustpilot: "bg-emerald-50 text-emerald-700",
  Renbud: "bg-amber-50 text-amber-700",
};

export function CompanyRating({
  rating,
  compact = false,
}: {
  rating: CompanyRatingData;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl ${sourceClasses[rating.source]} ${
        compact ? "px-2.5 py-1.5" : "px-3 py-2"
      }`}
    >
      <Star
        size={compact ? 14 : 16}
        className="fill-current"
        aria-hidden="true"
      />
      <span className="font-bold">{rating.score.toFixed(1)}</span>
      <span className="text-[11px] font-semibold opacity-75">
        {rating.source} · {rating.reviews}
      </span>
    </div>
  );
}
