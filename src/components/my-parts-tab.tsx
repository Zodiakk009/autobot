"use client";

import { AppUser } from '@/lib/types';

interface MyPartsTabProps {
  user: AppUser;
}

export default function MyPartsTab({ user }: MyPartsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline font-semibold">My Parts</h2>
      </div>
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-muted-foreground font-headline">
          Coming soon...
        </p>
      </div>
    </div>
  );
} 