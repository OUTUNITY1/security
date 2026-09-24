# SecureX — Cybersecurity Platform 2026

Website demo cho công ty bảo mật mạng (Cybersecurity) với giao diện hiện đại năm 2026.

## Cấu trúc

```
security-site/
├── index.html          # Trang khách hàng (Landing page)
├── login.html          # Đăng nhập Admin
├── css/
│   └── style.css       # Toàn bộ CSS (dark theme, glassmorphism)
├── js/
│   ├── main.js         # JS trang khách
│   └── admin.js        # JS admin (logout, sidebar...)
└── admin/
    ├── dashboard.html  # Dashboard chính + charts
    ├── threats.html    # Quản lý Threats
    ├── tickets.html    # Quản lý Tickets
    ├── clients.html    # Quản lý Khách hàng
    ├── reports.html    # Báo cáo & Compliance
    ├── assets.html     # Asset Inventory
    ├── settings.html   # Cài đặt hệ thống
    └── team.html       # Đội ngũ SOC
```

## Cách chạy

Chỉ cần mở file `index.html` bằng trình duyệt (hoặc dùng Live Server).

Không cần backend — tất cả dữ liệu là mock/demo.

## Đăng nhập Admin

- **URL:** `login.html`
- **Email:** `admin@securex.vn`
- **Password:** `admin123`

Sau khi đăng nhập sẽ chuyển vào `admin/dashboard.html`.

## Tính năng

### Trang khách hàng
- Hero section hiện đại với animation
- Dịch vụ bảo mật (6 cards)
- About / Features
- Testimonials
- Contact form
- Footer đầy đủ
- Responsive mobile

### Admin Dashboard
- Sidebar navigation
- Stats cards realtime-style
- Charts (Chart.js): Threats theo thời gian + phân loại
- Bảng Threats gần đây
- Activity feed
- Client health overview
- Quản lý Threats (filter, search, modal chi tiết)
- Quản lý Tickets (tạo mới, xem, filter)
- Quản lý Clients
- Báo cáo Compliance
- Asset Inventory
- Settings (account, password, notifications, API)
- Team members

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Glassmorphism, Gradients)
- Vanilla JavaScript
- Chart.js 4 (CDN)
- Google Fonts (Inter)

## Design

- Dark theme chuyên nghiệp
- Accent cyan (#00f0ff) + purple (#7c3aed)
- Glassmorphism cards
- Smooth transitions
- Fully responsive
- 2026 modern aesthetic
