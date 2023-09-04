import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center w-full h-full gap-4">
      <div className="flex flex-wrap w-full gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="flex-1 h-24" />
      </div>
      <div className="flex flex-wrap w-full gap-4">
        <Skeleton className="h-12 basis-1/3" />
        <Skeleton className="flex-1 h-12" />
        <Skeleton className="h-12 basis-1/2" />
        <Skeleton className="h-12 basis-1/5" />
        <Skeleton className="flex-1 h-12" />
        <Skeleton className="flex-1 h-12" />
        <Skeleton className="h-12 basis-full" />
        <Skeleton className="h-12 basis-1/4" />
        <Skeleton className="h-12 basis-1/3" />
        <Skeleton className="flex-1 h-12" />
      </div>
    </div>
  );
}
