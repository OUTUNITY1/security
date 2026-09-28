# SecureX — Cybersecurity Platform 2026

Website demo cho công ty bảo mật mạng (Cybersecurity) với giao diện hiện đại năm 2026 + **Firebase Auth & Realtime Database** + **AI Security Bot**.

## Cấu trúc

```
security-main/
├── index.html              # Trang khách hàng (Landing page) + AI Bot
├── login.html              # Đăng nhập Admin (chỉ lga775385@gmail.com)
├── client-register.html    # Đăng ký Client (tự do)
├── client-login.html       # Đăng nhập Client
├── client-dashboard.html   # Dashboard Client (đọc data thật từ /users/{uid}) + AI Insights
├── css/
│   └── style.css           # Glassmorphism + AI Bot widget styles
├── js/
│   ├── firebase-config.js  # Firebase init + helpers + strict rules note
│   ├── main.js             # JS trang khách + contact form + AI Bot
│   └── admin.js            # JS admin + auth protection
└── admin/
    ├── dashboard.html
    ├── threats.html
    ├── tickets.html
    ├── clients.html        # Mock data (rules không cho list all users)
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
/users/{uid}                 # Mỗi user chỉ đọc/ghi được chính mình
  - uid, email, displayName, role ("admin" | "client")
  - country, phone, industry, package
  - healthScore, threats30d, openTickets, status
  - metrics: { uptime, threatsBlocked, incidentsResolved, avgResponseMs }
  - createdAt, lastLogin

/leads/{pushId}              # (cần thêm rules riêng để form liên hệ hoạt động)
  - name, email, phone, country, service, industry, message
  - createdAt, status, source
```

### Security Rules đang áp dụng (đúng theo yêu cầu)

```json
{
  "rules": {
    "users": {
      "$user_id": {
        ".read": "$user_id === auth.uid",
        ".write": "$user_id === auth.uid"
      }
    }
  }
}
```

**Hệ quả của rules này:**
| Thao tác | Kết quả |
|----------|---------|
| Client đọc/ghi `/users/{ownUid}` | ✅ Được phép |
| Admin list toàn bộ clients | ❌ PERMISSION_DENIED |
| Form liên hệ ghi `/leads` | ❌ Cần thêm rules |
| Admin đọc/ghi profile của chính mình | ✅ Được phép |

**Nếu muốn Admin xem danh sách clients + form liên hệ hoạt động**, mở rộng rules trong Firebase Console:

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

## Cách chạy

1. Mở `index.html` bằng Live Server hoặc bất kỳ static server nào.
2. Tạo tài khoản Admin trước trong Firebase Console (Authentication → Users) với email `lga775385@gmail.com`.
3. Client đăng ký trực tiếp trên trang web → dữ liệu lưu vào `/users/{uid}`.

## Đăng nhập

| Vai trò | URL | Email |
|---------|-----|-------|
| **Admin** | `login.html` | **chỉ** `lga775385@gmail.com` |
| **Client** | `client-login.html` / `client-register.html` | bất kỳ (tự do) |

## Tính năng đã tích hợp

- Đăng nhập / Đăng ký Email + Password
- Chỉ Admin email được vào `/admin/*`
- Client lưu profile + metrics vào `/users/{uid}` (tuân thủ strict rules)
- Client Dashboard đọc dữ liệu thật từ DB + **AI Security Insights**
- **AI Security Bot** floating widget trên trang chủ & client dashboard (rule-based)
- Form liên hệ (cần rules `/leads` để lưu được)
- Admin Clients page: hiển thị dữ liệu demo thực tế (vì rules không cho list)

## UI/UX tối ưu

- Glassmorphism dark theme 2026
- AI Bot widget hiện đại (typing indicator, suggestion chips, gradient)
- Client Dashboard: AI Insights card tự động phân tích Health Score, threats, package
- Responsive mobile-friendly

## Tech Stack

- HTML5 + CSS3 (Glassmorphism, Dark theme)
- Vanilla JS
- Firebase Auth + Realtime Database (compat SDK)
- Chart.js 4 (admin)
- Google Fonts (Inter)
