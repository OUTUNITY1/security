# SecureX — Cybersecurity Platform 2026

Website demo cho công ty bảo mật mạng (Cybersecurity) với giao diện hiện đại năm 2026 + **Firebase Auth & Realtime Database**.

## Cấu trúc

```
security-site/
├── index.html              # Trang khách hàng (Landing page)
├── login.html              # Đăng nhập Admin (chỉ lga775385@gmail.com)
├── client-register.html    # Đăng ký Client (tự do)
├── client-login.html       # Đăng nhập Client
├── client-dashboard.html   # Dashboard Client (xem data từ DB)
├── css/
│   └── style.css
├── js/
│   ├── firebase-config.js  # Firebase init + helpers
│   ├── main.js             # JS trang khách + lưu contact form
│   └── admin.js            # JS admin + auth protection
└── admin/
    ├── dashboard.html
    ├── threats.html
    ├── tickets.html
    ├── clients.html        # Load clients từ Firebase (nếu rules cho phép)
    ├── reports.html
    ├── assets.html
    ├── settings.html
    └── team.html
```

## Firebase

**Project:** `findhome777`  
**Realtime Database:** `https://findhome777-default-rtdb.firebaseio.com`

### Auth
- **Admin:** Chỉ email `lga775385@gmail.com` được phép đăng nhập trang Admin.
- **Client:** Đăng ký / đăng nhập tự do qua `client-register.html` / `client-login.html`.

### Cấu trúc dữ liệu lưu trong Realtime DB

```
/users/{uid}
  - uid, email, displayName, role ("admin" | "client")
  - country, phone, industry, package
  - healthScore, threats30d, openTickets, status
  - metrics: { uptime, threatsBlocked, incidentsResolved, avgResponseMs }
  - createdAt, lastLogin

/leads/{pushId}          # từ form liên hệ trên trang chủ
  - name, email, phone, country, service, industry, message
  - createdAt, status, source
```

### Security Rules khuyến nghị (cập nhật trong Firebase Console)

```json
{
  "rules": {
    "users": {
      "$user_id": {
        ".read": "$user_id === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$user_id === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "leads": {
      ".write": true,
      ".read": "auth != null"
    }
  }
}
```

> Rules gốc bạn cung cấp chỉ cho user đọc/ghi chính mình. Để Admin xem danh sách clients và form liên hệ hoạt động, hãy mở rộng như trên.

## Cách chạy

1. Mở `index.html` bằng Live Server hoặc bất kỳ static server nào.
2. Tạo tài khoản Admin trước trong Firebase Console (Authentication → Users) với email `lga775385@gmail.com` và mật khẩu bạn chọn.
3. Client đăng ký trực tiếp trên trang web.

## Đăng nhập

| Vai trò | URL | Email |
|---------|-----|-------|
| **Admin** | `login.html` | **chỉ** `lga775385@gmail.com` |
| **Client** | `client-login.html` / `client-register.html` | bất kỳ (tự do) |

## Tính năng đã tích hợp Firebase

- Đăng nhập / Đăng ký Email + Password
- Chỉ Admin email được vào `/admin/*`
- Client lưu profile + quốc gia + metrics vào `/users/{uid}`
- Form liên hệ lưu vào `/leads`
- Client Dashboard đọc dữ liệu thật từ DB
- Admin Clients page cố gắng load danh sách clients thật (cần rules)

## Tech Stack

- HTML5 + CSS3 (Glassmorphism, Dark theme)
- Vanilla JS
- Firebase Auth + Realtime Database (compat SDK)
- Chart.js 4
- Google Fonts (Inter)
