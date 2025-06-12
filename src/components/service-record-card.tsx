import type { ServiceRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, Gauge, Wrench, FileText, CircleDollarSign, Tag, Info } from 'lucide-react'; // Tag for category, Info for source type
import { Badge } from "@/components/ui/badge";

interface ServiceRecordCardProps {
  record: ServiceRecord;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount: string | number) {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'RUB' }).format(numAmount); // Assuming RUB, adjust if needed
}

export default function ServiceRecordCard({ record }: ServiceRecordCardProps) {
  const statusBadgeVariant = (status: ServiceRecord['status']) => {
    switch (status) {
      case 'confirmed': return 'default'; // default is primary based on theme
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };
  
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl">{record.service_type}</CardTitle>
          <Badge variant={statusBadgeVariant(record.status)} className="capitalize">{record.status}</Badge>
        </div>
        {record.car_name && <CardDescription className="font-body">For: {record.car_name}</CardDescription>}
      </CardHeader>
      <CardContent className="font-body space-y-3 text-sm">
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
          <span>Date: {formatDate(record.service_date)}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Gauge className="h-4 w-4 mr-2 text-primary" />
          <span>Mileage: {record.mileage.toLocaleString()} km</span>
        </div>
         <div className="flex items-center text-muted-foreground">
          <CircleDollarSign className="h-4 w-4 mr-2 text-primary" />
          <span>Cost: {formatCurrency(record.total_cost)}</span>
        </div>
        <div className="flex items-start text-muted-foreground">
          <FileText className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0" />
          <div>
            <span className="font-medium text-foreground">Details:</span>
            <p className="whitespace-pre-wrap">{record.details || 'No details provided.'}</p>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Info className="h-4 w-4 mr-2 text-primary" />
          <span>Source: <span className="capitalize">{record.source_type}</span></span>
        </div>
        {record.category_id && ( // Assuming you'll fetch category name if needed
            <div className="flex items-center text-muted-foreground">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                <span>Category ID: {record.category_id}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
