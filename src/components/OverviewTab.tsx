import React, { useState } from 'react';
import { EnvironmentImage, ExperimentSample, TabType } from '../types';
import { RESEARCH_FLOW_STEPS } from '../data/defaultData';
import { 
  Plus, 
  ZoomIn, 
  Sparkles, 
  Flame, 
  Leaf, 
  Waves, 
  Recycle, 
  ChevronRight, 
  Info,
  Calendar,
  Layers,
  CheckCircle,
  FlaskConical
} from 'lucide-react';

interface OverviewTabProps {
  environmentImages: EnvironmentImage[];
  samples: ExperimentSample[];
  onSelectImage: (img: EnvironmentImage) => void;
  onOpenAddImageModal: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  environmentImages,
  samples,
  onSelectImage,
  onOpenAddImageModal,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Filter images by category
  const filteredImages = environmentImages.filter((img) => {
    if (selectedCategory === 'all') return true;
    return img.category === selectedCategory;
  });

  // Calculate live stats from samples
  const sampleCount = samples.length;
  const avgEfficiency = sampleCount > 0
    ? (samples.reduce((acc, s) => acc + s.efficiency, 0) / sampleCount).toFixed(1)
    : '78.4';
  
  // Find sample with highest efficiency to estimate optimal temp
  const bestSample = samples.reduce((prev, curr) => (curr.efficiency > prev.efficiency ? curr : prev), samples[0] || { temperature: 285 });
  const optimalTemp = bestSample ? bestSample.temperature : 285;
  const totalMass = samples.reduce((acc, s) => acc + s.mass, 0);
  const avgPower = sampleCount > 0
    ? (samples.reduce((acc, s) => acc + s.power, 0) / sampleCount).toFixed(2)
    : '1.10';

  const categories = [
    { id: 'all', label: 'Tất cả hình ảnh', count: environmentImages.length },
    { id: 'apparatus', label: 'Hệ thí nghiệm', count: environmentImages.filter(i => i.category === 'apparatus').length },
    { id: 'nature', label: 'Thiên nhiên & Bền vững', count: environmentImages.filter(i => i.category === 'nature').length },
    { id: 'pollution', label: 'Thực trạng ô nhiễm', count: environmentImages.filter(i => i.category === 'pollution').length },
    { id: 'recycling', label: 'Tuần hoàn & Phân loại', count: environmentImages.filter(i => i.category === 'recycling').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-950/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase">
            <span>Dự án Nghiên Cứu Khoa Học</span>
            <span aria-hidden="true">·</span>
            <span>Waste → Energy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight mt-1">
            WasteLab AI Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hệ thống xử lý, thu thập dữ liệu từ hệ thí nghiệm và đánh giá tác động môi trường.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ONLINE
          </div>
          <button
            onClick={() => onNavigateTab('experiment')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Nhập Mẫu Thí Nghiệm
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#072f23] via-[#103d2b] to-[#1c6b4d] text-white p-7 sm:p-9 shadow-lg border border-emerald-900/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            Mô Hình Đổi Mới Sáng Tạo Học Sinh
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            From Waste to Value
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Website prototype mô phỏng quá trình thu thập dữ liệu đa thông số từ hệ thống thí nghiệm nhiệt điện, phân tích bằng trí tuệ nhân tạo và đánh giá hiệu quả bảo vệ môi trường, hướng đến mô hình kinh tế tuần hoàn.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('decision')}
              className="px-4 py-2 bg-emerald-400 text-[#09291f] hover:bg-emerald-300 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Recycle className="w-4 h-4" />
              Công Cụ Burn or Recycle?
            </button>
            <button
              onClick={() => onNavigateTab('ai')}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Xem AI Phân Tích
            </button>
          </div>
        </div>
        
        {/* Subtle decorative motif */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none select-none text-[150px] font-black leading-none">
          ♻
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION: BỘ SƯU TẬP ẢNH MÔI TRƯỜNG & HỆ THÍ NGHIỆM              */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Hình Ảnh Môi Trường & Bối Cảnh Nghiên Cứu
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tư liệu trực quan về hệ thí nghiệm thực tế và các vấn đề môi trường cấp bách thúc đẩy dự án WasteLab.
            </p>
          </div>

          <button
            onClick={onOpenAddImageModal}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Thêm Ảnh Môi Trường
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.id ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col cursor-pointer"
              onClick={() => onSelectImage(img)}
            >
              {/* Media Container */}
              <div className="relative h-60 bg-slate-900 overflow-hidden">
                <img
                  src={img.src}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized container on broken image
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-emerald-950/20 text-emerald-800 p-6 text-center">
                          <svg class="w-10 h-10 mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          <span class="font-bold text-sm">${img.title}</span>
                          <span class="text-xs text-slate-500 mt-1">${img.caption}</span>
                        </div>
                      `;
                    }
                  }}
                />

                {/* Category Pill Overlay */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                    {img.categoryLabel}
                  </span>
                </div>

                {/* Hover Zoom Prompt */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Xem Chi Tiết & Ý Nghĩa
                  </span>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {img.caption}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="italic truncate max-w-[200px]">
                    {img.sourceOrCredit}
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Xem ảnh <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: QUY TRÌNH NGHIÊN CỨU & THỐNG KÊ                       */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Quy Trình Nghiên Cứu WasteLab
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5 giai đoạn chuyển hóa từ mẫu chất thải vật lý thành nguồn dữ liệu và khuyến nghị có thể hành động.
          </p>
        </div>

        {/* 5-Step Flow Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {RESEARCH_FLOW_STEPS.map((item, index) => {
            const isSelected = activeStepIndex === index;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStepIndex(index)}
                className={`p-3.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {item.step}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
            {RESEARCH_FLOW_STEPS[activeStepIndex].step}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {RESEARCH_FLOW_STEPS[activeStepIndex].title} — {RESEARCH_FLOW_STEPS[activeStepIndex].subtitle}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {RESEARCH_FLOW_STEPS[activeStepIndex].desc}
            </p>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#f7faf8] border border-slate-200/70">
            <div className="text-xs text-slate-500 font-medium">Mẫu Thí Nghiệm Đã Ghi</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] font-mono mt-1">
              {sampleCount} <span className="text-xs font-sans text-slate-400 font-normal">mẫu đo</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Tổng khối lượng: {totalMass}g rác
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f7faf8] border border-slate-200/70">
            <div className="text-xs text-slate-500 font-medium">Hiệu Suất Trung Bình</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono mt-1">
              {avgEfficiency}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Công suất phát TB: ~{avgPower} W
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f7faf8] border border-slate-200/70">
            <div className="text-xs text-slate-500 font-medium">Nhiệt Độ Tối Ưu Mô Phỏng</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono mt-1">
              {optimalTemp}°C
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Dải hiệu suất cao: 270°C – 300°C
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
