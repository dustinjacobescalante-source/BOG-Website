# BOG Platform

Deployable Next.js + Supabase starter for Buffalo Dogs - BOG - Brotherhood of Growth.

## What is wired now
- Public pages for About, Code, Ranks, Scholarship, Merch, Contact
- Auth screens: sign in, sign up, reset password
- Protected member portal routes
- Protected admin routes
- Supabase SQL schema in `supabase/schema.sql`
- Live read queries on portal/admin pages
- Live public submissions for:
  - join requests
  - scholarship applications
  - merch order requests
- Visual assets in `public/assets`

## What is scaffolded but still needs completion
- File uploads to Supabase Storage for scholarship docs and member documents
- Rich discussion thread creation/replies UI
- Meeting creation/edit publishing forms
- Admin mutation forms for ranks, products, and documents
- Email notifications / invite flow

## Local setup
1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in values.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run locally:
   ```bash
   npm run dev
   ```

## Required environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Recommended next implementation steps
1. Add Supabase Storage buckets and upload flows.
2. Add admin forms for meetings, products, and documents.
3. Add discussion thread/post create forms.
4. Add invite-only member creation flow.
5. Add role-aware UI controls in portal/admin pages.
