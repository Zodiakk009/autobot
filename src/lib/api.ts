
import type { Car, ServiceRecord, NewCar, AppUser } from './types';

interface AuthResponse extends AppUser {
  // Potentially other fields from your auth endpoint
}

export async function authenticateTelegramUser(initData: string): Promise<AuthResponse> {
  const response = await fetch("https://n8n.intranetwh.ru/webhook/auth/telegram", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ initData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
    throw new Error(errorData.message || `Authentication failed with status: ${response.status}`);
  }
  return response.json();
}

export async function fetchUser(telegramId: number): Promise<AppUser> {
  const response = await fetch(`https://n8n.intranetwh.ru/webhook/users?telegram_id=${telegramId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

export async function fetchCars(telegramId: number): Promise<Car[]> {
  const response = await fetch(`https://n8n.intranetwh.ru/webhook/cars?telegram_id=${telegramId}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fetch cars error:", errorText);
    throw new Error('Failed to fetch cars');
  }
  return response.json();
}

export async function createCar(telegramId: number, carData: NewCar): Promise<Car> {
  const response = await fetch("https://n8n.intranetwh.ru/webhook/cars", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...carData, telegram_id: telegramId }),
  });
  if (!response.ok) {
     const errorData = await response.json().catch(() => ({ message: 'Failed to create car' }));
    throw new Error(errorData.message || `Failed to create car with status: ${response.status}`);
  }
  return response.json();
}

export async function deleteCar(telegramId: number, carId: number): Promise<void> {
  const response = await fetch(`https://n8n.intranetwh.ru/webhook/cars/${carId}?telegram_id=${telegramId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to delete car' }));
    throw new Error(errorData.message || `Failed to delete car with status: ${response.status}`);
  }
}

export async function fetchServiceRecords(telegramId: number, carId?: number): Promise<ServiceRecord[]> {
  let url = `https://n8n.intranetwh.ru/webhook/service-records?telegram_id=${telegramId}`;
  if (carId) {
    url += `&car_id=${carId}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch service records');
  }
  return response.json();
}
