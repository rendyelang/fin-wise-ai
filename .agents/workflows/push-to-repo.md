---
description: Push changes to the GitHub repository with proper checks and commit messages
---

# Push to GitHub Repository

Workflow untuk push perubahan kode ke repository GitHub. Ikuti setiap langkah secara berurutan.

---

## Step 1: Cek Status Repository

Jalankan `git status` untuk melihat file apa saja yang berubah sebelum melakukan staging.

```
git status
```

- Periksa output-nya:
  - **Untracked files** → file baru yang belum di-track oleh git
  - **Modified files** → file yang sudah diubah
  - **Deleted files** → file yang dihapus
  - **Staged files** → file yang sudah siap di-commit
- Jika **tidak ada perubahan** (working tree clean), hentikan workflow dan informasikan ke user bahwa tidak ada yang perlu di-push.
- **Tanyakan ke user** apakah semua perubahan yang terdeteksi sudah sesuai dan siap untuk di-push, atau ada file yang ingin dikecualikan.

---

## Step 2: Stage Perubahan (Git Add)

Setelah user mengkonfirmasi file yang akan di-push, lakukan staging:

- Jika **semua file** ingin di-stage:
  ```
  git add .
  ```
- Jika **file tertentu saja** yang ingin di-stage (sesuai instruksi user):
  ```
  git add <file1> <file2> ...
  ```

> **Catatan:** Jangan pernah otomatis `git add .` tanpa konfirmasi dari user terlebih dahulu di Step 1.

---

## Step 3: Verifikasi Branch Aktif

Cek branch yang sedang aktif untuk memastikan push dilakukan ke branch yang benar.

```
git branch --show-current
```

- **Tanyakan ke user** apakah branch saat ini sudah benar sebagai target push.
- Jika user ingin pindah branch, jalankan:
  ```
  git checkout <nama-branch>
  ```
- Jika branch belum ada dan user ingin membuat branch baru:
  ```
  git checkout -b <nama-branch-baru>
  ```
- **Jangan lanjut ke step berikutnya** sampai user mengkonfirmasi branch sudah benar.

---

## Step 4: Buat Commit dengan Pesan yang Sesuai

Buat pesan commit yang deskriptif mengikuti format **Conventional Commits**:

### Format Commit Message

```
<type>(<scope>): <subject>

<body> (opsional)
```

### Tipe Commit yang Tersedia

| Type       | Deskripsi                                           |
| ---------- | --------------------------------------------------- |
| `feat`     | Menambahkan fitur baru                              |
| `fix`      | Memperbaiki bug                                     |
| `docs`     | Perubahan dokumentasi saja                          |
| `style`    | Perubahan formatting, semicolons, dll (bukan logic) |
| `refactor` | Refactoring kode tanpa mengubah fungsionalitas      |
| `perf`     | Perubahan yang meningkatkan performa                |
| `test`     | Menambah atau memperbaiki test                      |
| `chore`    | Perubahan build process, tools, dependencies, dll   |
| `ci`       | Perubahan konfigurasi CI/CD                         |
| `revert`   | Membatalkan commit sebelumnya                       |

### Aturan Commit Message

1. **Subject** harus singkat dan jelas (maksimal 72 karakter)
2. **Gunakan imperative mood** → "add feature" bukan "added feature"
3. **Huruf kecil** untuk subject, jangan diawali huruf kapital
4. **Jangan akhiri subject dengan titik**
5. **Scope** bersifat opsional, menunjukkan area kode yang berubah (contoh: `dashboard`, `navbar`, `auth`)
6. **Body** opsional, gunakan jika perlu penjelasan tambahan

### Contoh Commit Message

```
feat(dashboard): add hero section with animated charts
fix(navbar): resolve responsive layout issue on mobile
style(components): adjust spacing and padding on card elements
refactor(auth): simplify login flow logic
chore: update dependencies to latest versions
```

### Cara Menentukan Commit Message

- Analisis file yang di-stage dari Step 2
- Tentukan **type** berdasarkan jenis perubahan
- Tentukan **scope** berdasarkan area/folder/komponen yang berubah
- Tulis **subject** yang menjelaskan "apa yang dilakukan" secara singkat
- **Tanyakan ke user** apakah commit message sudah sesuai sebelum melakukan commit

### Eksekusi Commit

// turbo

```
git commit -m "<type>(<scope>): <subject>"
```

Jika perlu body:

```
git commit -m "<type>(<scope>): <subject>" -m "<body>"
```

---

## Step 5: Push ke GitHub

Setelah commit berhasil, push ke remote repository:

// turbo

```
git push origin <nama-branch>
```

- Jika branch baru dan belum ada di remote:
  ```
  git push -u origin <nama-branch>
  ```
- Jika push ditolak karena ada perubahan di remote:
  ```
  git pull --rebase origin <nama-branch>
  ```
  Lalu ulangi push setelah rebase berhasil.
- Jika ada **merge conflict** setelah rebase, informasikan ke user dan bantu resolve conflict tersebut sebelum melanjutkan push.

---

## Ringkasan Flow

```
git status          → Cek perubahan, tanyakan konfirmasi ke user
git add             → Stage file sesuai konfirmasi user
git branch          → Verifikasi branch, tanyakan konfirmasi ke user
git commit          → Buat pesan commit (Conventional Commits), tanyakan konfirmasi
git push            → Push ke remote repository
```

> **Prinsip Utama:** Selalu tanyakan konfirmasi user di setiap langkah kritis (staging, branch, dan commit message) sebelum melanjutkan ke langkah berikutnya.
