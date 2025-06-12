import { config } from 'dotenv';
config();

import '@/ai/flows/create-service-record-from-photo.ts';
import '@/ai/flows/generate-service-record-summary.ts';
import '@/ai/flows/suggest-maintenance.ts';