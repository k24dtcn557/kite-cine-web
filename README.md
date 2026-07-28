# Kite Cine Web Application 🎬

Chào mừng bạn đến với **Kite Cine** - Hệ thống đặt vé xem phim trực tuyến hiện đại, tiện lợi và dễ sử dụng!

Dự án này được khởi tạo với [Create React App](https://github.com/facebook/create-react-app) và được phát triển bằng **React.js** kết hợp **TypeScript**.

## 🌟 Tính Năng Nổi Bật

- **Dành cho Khách hàng:**
  - Xem danh sách phim đang chiếu và sắp chiếu.
  - Xem chi tiết phim, lịch chiếu tại các cụm rạp.
  - Chọn ghế và đặt vé trực tuyến dễ dàng.
  - Quản lý hồ sơ cá nhân và lịch sử đặt vé (Vé của tôi).
  - Thanh toán và nhận mã QR vé xem phim.

- **Dành cho Quản trị viên (Admin):**
  - Quản trị danh sách người dùng (thêm, sửa, khóa, xóa).
  - Quản trị danh sách phim và lịch chiếu.
  - Xem báo cáo, thống kê doanh thu rạp chiếu với biểu đồ trực quan (sử dụng Recharts).

## 🛠 Công Nghệ Sử Dụng

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **State/API:** [Axios](https://axios-http.com/) cho việc giao tiếp với RESTful Backend.
- **Xác thực:** [JWT-Decode](https://www.npmjs.com/package/jwt-decode) xử lý mã thông báo (Token) JWT.
- **UI/UX & Tiện ích:** 
  - [React Hot Toast](https://react-hot-toast.com/) - Hiển thị thông báo (toast) thân thiện với người dùng.
  - [Recharts](https://recharts.org/) - Cung cấp biểu đồ thống kê mạnh mẽ.
  - [qrcode.react](https://www.npmjs.com/package/qrcode.react) - Hiển thị mã QR vé xem phim.

## 🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án

### Yêu cầu hệ thống:
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị phiên bản 16 hoặc 18 trở lên).
- Trình quản lý gói `npm`.

### Các bước cài đặt:

1. **Cài đặt thư viện:**
   Tại thư mục gốc của dự án, mở terminal và chạy lệnh:
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng (Môi trường Development):**
   ```bash
   npm start
   ```
   Ứng dụng sẽ được chạy tại địa chỉ [http://localhost:3000](http://localhost:3000).  
   Trang web sẽ tự động tải lại (hot-reload) khi bạn chỉnh sửa mã nguồn, đồng thời sẽ báo lỗi trực tiếp trên terminal và màn hình (nếu có).

3. **Xây dựng bản Production (Môi trường thực tế):**
   Để đóng gói ứng dụng cho môi trường Production, chạy lệnh:
   ```bash
   npm run build
   ```
   Toàn bộ mã nguồn đã được tối ưu hóa sẽ nằm trong thư mục `build/`. Thư mục này đã sẵn sàng để được triển khai (deploy) lên các nền tảng máy chủ web như Nginx, Vercel, Netlify, hoặc AWS S3.

## 📂 Cấu Trúc Thư Mục Chính

- `src/components/`: Chứa các thành phần giao diện UI độc lập, có thể tái sử dụng (Navbar, LoginForm, Modals...).
- `src/pages/`: Chứa giao diện hoàn chỉnh của các trang chính (LoginPage, CheckoutPage, AdminDashBoard...).
- `src/services/`: Chứa các module tương tác trực tiếp với Backend API (Auth, Shows, Booking, v.v.).
- `src/contexts/`: Cung cấp React Context để chia sẻ và quản lý state toàn cục, như phiên đăng nhập (AuthContext).
- `src/types/`: Nơi định nghĩa các `interface` và `type` TypeScript của hệ thống, giúp kiểm tra kiểu dữ liệu chặt chẽ.

---
*Cảm ơn bạn đã lựa chọn Kite Cine. Chúc bạn có trải nghiệm xem phim tuyệt vời!* 🍿
