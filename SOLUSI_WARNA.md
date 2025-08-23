# Solusi Masalah Warna Primary #942392

## Masalah yang Ditemukan

Ketika aplikasi di-deploy, warna primary berubah dari `#942392` (warna yang diinginkan) menjadi warna default Tailwind CSS (`#9333ea`). Ini terjadi karena:

1. **Konflik CSS Variables**: Ada konflik antara CSS variables yang didefinisikan di `app.html` dan `+layout.svelte`
2. **Tailwind CSS v4**: Proyek menggunakan Tailwind CSS v4 yang memiliki sistem CSS variables yang berbeda
3. **Urutan Loading**: Saat production, urutan loading CSS mungkin berbeda dengan development mode

## Solusi yang Diterapkan

### 1. Menghapus CSS Variables Konflik dari `app.html`
- Dihapus semua CSS variables yang konflik
- Hanya menyisakan favicon dan meta tags

### 2. Membuat File CSS Global (`src/lib/app.css`)
- Mendefinisikan semua warna Rayhar dengan prefix `--rayhar-`
- Override Tailwind CSS variables jika ada
- Memastikan warna konsisten di semua komponen

### 3. Menggunakan Nama Variabel yang Spesifik
- `--rayhar-primary-600: #942392` (warna utama)
- `--rayhar-primary-700: #942392`
- `--rayhar-primary-800: #942392`
- Dan variabel lainnya dengan prefix yang sama

### 4. Update Semua Komponen
- `+layout.svelte`: Header, footer, dan layout utama
- `+page.svelte`: Form dan styling halaman utama
- `Dropdown.svelte`: Komponen dropdown

## Struktur Warna yang Digunakan

```css
:root {
  /* Primary Colors - Warna Utama Rayhar */
  --rayhar-primary-600: #942392; /* Warna utama yang diinginkan */
  --rayhar-primary-700: #942392;
  --rayhar-primary-800: #942392;
  
  /* Utility Colors */
  --rayhar-ring: 0 0 0 4px rgba(148, 35, 146, 0.18);
  --rayhar-card-bg: #ffffff;
  --rayhar-border: #e5e7eb;
  
  /* Background Colors */
  --rayhar-bg-primary: #f7f7fb;
  --rayhar-bg-secondary: #fafafa;
  
  /* Text Colors */
  --rayhar-text-primary: #1f2937;
  --rayhar-text-secondary: #6b7280;
}
```

## Keuntungan Solusi Ini

1. **Konsistensi**: Warna akan sama di development dan production
2. **Tidak Ada Konflik**: Menggunakan prefix yang spesifik menghindari konflik dengan Tailwind
3. **Maintainable**: Semua warna terpusat di satu file
4. **Scalable**: Mudah menambah atau mengubah warna di masa depan

## Cara Penggunaan

1. **Untuk warna primary**: Gunakan `var(--rayhar-primary-600)`
2. **Untuk background**: Gunakan `var(--rayhar-bg-primary)`
3. **Untuk border**: Gunakan `var(--rayhar-border)`
4. **Untuk text**: Gunakan `var(--rayhar-text-primary)`

## Testing

Setelah deploy, pastikan:
- Header menggunakan warna `#942392`
- Button menggunakan gradient dari `#942392`
- Focus state menggunakan warna yang sama
- Semua komponen konsisten menggunakan warna Rayhar

## Catatan Penting

- Jangan gunakan CSS variables Tailwind default untuk warna primary
- Selalu gunakan prefix `--rayhar-` untuk warna custom
- Import `$lib/app.css` di `+layout.svelte` untuk memastikan CSS variables tersedia global 