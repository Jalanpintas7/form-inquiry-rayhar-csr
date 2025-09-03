# Migrasi dari SSR ke CSR - Form Inquiry Rayhar

## Ringkasan Perubahan

Project ini telah berhasil dimigrasikan dari **Server-Side Rendering (SSR)** ke **Client-Side Rendering (CSR)** menggunakan Vite sebagai build tool.

## Perubahan yang Dilakukan

### 1. Konfigurasi Project

#### `svelte.config.js`
- **Sebelum**: Menggunakan `@sveltejs/adapter-auto`
- **Sesudah**: Menggunakan `@sveltejs/adapter-static` untuk CSR
- **Konfigurasi**: 
  - `pages: 'build'`
  - `assets: 'build'`
  - `fallback: 'index.html'`
  - `precompress: false`
  - `strict: true`

#### `vite.config.js`
- **Ditambahkan**: Konfigurasi build untuk CSR
- **Ditambahkan**: Server configuration dengan port 3000
- **Ditambahkan**: Rollup options untuk manual chunks

#### `package.json`
- **Diubah**: `@sveltejs/adapter-auto` → `@sveltejs/adapter-static@^3.0.9`
- **Scripts**: Tetap sama (dev, build, preview)

### 2. Struktur File

#### File yang Dihapus:
- `src/routes/+page.server.js` - Server-side logic
- `src/lib/server/supabase.js` - Server-side Supabase client

#### File yang Ditambahkan:
- `src/lib/services/api.js` - Client-side API functions
- `MIGRASI_SSR_KE_CSR.md` - Dokumentasi ini

#### File yang Dimodifikasi:
- `src/routes/+page.svelte` - Client-side data fetching
- `src/app.html` - Updated untuk CSR
- `env.example` - Updated untuk client-side environment variables

### 3. Perubahan Kode

#### Data Fetching
- **Sebelum**: Server-side data loading di `+page.server.js`
- **Sesudah**: Client-side data loading menggunakan `onMount()` dan `loadInitialData()`

#### Form Submission
- **Sebelum**: Server-side form handling dengan `enhance` dari SvelteKit
- **Sesudah**: Client-side form handling dengan `handleSubmit()` function

#### State Management
- **Ditambahkan**: Loading states dan error handling
- **Ditambahkan**: Client-side form validation
- **Ditambahkan**: Real-time form feedback

### 4. Environment Variables

#### `env.example`
- **Sebelum**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Sesudah**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Catatan**: Hanya anon key yang diperlukan untuk CSR

## Keuntungan CSR

1. **Performance**: 
   - Faster initial page load setelah JavaScript dimuat
   - Better caching di browser
   - Reduced server load

2. **Scalability**:
   - Static file hosting (CDN friendly)
   - No server-side processing required
   - Better for high traffic

3. **Development**:
   - Simpler deployment
   - Better development experience dengan Vite
   - Hot Module Replacement (HMR)

## Cara Menjalankan

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment

Project ini sekarang menghasilkan static files di folder `build/` yang dapat di-deploy ke:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- CDN lainnya

## Environment Setup

1. Copy `env.example` ke `.env`
2. Isi dengan Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Catatan Penting

1. **SEO**: CSR mungkin mempengaruhi SEO. Pertimbangkan menggunakan SSG jika SEO sangat penting.

2. **Security**: Semua API calls sekarang dilakukan dari client-side. Pastikan RLS (Row Level Security) di Supabase sudah dikonfigurasi dengan benar.

3. **Performance**: Initial load mungkin lebih lambat karena JavaScript harus dimuat terlebih dahulu.

4. **Browser Support**: Pastikan target browser mendukung ES modules dan modern JavaScript features.

## Troubleshooting

### Build Errors
- Pastikan semua environment variables sudah diisi
- Cek versi Node.js (minimal 18.0.0)
- Hapus `node_modules` dan `package-lock.json`, lalu `npm install` ulang

### Runtime Errors
- Cek browser console untuk error messages
- Pastikan Supabase credentials benar
- Cek network tab untuk API call failures

## Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository atau hubungi tim development.
