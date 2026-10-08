import React, { useState } from 'react';
import { AppTab, DataMode, WasteBatch, HandoverEvent, EnvironmentImage } from '../types';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  Clock, 
  Recycle, 
  Plus, 
  ZoomIn, 
  Leaf, 
  AlertTriangle 
} from 'lucide-react';

interface HomeTabProps {
  dataMode: DataMode;
  userDistrict: string;
  onChangeDistrict: (district: string) => void;
  batches: WasteBatch[];
  handovers: HandoverEvent[];
  environmentImages: EnvironmentImage[];
  onNavigateTab: (tab: AppTab, searchKeyword?: string) => void;
  onSelectImage: (img: EnvironmentImage) => void;
  onOpenAddImageModal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  dataMode,
  userDistrict,
  onChangeDistrict,
  batches,
  handovers,
  environmentImages,
  onNavigateTab,
  onSelectImage,
  onOpenAddImageModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc dữ liệu theo chế độ Thật / Minh họa
  const currentBatches = batches.filter(b => b.dataMode === dataMode);
  const currentHandovers = handovers.filter(h => h.dataMode === dataMode);

  // Tính 3 chỉ số theo đúng đặc tả (Page 3 & Page 10):
  // 1. Đã bàn giao: Tổng khối lượng được nhận theo các sự kiện không trùng
  const totalDeliveredKg = currentHandovers
    .filter(h => h.deliveryMethod !== undefined)
    .reduce((acc, h) => acc + h.acceptedWeight, 0);

  // 2. Được nơi nhận xác nhận: Phần thực nhận có căn cứ kiểm tra/biên nhận
  const verifiedDeliveredKg = currentHandovers
    .filter(h => h.verificationLevel === 'verified_by_hub')
    .reduce((acc, h) => acc + h.acceptedWeight, 0);

  // 3. Đang chờ bàn giao: Khối lượng còn ở người dùng
  const pendingKg = currentBatches
    .filter(b => b.status === 'saving' || b.status === 'contacted' || b.status === 'appointment' || b.status === 'partial')
    .reduce((acc, b) => acc + (b.unit === 'kg' ? b.remainingQuantity : 0), 0);

