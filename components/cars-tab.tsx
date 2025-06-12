"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Car, NewCar, AppUser } from '@/lib/types';
import { fetchCars, createCar, deleteCar } from '@/lib/api';
import VehicleCard from './vehicle-card';
import AddCarForm from './add-car-form';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './loading-spinner';
import ErrorMessage from './error-message';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CarsTabProps {
  user: AppUser;
}

export default function CarsTab({ user }: CarsTabProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const loadCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCars = await fetchCars(user.id);
      setCars(fetchedCars);
    } catch (e: any) {
      setError(e.message || "Failed to load cars.");
      toast({
        variant: "destructive",
        title: "Error loading cars",
        description: e.message || "Could not retrieve your vehicles.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user.id, toast]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const handleAddCar = async (carData: NewCar) => {
    try {
      await createCar(user.id, carData);
      toast({
        title: "Vehicle Added",
        description: `${carData.name} has been successfully added.`,
      });
      setIsAddCarModalOpen(false);
      loadCars(); // Refresh the list
    } catch (e: any) {
      setError(e.message || "Failed to add car.");
      toast({
        variant: "destructive",
        title: "Error adding car",
        description: e.message || "Could not add the vehicle.",
      });
    }
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCar(user.id, carToDelete.id);
      toast({
        title: "Vehicle Deleted",
        description: `${carToDelete.name} has been successfully deleted.`,
      });
      setCarToDelete(null);
      loadCars(); // Refresh the list
    } catch (e: any) {
      setError(e.message || "Failed to delete car.");
      toast({
        variant: "destructive",
        title: "Error deleting car",
        description: e.message || "Could not delete the vehicle.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size={36} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline font-semibold">Your Vehicles</h2>
        <Button onClick={() => setIsAddCarModalOpen(true)} className="transition-transform hover:scale-105">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Vehicle
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {cars.length === 0 && !isLoading && !error && (
        <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car-front mx-auto text-muted-foreground opacity-50"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.354a2 2 0 0 0-1.853 1.3L5 10l-2-2"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
          <p className="mt-4 text-lg font-semibold text-muted-foreground font-headline">No vehicles yet.</p>
          <p className="text-sm text-muted-foreground font-body">Add your first vehicle to start tracking its service history.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <VehicleCard key={car.id} car={car} onDelete={() => setCarToDelete(car)} isDeleting={isDeleting && carToDelete?.id === car.id} />
        ))}
      </div>

      <AddCarForm
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onSubmit={handleAddCar}
      />

      {carToDelete && (
        <AlertDialog open={!!carToDelete} onOpenChange={(open) => !open && setCarToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="font-body">
                This action cannot be undone. This will permanently delete the vehicle "{carToDelete.name}" and all its associated service records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCarToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCar} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {isDeleting ? <LoadingSpinner size={16}/> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
