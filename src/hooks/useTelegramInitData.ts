import { useState, useEffect } from 'react';

export type TelegramInitDataState = {
  initData: string | null;
  telegram_id: number | null;
  error: string | null;
  loading: boolean;
  isTelegram: boolean;
};

export function useTelegramInitData(): TelegramInitDataState {
  const [initData, setInitData] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTelegram, setIsTelegram] = useState<boolean>(false);

  useEffect(() => {
    const tryGetInitData = (retryCount = 0) => {
      try {
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
          setIsTelegram(true);

          const WebApp = window.Telegram.WebApp;

          // Notify Telegram that Web App is ready
          WebApp.ready();

          // Read initData
          const data = WebApp.initData;
          console.log('Telegram.initData:', data);

          if (data && data.length > 0) {
            setInitData(data);

            // Try to parse telegram_id from initData.user
            try {
              const params = new URLSearchParams(data);
              const userParam = params.get('user');

              if (userParam) {
                const userObj = JSON.parse(userParam);
                if (userObj.id) {
                  setTelegramId(userObj.id);
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse telegram_id from initData:', parseError);
            }

            setLoading(false);
          } else {
            if (retryCount < 3) {
              console.log(`Retrying initData fetch... attempt ${retryCount + 1}`);
              setTimeout(() => tryGetInitData(retryCount + 1), 500);
            } else {
              setError('Failed to get Telegram initData after multiple attempts.');
              setLoading(false);
            }
          }
        } else {
          // Not in Telegram
          setIsTelegram(false);
          setError('Telegram WebApp not detected. Please open this app from Telegram.');
          setLoading(false);
        }
      } catch (e: any) {
        console.error('Error while fetching Telegram initData:', e);
        setError(e.message || 'Unknown error while fetching initData');
        setLoading(false);
      }
    };

    tryGetInitData();
  }, []);

  return {
    initData,
    telegram_id: telegramId,
    error,
    loading,
    isTelegram,
  };
}
