<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/92c25093-8e81-4566-83ac-dcba91e3f61d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Deployment produksi: Vercel + Google Sheets

Untuk persistensi lintas browser/perangkat, Google Sheets adalah database bersama. localStorage hanya dipakai sebagai cache offline.

1. Pastikan kode template pada menu Koneksi Google Sheet sudah ditempel ke Apps Script.
2. Deploy ulang sebagai Web App, jalankan sebagai akun pemilik Sheet, dan izinkan akses Anyone/Siapa saja.
3. Di Vercel, tambahkan environment variable:
   - VITE_GOOGLE_SHEET_URL = URL Web App Apps Script yang berakhiran /exec
4. Redeploy Vercel.
5. Buka aplikasi, uji koneksi, lalu gunakan Unggah Katalog Siswa ke Google Sheet sekali untuk memastikan data lama dan konfigurasi profil tersimpan di tab Config.

Jangan mengandalkan app_settings.json atau app_database.json sebagai database produksi di Vercel karena filesystem serverless tidak persisten. File public/runtime-config.json disediakan sebagai bootstrap cadangan agar browser baru tetap mengetahui URL Sheet.
