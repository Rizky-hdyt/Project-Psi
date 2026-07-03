import { MapPinOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRetry?: () => void;
}

export function EmptyState({ onRetry }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white">
        <MapPinOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-semibold text-ink">Data sedang diperbarui</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Data semua wilayah sedang diperbarui, silakan coba lagi nanti.
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 border-line"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
