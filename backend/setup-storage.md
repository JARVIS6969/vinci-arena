# SUPABASE STORAGE SETUP

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "Storage" in left sidebar
4. Click "Create a new bucket"
5. Name: "achievements"
6. Public bucket: YES (so images can be viewed)
7. Click "Create bucket"

8. Repeat for:
   - Bucket name: "profiles" (for avatars/banners)
   - Bucket name: "clips" (for gameplay clips thumbnails)

9. Make buckets public:
   - Click on bucket → Policies → New Policy
   - For SELECT: Allow public access
   - For INSERT: Authenticated users only
