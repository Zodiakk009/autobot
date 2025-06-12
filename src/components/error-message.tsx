import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  details?: string;
}

export default function ErrorMessage({ message, details }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md my-4" role="alert">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p className="font-semibold">{message}</p>
      </div>
      {details && <p className="text-sm mt-1">{details}</p>}
    </div>
  );
}
