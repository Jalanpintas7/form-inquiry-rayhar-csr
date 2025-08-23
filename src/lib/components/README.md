# Komponen Dropdown

Komponen dropdown custom yang menampilkan dropdown ke bawah dengan jarak yang tepat dari border kanan.

## Fitur

- ✅ Dropdown menampilkan ke bawah
- ✅ Jarak yang tepat dari border kanan (12px)
- ✅ Icon yang berputar saat dropdown terbuka
- ✅ Support untuk required dan disabled
- ✅ Responsive design
- ✅ Custom scrollbar
- ✅ Hover effects
- ✅ Focus states
- ✅ Click outside untuk menutup dropdown

## Penggunaan

```svelte
<script>
  import Dropdown from '$lib/components/Dropdown.svelte';
  
  let selectedValue = '';
  
  const options = [
    { value: 'option1', label: 'Pilihan Pertama' },
    { value: 'option2', label: 'Pilihan Kedua' },
    { value: 'option3', label: 'Pilihan Ketiga' }
  ];
</script>

<Dropdown 
  options={options}
  placeholder="Pilih opsi"
  bind:value={selectedValue}
  name="fieldName"
  required={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array` | `[]` | Array of options dengan format `{value, label}` |
| `placeholder` | `String` | `'Pilih opsi'` | Text placeholder saat tidak ada pilihan |
| `value` | `String` | `''` | Nilai yang dipilih |
| `name` | `String` | `''` | Nama field untuk form submission |
| `required` | `Boolean` | `false` | Apakah field wajib diisi |
| `disabled` | `Boolean` | `false` | Apakah dropdown dinonaktifkan |

## Events

| Event | Data | Description |
|-------|------|-------------|
| `change` | `{value, option}` | Dipanggil saat opsi dipilih |

## Styling

Komponen menggunakan CSS variables untuk konsistensi:

```css
:root {
  --primary-50: #f3e8ff;
  --primary-600: #9333ea;
  --primary-700: #7c3aed;
  --border: #d1d5db;
  --ring: 0 0 0 3px rgba(147, 51, 234, 0.1);
}
```

## Responsive

- **Desktop**: Dropdown memiliki jarak 12px dari border kanan dan kiri
- **Mobile**: Dropdown memiliki jarak 12px dari border kanan dan 8px dari border kiri

## Demo

Lihat file `src/routes/dropdown-demo.svelte` untuk contoh penggunaan lengkap. 