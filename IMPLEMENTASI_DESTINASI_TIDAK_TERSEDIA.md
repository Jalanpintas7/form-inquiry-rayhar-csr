# Implementasi Fitur Destinasi Tidak Tersedia

## Deskripsi
Fitur ini menampilkan destinasi pelancongan yang tidak memiliki tarikh dengan styling yang berbeda (warna abu-abu) dan teks "(tidak tersedia)" pada dropdown pelancongan.

## Perubahan yang Dibuat

### 1. File: `src/routes/+page.svelte`
- **Baris 32-37**: Memodifikasi `destinationOptions` untuk menambahkan properti:
  - `isAvailable`: boolean yang menunjukkan apakah destinasi memiliki tarikh
  - `displayLabel`: label yang akan ditampilkan (dengan "(tidak tersedia)" jika tidak tersedia)

- **Baris 235**: Menambahkan prop `showAvailability={true}` pada dropdown pelancongan

### 2. File: `src/lib/components/Dropdown.svelte`
- **Baris 8**: Menambahkan prop `showAvailability` untuk mengaktifkan fitur ketersediaan
- **Baris 48-51**: Menambahkan logika untuk mencegah pemilihan opsi yang tidak tersedia
- **Baris 165-175**: Memodifikasi dropdown menu untuk menampilkan styling yang berbeda
- **Baris 185-195**: Memodifikasi non-searchable dropdown menu
- **Baris 340-348**: Menambahkan CSS untuk styling opsi yang tidak tersedia

## Fitur yang Ditambahkan

1. **Destinasi Tidak Tersedia**: Destinasi seperti Australia, China, Eropah, Europe, Japan, Jepun, Makkah & Madinah, Singapura, dan Turki akan ditampilkan dengan:
   - Warna abu-abu (`#9ca3af`)
   - Teks "(tidak tersedia)" di belakang nama destinasi
   - Cursor `not-allowed`
   - Tidak bisa dipilih

2. **Destinasi Tersedia**: Destinasi yang memiliki tarikh akan ditampilkan normal dan bisa dipilih

## Cara Kerja

1. Ketika dropdown pelancongan dibuka, sistem akan mengecek setiap destinasi
2. Destinasi yang tidak memiliki tarikh (`dates.length === 0`) akan ditandai sebagai `isAvailable: false`
3. Label destinasi akan diubah menjadi `"Nama Destinasi (tidak tersedia)"`
4. CSS akan memberikan styling khusus untuk opsi yang tidak tersedia
5. User tidak bisa memilih destinasi yang tidak tersedia

## Testing

Fitur ini sudah diimplementasikan dan siap digunakan. Destinasi yang tidak tersedia akan otomatis ditampilkan dengan styling yang berbeda dan tidak bisa dipilih oleh user.
