// Telegram User object from initDataUnsafe, can be expanded
export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

// User data returned from /auth/telegram or /users
export interface AppUser extends TelegramUser {
  // Potentially other app-specific user fields
}

export interface Car {
  id: number;
  telegram_id: number;
  name: string;
  vin: string;
  license_plate: string;
  year: number;
  created_at: string;
}

export interface ServiceRecord {
  id: number;
  car_id: number;
  service_date: string; // ISO Date string
  mileage: number;
  service_type: string;
  details: string;
  total_cost: string; // Represented as string, can be parsed to number
  source_type: 'manual' | 'photo' | 'other';
  status: 'pending' | 'confirmed' | 'rejected';
  category_id?: number | null;
  created_at: string; // ISO DateTime string
  // Optional: car_name if joined by backend
  car_name?: string; 
}

// For POSTing new car
export type NewCar = Omit<Car, 'id' | 'telegram_id' | 'created_at'>;
