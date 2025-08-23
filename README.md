# Form Inquiry Rayhar

Aplikasi form inquiry untuk Rayhar Travel menggunakan SvelteKit dan Supabase.

## Fitur

- Form inquiry untuk paket Umrah dan Pelancongan
- Validasi form yang lengkap
- Integrasi dengan database Supabase
- **Pesan sukses yang informatif setelah pengiriman form**
- **Tidak ada lagi direct link ke WhatsApp**
- **Form otomatis reset setelah pengiriman berhasil**

## Perubahan Terbaru

### ✅ Fitur Baru
- **Pesan Sukses**: Menampilkan pesan konfirmasi setelah form berhasil dikirim
- **Pesan Error**: Menampilkan pesan error jika ada masalah dengan pengiriman
- **Auto Reset Form**: Form otomatis dikosongkan setelah pengiriman berhasil
- **Enhanced UX**: User experience yang lebih baik tanpa redirect ke WhatsApp

### 🔄 Perubahan Sistem
- **Server Action**: Form submission sekarang menggunakan SvelteKit form actions
- **Database Only**: Data hanya disimpan ke database tanpa redirect eksternal
- **Real-time Feedback**: Feedback langsung ke user tanpa reload halaman

## Cara Penggunaan

1. User mengisi form inquiry
2. Klik tombol "HANTAR"
3. Data disimpan ke database
4. **Pesan sukses ditampilkan**
5. **Form otomatis dikosongkan**
6. User dapat mengisi form baru jika diperlukan

## Teknologi

- **Frontend**: SvelteKit 2.0
- **Backend**: Supabase (PostgreSQL)
- **Styling**: CSS Custom Properties
- **Form Handling**: SvelteKit Form Actions

## Struktur Database

- `branches` - Daftar cabang
- `package_types` - Jenis paket (Umrah/Pelancongan)
- `umrah_seasons` - Musim Umrah
- `umrah_categories` - Kategori Umrah
- `destinations` - Destinasi pelancongan
- `outbound_dates` - Tanggal pelancongan
- `sales_consultant` - Konsultan penjualan
- `leads` - Data inquiry yang masuk

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```
