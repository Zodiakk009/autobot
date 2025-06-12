import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
}
