import { Card, Skeleton } from '@heroui/react';

// Скелетон одного поста во время загрузки
export default function PostSkeleton() {
  return (
    <Card className="w-full gap-4 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32 rounded-lg" />
          <Skeleton className="h-2 w-20 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-2/3 rounded-lg" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </Card>
  );
}
