"use client";

import { useState } from 'react';
import type { AppUser } from '@/lib/types';
import { TELEGRAM_BOT_NAME } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CarsTab from './cars-tab';
import ServiceRecordsTab from './service-records-tab';
import MyPartsTab from './my-parts-tab';
import { BookText, Package, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainAppLayoutProps {
  user: AppUser;
}

export default function MainAppLayout({ user }: MainAppLayoutProps) {
  const [activeTab, setActiveTab] = useState('journal');
  const [showVehicles, setShowVehicles] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-headline font-bold text-primary">
            🚗 {TELEGRAM_BOT_NAME}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm text-muted-foreground font-body flex items-center hover:text-primary transition-colors">
              <UserCircle className="h-5 w-5 mr-1.5 text-primary" />
              {user.username || user.first_name || `User ${user.id}`}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowVehicles(true)}>
                Vehicles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6 bg-card shadow-sm">
            <TabsTrigger value="journal" className="font-headline data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 py-2.5">
              <BookText className="mr-2 h-5 w-5" /> Journal
            </TabsTrigger>
            <TabsTrigger value="parts" className="font-headline data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 py-2.5">
              <Package className="mr-2 h-5 w-5" /> My Parts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="journal">
            <ServiceRecordsTab user={user} />
          </TabsContent>
          <TabsContent value="parts">
            <MyPartsTab user={user} />
          </TabsContent>
        </Tabs>
      </main>

      {showVehicles && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-card rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-headline font-semibold">Vehicles</h2>
                <button
                  onClick={() => setShowVehicles(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              <CarsTab user={user} />
            </div>
          </div>
        </div>
      )}

      <footer className="py-4 text-center text-xs text-muted-foreground font-body border-t border-border">
        © {new Date().getFullYear()} {TELEGRAM_BOT_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
