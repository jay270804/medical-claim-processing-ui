'use client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function Error({ error }: { error: Error }) {
  return (
    <Alert variant="destructive" className="mt-8">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </AlertDescription>
    </Alert>
  );
}