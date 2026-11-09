# Shared student accounts with Supabase

The portal uses Supabase's free tier for shared authentication and student records. `localStorage` remains available only when Supabase environment variables are missing, so local demo accounts do not leak into production.

## 1. Create the free project

1. Open [supabase.com](https://supabase.com), create an account, and create a new project.
2. Open **SQL Editor**, create a new query, paste the contents of `supabase/schema.sql`, and run it.
3. Open **Project Settings → API** and copy the Project URL and the `anon` public key.

## 2. Create the admin account

In **Authentication → Users**, create a confirmed user with:

- Email: `admin@northbridge.edu`
- Password: choose a private admin password

The normal login page is used for this account. There is no separate admin login page. The admin email is recognized by the database security policy and can view/edit every student record.

## 3. Add environment variables

Create `.env.local` in the project root using `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Never add a Supabase `service_role` key to this project or to a browser-exposed environment variable.

## 4. Configure Vercel

In the Vercel project, open **Settings → Environment Variables** and add both variables for **Production**, **Preview**, and **Development**. Redeploy after saving them.

After deployment, students can sign up from any phone using the public Vercel URL. Their account and empty portal record will appear in the admin's **Student directory** on the next login/refresh.

If email confirmation is enabled in Supabase, students must click the confirmation link before their first login. This is recommended for a real deployment.
