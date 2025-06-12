"use client";

import type { Car } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CalendarDays, KeyRound, Hash } from 'lucide-react'; // Hash for license plate, KeyRound for VIN

interface VehicleCardProps {
  car: Car;
  onDelete: (carId: number) => void;
  isDeleting: boolean;
}

export default function VehicleCard({ car, onDelete, isDeleting }: VehicleCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl">{car.name}</CardTitle>
            <CardDescription className="font-body">VIN: {car.vin}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(car.id)}
            disabled={isDeleting}
            aria-label="Delete car"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="font-body space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <KeyRound className="h-4 w-4 mr-2 text-primary" />
          <span>VIN: {car.vin}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Hash className="h-4 w-4 mr-2 text-primary" />
          <span>License Plate: {car.license_plate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
          <span>Year: {car.year}</span>
        </div>
      </CardContent>
    </Card>
  );
}
