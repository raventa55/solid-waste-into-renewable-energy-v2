# WasteLab – Burn or Recycle? (v2.0)
> **Dự án Nghiên cứu Khoa học Kỹ thuật dành cho Học sinh THPT Chuyên Chu Văn An**  
> **Năm học:** 2026 – 2027  
> **Tác giả:** Tạ Giang Nam & Tô Thuỳ Trân  
> **Đề tài:** Xây dựng hệ thống phát điện từ chất thải rắn nhằm tận dụng nguồn năng lượng tái tạo – WasteLab

---

## 🌟 Giới Thiệu Dự Án
**WasteLab** là nền tảng số hỗ trợ người dân và nhóm nghiên cứu:
1. **Phân loại rác có căn cứ**: Tra cứu hướng xử lý tối ưu cho 28 loại vật liệu phổ biến, cung cấp hướng dẫn làm sạch và quy tắc an toàn.
2. **Kết nối điểm thu gom thực tế**: Tích hợp danh mục các trạm thu gom có điều kiện tiếp nhận và căn cứ xác nhận minh bạch tại Hà Nội (Tây Hồ, Cầu Giấy, Ba Đình...).
3. **Nhật ký & Lô vật liệu**: Quản lý từng lô rác, ghi nhận lần giao thực tế (kiểm soát sai lệch cân đo và lượng bị từ chối), xuất báo cáo UTF-8 CSV.
4. **Mô phỏng Điện rác (Waste-to-Energy)**: Áp dụng công thức vật lý nhiệt động lực học $Q = \sum (m_i \cdot q_i)$ và $E_{\text{ròng}} = E_{\text{phát}} - E_{\text{tự dùng}}$, đối chiếu mẻ kiểm tra kế thừa 100 kg ra 17.85 kWh điện ròng so với mốc đốt hỗn hợp lý thuyết 37.75 kWh.
5. **Tư liệu Khảo sát Thực địa Seraphin**: Ghi chép khảo sát tại Nhà máy Điện rác Seraphin (Sơn Tây, Hà Nội) về thu hồi kim loại từ xỉ đáy, kiểm soát hóa rắn tro bay và chuỗi lò - nồi hơi - tua-bin - máy phát.

---

## 🚀 Cài Đặt & Khởi Chạy Nhanh

### Yêu cầu môi trường
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+).

### Các bước khởi chạy:
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển cục bộ
npm run dev
```
Mở trình duyệt tại địa chỉ: `http://localhost:3000`

### Build phiên bản đóng gói sản phẩm:
```bash
npm run build
```
Toàn bộ mã nguồn đã biên dịch sẽ nằm trong thư mục `dist/`.

---

## 📁 Cấu Trúc Mã Nguồn
```text
├── src/
│   ├── components/
│   │   ├── HomeTab.tsx           # Trang chủ, tìm kiếm, 3 thẻ thống kê & thư viện ảnh
│   │   ├── ClassifyTab.tsx       # Tra cứu 28 vật liệu, câu hỏi tình trạng, thẻ kết quả 5 khối
│   │   ├── ReceiversTab.tsx      # Danh sách điểm thu gom thực tế, điều kiện nhận & liên hệ
│   │   ├── BatchesTab.tsx        # Quản lý lô, modal ghi bàn giao (nhận 4kg / từ chối 1kg)
│   │   ├── EnergyTab.tsx         # Mô phỏng điện rác mẻ 100 kg, sơ đồ dòng & so sánh A - B
│   │   ├── EducationTab.tsx      # Khảo sát Seraphin, bài đọc cốt lõi & 6 tình huống
│   │   └── Sidebar.tsx           # Menu điều hướng & chuyển đổi Dữ liệu thật / Minh họa
│   ├── data/
│   │   └── wasteSpecData.ts      # Danh mục 28 vật liệu, điểm thu gom, kịch bản 100 kg
│   ├── types.ts                  # Khai báo kiểu TypeScript chuẩn Đặc tả 2.0
│   ├── App.tsx                   # Component gốc điều phối trạng thái ứng dụng
│   └── index.css                 # Tailwind CSS styles
├── wastelab-v2-standalone.html   # Bản HTML độc lập mở trực tiếp trên trình duyệt
├── package.json
└── vite.config.ts
```

---

## 📜 Bản Quyền & Trích Dẫn
Dự án được xây dựng phục vụ Cuộc thi Khoa học Kỹ thuật cấp trường và thành phố dành cho học sinh THPT năm học 2026–2027.
