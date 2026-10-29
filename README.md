# CTEAN3 - COFFEE & TEA

Website tĩnh HTML, CSS và JavaScript, đã sắp xếp ở thư mục gốc để triển khai bằng GitHub Pages.

## Các trang
- `index.html` — Trang chủ
- `menu.html` — Thực đơn
- `gioithieu.html` — Giới thiệu
- `thanhvien.html` — Điểm thành viên
- `thanhtoan.html` — Giỏ hàng và thanh toán mô phỏng
- `style.css` — Giao diện
- `script.js` — Giỏ hàng, voucher và điểm thành viên
- Các ảnh `.jpg` — Hình ảnh website

## Triển khai GitHub Pages
1. Tạo một repository mới trên GitHub, đặt Public.
2. Tải **toàn bộ nội dung trong ZIP này** lên thư mục gốc repository (đừng tải ZIP lồng vào repository).
3. Vào **Settings → Pages**.
4. Ở **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn branch `main`, folder `/(root)`, nhấn **Save**.
6. Chờ GitHub Pages triển khai xong. Đường dẫn thường có dạng `https://TEN-TAI-KHOAN.github.io/TEN-REPOSITORY/`.

## Lưu ý
- Đây là website tĩnh. Giỏ hàng và điểm thành viên được lưu trong trình duyệt bằng `localStorage`, không đồng bộ giữa thiết bị/trình duyệt.
- Thanh toán hiện là **mô phỏng**, không nhận tiền và không kết nối ngân hàng. QR chỉ hiển thị thông tin đơn hàng demo.
- Google Fonts và dịch vụ tạo QR cần kết nối Internet.
