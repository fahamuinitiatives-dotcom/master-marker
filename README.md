# IGCSE Marker

An advanced examiner-style marking and coaching tool for Cambridge IGCSE Economics (0455) and First Language English (0500).

## Setup Instructions
1. Run `npm install`
2. Copy `.env.example` to `.env.local` and add your required keys.
3. Start your local Supabase instance: `npx supabase start` (or link to a remote project).
4. Run the database migrations in `/supabase/migrations/`.
5. Start the Next.js dev server: `npm run dev`

## Adding Official 2027 Mark Schemes
As per the source limitations, official 2027 mark schemes do not exist yet. When they are released, convert them to JSON and drop them into the `/rubrics/economics-0455/` or `/rubrics/english-0500/` directories. The API dynamically loads any JSON rubric added here.

## Verified Questions
Upload verified past-paper questions through the Admin dashboard at `/admin`. Only users with `role = 'admin'` in the `profiles` table can access this route.

## Changing Theme Tokens
Colors, radii, and shadows are defined in `tailwind.config.ts` and `app/globals.css`. Adjust the `--accent-main` hex variables for Economics (Blue) and English (Purple).