  const pendingItemsCount = currentBatches
    .filter(b => b.unit === 'mon' && (b.status === 'saving' || b.status === 'partial'))
    .reduce((acc, b) => acc + b.remainingQuantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateTab('classify', searchQuery.trim());
    } else {
      onNavigateTab('classify');
    }
  };

  const districts = [
    'Tây Hồ, Hà Nội',
    'Ba Đình, Hà Nội',
    'Cầu Giấy, Hà Nội',
    'Đống Đa, Hà Nội',
    'Hoàn Kiếm, Hà Nội',
    'Nam Từ Liêm, Hà Nội',
    'Bắc Từ Liêm, Hà Nội',
    'Thanh Xuân, Hà Nội'
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Cảnh báo chế độ dữ liệu minh họa nếu đang bật */}
      {dataMode === 'demo' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              Dữ liệu minh họa – không tính vào nhật ký thật của bạn.
            </span>
          </div>
          <span className="text-[11px] bg-amber-200/80 px-2 py-0.5 rounded font-mono font-bold">
            CHẾ ĐỘ MÔ PHỎNG
          </span>
        </div>
      )}

      {/* Header & Khu vực người dùng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-950/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide uppercase">
            <span>Ứng dụng hỗ trợ phân loại & điện rác</span>
            <span aria-hidden="true">·</span>
            <span>WasteLab 2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight mt-1">
            WasteLab – Burn or Recycle?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Phân loại đúng tại nguồn, kết nối điểm thu gom thực tế và đánh giá tác động năng lượng.
          </p>
        </div>

        {/* Lựa chọn khu vực */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-slate-500 font-medium">Khu vực:</span>
          <select
            value={userDistrict}
            onChange={(e) => onChangeDistrict(e.target.value)}
            className="font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
          >
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ô tìm kiếm lớn: "Bạn muốn phân loại gì?" */}
      <div className="bg-gradient-to-r from-[#072f23] via-[#0d3d2c] to-[#175c42] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Bạn muốn phân loại món đồ nào hôm nay?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Tra cứu cách phân loại, điều kiện làm sạch và tìm điểm thu gom đang tiếp nhận trong khu vực của bạn.
          </p>

          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Nhập tên đồ vật: chai nước, pin, bìa carton, vỏ hộp sữa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm outline-none shadow-inner placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-[#07241b] font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              Phân loại ngay
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Phím tắt gợi ý nhanh */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-emerald-200/90">
            <span>Gợi ý:</span>
            {['Chai PET', 'Pin cũ', 'Vỏ hộp sữa', 'Bìa carton', 'Túi nilon'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onNavigateTab('classify', item)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-400 hover:text-[#07241b] text-white font-medium hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Motif biểu tượng rác tuần hoàn */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none select-none text-[160px] font-black leading-none">
          ♻
        </div>
      </div>

      {/* 3 THẺ THỐNG KÊ CÁ NHÂN (Theo đúng trang 3 của đặc tả) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-700" />
            Thống Kê Nhật Ký Bàn Giao
          </h2>
          <button
            onClick={() => onNavigateTab('batches')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group transition-colors"
          >
            <span>Xem nhật ký chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {currentHandovers.length === 0 && currentBatches.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 hover:border-emerald-300 transition-all duration-200">
            <p className="text-sm text-slate-600 font-medium">
              Chưa có lần bàn giao nào.
            </p>
            <button
              onClick={() => onNavigateTab('classify')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 hover:scale-105 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Phân loại món đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Thẻ 1: Đã bàn giao */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default group">
              <span className="text-xs text-slate-500 font-medium block group-hover:text-emerald-800 transition-colors">
                Đã bàn giao (Thực tế)
              </span>
              <div className="text-2xl font-black font-mono text-[#0b2f24] mt-1 group-hover:text-emerald-900 transition-colors">
                {totalDeliveredKg.toFixed(1)} <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tổng khối lượng từ {currentHandovers.length} lượt giao thành công
              </p>
            </div>

            {/* Thẻ 2: Được nơi nhận xác nhận */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default group">
              <span className="text-xs text-emerald-800 font-medium block flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                Được nơi nhận xác nhận
              </span>
              <div className="text-2xl font-black font-mono text-emerald-700 mt-1 group-hover:text-emerald-800 transition-colors">
                {verifiedDeliveredKg.toFixed(1)} <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Có biên lai cân hoặc tin nhắn đối soát
              </p>
            </div>

            {/* Thẻ 3: Đang chờ bàn giao */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default group">
              <span className="text-xs text-amber-800 font-medium block flex items-center gap-1 group-hover:text-amber-700 transition-colors">
                <Clock className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                Đang chờ bàn giao
              </span>
              <div className="text-2xl font-black font-mono text-amber-700 mt-1 group-hover:text-amber-800 transition-colors">
                {pendingKg.toFixed(1)} <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
                {pendingItemsCount > 0 && (
                  <span className="text-xs font-sans font-medium text-slate-600 ml-2">
                    + {pendingItemsCount} món
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Lưu trong lô của bạn, chưa giao
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hành động nhanh: 3 nút lớn với hiệu ứng di chuột nổi bật */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateTab('classify')}
          className="p-4 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 text-left group shadow-xs cursor-pointer"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 flex items-center justify-between">
            <span>Phân loại ngay</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5" />
          </div>
          <p className="text-xs text-slate-500 group-hover:text-slate-600 mt-1 transition-colors">
            Tra cứu hướng xử lý cho 28 nhóm vật liệu phổ biến
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('receivers')}
          className="p-4 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 text-left group shadow-xs cursor-pointer"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 flex items-center justify-between">
            <span>Tìm điểm thu gom</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5" />
          </div>
          <p className="text-xs text-slate-500 group-hover:text-slate-600 mt-1 transition-colors">
            Xem điều kiện nhận, giá thu mua và liên hệ tại địa phương
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('energy')}
          className="p-4 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 text-left group shadow-xs cursor-pointer"
        >
          <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 flex items-center justify-between">
            <span>Mô phỏng Điện rác</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5" />
          </div>
          <p className="text-xs text-slate-500 group-hover:text-slate-600 mt-1 transition-colors">
            Khám phá kịch bản 100 kg mẫu và so sánh điện năng thu hồi
          </p>
        </button>
      </div>

      {/* MỤC BỘ SƯU TẬP ẢNH MÔI TRƯỜNG & HỆ THÍ NGHIỆM */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Hình Ảnh Môi Trường & Bối Cảnh Nghiên Cứu ({environmentImages.length} tư liệu)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tư liệu trực quan về hệ thí nghiệm vi mô, nhà máy điện rác thực tế và hiện trạng môi trường thúc đẩy dự án WasteLab.
            </p>
          </div>

          <button
            onClick={onOpenAddImageModal}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 hover:scale-105 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm ảnh môi trường
          </button>
        </div>

        {/* Grid hiển thị ĐẦY ĐỦ tất cả ảnh, không bị ẩn hay cắt bớt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {environmentImages.map((img) => (
            <div
              key={img.id}
              onClick={() => onSelectImage(img)}
              className="group rounded-2xl border border-slate-200/90 overflow-hidden bg-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={img.src}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/65 text-white text-[10.5px] font-semibold backdrop-blur-xs border border-white/10 shadow-sm">
                  {img.categoryLabel}
                </div>
                <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Xem chi tiết
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1">
                    {img.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="italic truncate max-w-[180px]">{img.sourceOrCredit}</span>
                  <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform duration-200">Chi tiết →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
