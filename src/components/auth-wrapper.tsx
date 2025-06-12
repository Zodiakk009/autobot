"use client";

import { useEffect, useState } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import type { AppUser } from '@/lib/types';
import MainAppLayout from './main-app-layout';
import LoadingSpinner from './loading-spinner';
import ErrorMessage from './error-message';
import { Button } from './ui/button';

export default function AuthWrapper() {
  const { initData, telegram_id, error, loading, isTelegram } = useTelegramInitData();

  const [authStatus, setAuthStatus] = useState<'pending' | 'authenticated' | 'error'>('pending');
  const [user, setUser] = useState<AppUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (initData && !error) {
      // Отправляем initData на backend
      fetch('https://n8n.intranetwh.ru/webhook/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Backend auth failed: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Auth result:', data);

          // Пример: если backend возвращает user data → сохраняем
          setUser({
            telegram_id: telegram_id!,
            username: data.username || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone_number: data.phone_number || '', // если ты добавляешь phone
          });

          setAuthStatus('authenticated');
        })
        .catch(err => {
          console.error('Auth error:', err);
          setAuthError(err.message || 'Unknown authentication error');
          setAuthStatus('error');
        });
    }
  }, [initData, error, telegram_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground font-headline">Authenticating...</p>
      </div>
    );
  }

  if (!isTelegram) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <ErrorMessage message="Telegram Environment Not Detected" />
        <p className="mt-2 text-muted-foreground font-body">
          Please open this Web App from Telegram.
        </p>
      </div>
    );
  }

  if (authStatus === 'error' || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <ErrorMessage message="Authentication Failed" details={authError || "Could not authenticate your session."} />
        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return <MainAppLayout user={user} />;
}
