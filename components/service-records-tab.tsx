"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ServiceRecord, AppUser, Car } from '@/lib/types';
import { fetchServiceRecords, fetchCars } from '@/lib/api';
import ServiceRecordCard from './service-record-card';
import LoadingSpinner from './loading-spinner';
import ErrorMessage from './error-message';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ServiceRecordsTabProps {
  user: AppUser;
}

export default function ServiceRecordsTab({ user }: ServiceRecordsTabProps) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>(undefined); // Store as string for Select component
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadCarsAndRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCars = await fetchCars(user.id);
      setCars(fetchedCars);
      
      const fetchedRecords = await fetchServiceRecords(user.id, selectedCarId ? parseInt(selectedCarId) : undefined);
      // Optional: Map car names to records if backend doesn't do it
      const recordsWithCarNames = fetchedRecords.map(record => {
        const car = fetchedCars.find(c => c.id === record.car_id);
        return { ...record, car_name: car ? car.name : 'Unknown Vehicle' };
      });
      setRecords(recordsWithCarNames);

    } catch (e: any) {
      setError(e.message || "Failed to load service records.");
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: e.message || "Could not retrieve service records or vehicles.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user.id, selectedCarId, toast]);

  useEffect(() => {
    loadCarsAndRecords();
  }, [loadCarsAndRecords]);

  const handleCarFilterChange = (carId: string) => {
    setSelectedCarId(carId === "all" ? undefined : carId);
  };
  
  if (isLoading) {
    return <LoadingSpinner size={36} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-headline font-semibold">Service Journal</h2>
        {cars.length > 0 && (
          <Select onValueChange={handleCarFilterChange} defaultValue={selectedCarId || "all"}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card">
              <SelectValue placeholder="Filter by car" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {cars.map(car => (
                <SelectItem key={car.id} value={String(car.id)}>{car.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {records.length === 0 && !isLoading && !error && (
         <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-text mx-auto text-muted-foreground opacity-50"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M10 8h6"/><path d="M10 12h6"/></svg>
          <p className="mt-4 text-lg font-semibold text-muted-foreground font-headline">
            {selectedCarId && cars.find(c => String(c.id) === selectedCarId) 
              ? `No service records for ${cars.find(c => String(c.id) === selectedCarId)?.name}.` 
              : "No service records yet."}
          </p>
          <p className="text-sm text-muted-foreground font-body">
            {cars.length === 0 ? "Add a vehicle first to see its service history." : "Service history for your vehicles will appear here."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map((record) => (
          <ServiceRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
