import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 text-[#2f7ff2] animate-spin mb-4" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}