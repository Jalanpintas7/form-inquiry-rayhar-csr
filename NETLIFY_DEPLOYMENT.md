# Panduan Deploy ke Netlify

## Masalah yang Diperbaiki
Error "Failed to fetch form data" terjadi karena menggunakan `@sveltejs/adapter-static` yang tidak mendukung server-side API routes.

## Solusi yang Diterapkan

### 1. Mengganti Adapter
- **Sebelum**: `@sveltejs/adapter-static` (hanya untuk static sites)
- **Sesudah**: `@sveltejs/adapter-netlify` (mendukung serverless functions)

### 2. File yang Diubah
- `svelte.config.js` - Mengganti adapter ke Netlify
- `netlify.toml` - Konfigurasi build dan redirects
- `package.json` - Menambahkan dependency `@sveltejs/adapter-netlify`

## Langkah Deploy ke Netlify

### 1. Setup Environment Variables di Netlify
Di dashboard Netlify, pergi ke:
- Site settings → Environment variables
- Tambahkan variabel berikut:
  ```
  SUPABASE_URL=https://your-project-id.supabase.co
  SUPABASE_ANON_KEY=your_anon_key_here
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
  ```

### 2. Deploy
- Push kode ke repository Git
- Connect repository ke Netlify
- Netlify akan otomatis build menggunakan konfigurasi yang sudah diperbaiki

### 3. Verifikasi
- API endpoint `/api/form-data` sekarang akan berfungsi
- Form dapat memuat data dari Supabase
- Tidak ada lagi error "Failed to fetch form data"

## Catatan Penting
- Pastikan environment variables sudah di-set dengan benar di Netlify
- Service role key diperlukan untuk akses admin ke Supabase
- Build command: `npm run build`
- Publish directory: `build`
