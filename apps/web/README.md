# Clendr Web App

The web version of Clendr, the lightning-fast AI-powered calendar app.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
4. Update the `.env.local` file with your Supabase credentials
5. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Project Structure

- `src/app`: Next.js App Router pages and layouts
- `src/components`: Reusable UI components
- `src/lib`: Utility libraries and configurations
- `src/styles`: Global styles and Tailwind configuration
- `src/utils`: Helper functions and utilities

## Database Schema

The application uses Supabase with the following main tables:

- `calendars`: User calendars
- `events`: Calendar events
- `tasks`: User tasks
- `profiles`: User profiles and preferences

## Deployment

The web app can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy

## Self-Hosting Supabase

For self-hosting Supabase, follow these steps:

1. Set up a PostgreSQL database
2. Install and configure Supabase locally or on your server
3. Update the `.env.local` file with your self-hosted Supabase URL and anon key

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request 