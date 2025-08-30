# Form Inquiry Rayhar - Svelte + Supabase

Project form inquiry untuk agensi pelancongan Rayhar yang dibangunkan menggunakan SvelteKit dan Supabase.

## 🚀 Fitur Utama

- **Form Inquiry Lengkap**: Form untuk mengumpul maklumat pelanggan
- **Dual Package Type**: Support untuk pakej Umrah dan Outbound
- **Dynamic Dropdowns**: Dropdown yang berubah berdasarkan pilihan sebelumnya
- **Real-time Validation**: Validasi form secara real-time
- **Responsive Design**: Design yang responsif untuk semua device
- **Database Integration**: Integrasi penuh dengan Supabase

## 🏗️ Struktur Database

### Tabel Utama

#### `branches` - Cawangan
- `id` (UUID, Primary Key)
- `name` (Text) - Nama cawangan
- `whatsapp_number` (Text) - Nombor WhatsApp
- `state` (Text) - Negeri
- `region` (Text) - Kawasan
- `created_at` (Timestamp)

#### `package_types` - Jenis Pakej
- `id` (UUID, Primary Key)
- `name` (Text) - Nama pakej
- `description` (Text) - Deskripsi pakej
- `created_at` (Timestamp)

#### `umrah_seasons` - Musim Umrah
- `id` (UUID, Primary Key)
- `name` (Text) - Nama musim
- `created_at` (Timestamp)

#### `umrah_categories` - Kategori Umrah
- `id` (UUID, Primary Key)
- `name` (Text) - Nama kategori
- `brochure` (Text) - Link brochure
- `created_at` (Timestamp)

#### `destinations` - Destinasi Pelancongan
- `id` (UUID, Primary Key)
- `name` (Text) - Nama destinasi
- `sales_consultant_id` (UUID, Foreign Key) - ID sales consultant
- `created_at` (Timestamp)

#### `outbound_dates` - Tarikh Pelancongan
- `id` (UUID, Primary Key)
- `destination_id` (UUID, Foreign Key) - ID destinasi
- `start_date` (Date) - Tarikh mula
- `end_date` (Date) - Tarikh tamat
- `price` (Text) - Harga
- `created_at` (Timestamp)

#### `leads` - Data Inquiry
- `id` (UUID, Primary Key)
- `title` (Text) - Gelaran
- `full_name` (Text) - Nama penuh
- `phone` (Text) - Nombor telefon
- `branch_id` (UUID, Foreign Key) - ID cawangan
- `package_type_id` (UUID, Foreign Key) - ID jenis pakej
- `season_id` (UUID, Foreign Key) - ID musim (untuk Umrah)
- `category_id` (UUID, Foreign Key) - ID kategori (untuk Umrah)
- `destination_id` (UUID, Foreign Key) - ID destinasi (untuk Outbound)
- `outbound_date_id` (UUID, Foreign Key) - ID tarikh (untuk Outbound)
- `category` (Text) - Jenis inquiry (umrah/outbound)
- `created_at` (Timestamp)

## 🛠️ Setup Project

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Supabase account

### Installation

1. **Clone project**
```bash
git clone <repository-url>
cd form-inquiry-rayhar
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Buat file `.env` di root directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Run development server**
```bash
npm run dev
```

## 📱 Cara Penggunaan

### 1. Pilih Pakej
- User memilih jenis pakej (Umrah atau Outbound)

### 2. Untuk Pakej Umrah
- Pilih Musim Umrah
- Pilih Kategori Umrah
- Link brochure akan ditampilkan jika tersedia

### 3. Untuk Pakej Outbound
- Pilih Destinasi Pelancongan
- Pilih Tarikh Pelancongan
- Informasi sales consultant akan ditampilkan

### 4. Submit Form
- Semua field wajib diisi
- Data akan disimpan ke tabel `leads`
- Pesan sukses akan ditampilkan

## 🔧 Konfigurasi Supabase

### 1. Buat Project Baru
- Buka [Supabase](https://supabase.com)
- Buat project baru
- Catat URL dan API keys

### 2. Setup Database
- Jalankan SQL scripts untuk membuat tabel
- Setup Row Level Security (RLS) jika diperlukan
- Setup foreign key constraints

### 3. Environment Variables
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🎨 Customization

### Styling
- Gunakan Tailwind CSS untuk styling
- Warna utama: `#942392` (Purple)
- Responsive breakpoints: `sm:`, `md:`, `lg:`

### Components
- `Dropdown.svelte` - Component dropdown yang dapat dikustomisasi
- Support untuk searchable dropdown
- Support untuk availability indicator

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy ke Vercel/Netlify
- Push code ke GitHub
- Connect repository ke Vercel/Netlify
- Setup environment variables di platform deployment

## 📊 Monitoring & Analytics

### Supabase Dashboard
- Monitor database performance
- View real-time logs
- Check API usage

### Error Handling
- Form validation errors
- Database connection errors
- User-friendly error messages

## 🔒 Security

### Row Level Security (RLS)
- Enable RLS untuk semua tabel
- Setup policies yang sesuai
- Restrict access berdasarkan role

### API Security
- Gunakan service role key hanya untuk server-side
- Anon key untuk client-side (jika diperlukan)
- Validate semua input user

## 📝 Changelog

### v1.0.0
- Initial release
- Basic form functionality
- Supabase integration
- Responsive design

## 🤝 Contributing

1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Support

Untuk support atau pertanyaan:
- Email: support@rayhar.com
- WhatsApp: +60 19-223 2290
- Website: https://rayhar.com

---

**Dibangunkan dengan ❤️ oleh Team Rayhar**
