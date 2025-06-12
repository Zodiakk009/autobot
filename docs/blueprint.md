# **App Name**: АвтоБот Web

## Core Features:

- Telegram Auth: User authentication via Telegram initData to ensure secure access to user-specific data.
- Vehicle List: Display a list of vehicles associated with the user's telegram_id, fetched from the /cars endpoint.
- Vehicle Creation: Form to create new vehicle with fields for name, VIN, license plate, and year.  Data will be saved to /cars endpoint.
- Service Record Display: Display a list of service records for all cars or a selected car for the user, pulled from the /service-records endpoint.
- Vehicle Deletion: Option to remove existing vehicles.
- AI Assistant: An AI-powered assistant that responds to user queries using generative AI in Telegram chats and that uses tool to create records in PostgreSQL through backend API
- Telegram WebApp Button: Display WebApp button 'Открыть Автобот 🚗' in Telegram chat for quick access

## Style Guidelines:

- Primary color: Soft grey-blue (#D3E2EF) to evoke a sense of calmness and reliability.
- Background color: Very light grey (#F5F5F5) to maintain a clean, minimalistic appearance.
- Accent color: Dark red (#BF0010) for interactive elements, in line with design requirements.
- Headline font: 'Inter', sans-serif, for a modern and readable interface.
- Body font: 'PT Sans', sans-serif, to ensure comfortable reading across different screen sizes.
- Simple, monochrome icons for easy recognition and a unified look.
- Mobile-first approach with a responsive layout that adapts to different screen sizes. Ensure all elements are easily accessible and user-friendly on smaller screens.
- Subtle, smooth transitions and animations to enhance user experience without being distracting.