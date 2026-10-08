import React from 'react';
import { AppTab, DataMode } from '../types';
import { 
  Home, 
  Search, 
  MapPin, 
  ClipboardList, 
  Flame, 
  BookOpen, 
  AlertTriangle,
  Leaf,
  FlaskConical,
  Database,
  Sparkles,
  Recycle,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  dataMode: DataMode;
  onToggleDataMode: (mode: DataMode) => void;
  activeBatchCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  dataMode,
  onToggleDataMode,
  activeBatchCount
}) => {
  const urbanMenuItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      label: 'Trang chủ & 5 Ảnh',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'classify',
      label: 'Phân loại rác (28 loại)',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'receivers',
      label: 'Điểm thu gom Hà Nội',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'batches',
      label: 'Nhật ký & Lô rác',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: activeBatchCount > 0 ? String(activeBatchCount) : undefined
    },
    {
      id: 'energy',
      label: 'Mô phỏng Điện rác 100kg',
      icon: <Flame className="w-4 h-4" />
    }
  ];

  const researchMenuItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'experiment',
      label: 'Hệ thí nghiệm đo P',
      icon: <FlaskConical className="w-4 h-4" />
    },
    {
      id: 'data',
      label: 'Bộ dữ liệu & Xuất CSV',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'ai',
      label: 'AI Phân tích dữ liệu',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'decision',
      label: 'Burn or Recycle?',
      icon: <Recycle className="w-4 h-4" />
    },
    {
      id: 'evaluation',
      label: 'Đánh giá đề tài',
      icon: <CheckCircle2 className="w-4 h-4" />
    }
  ];

  const fieldSurveyItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'education',
      label: 'Khảo sát Seraphin & Quiz',
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  const renderNavGroup = (title: string, items: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[]) => (
    <div className="space-y-1">
      <div className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-wider text-emerald-300/60 uppercase">
        {title}
      </div>
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 text-left group cursor-pointer ${
              isActive
                ? 'bg-emerald-500/25 text-white border-l-4 border-emerald-400 font-bold shadow-sm translate-x-1'
                : 'text-emerald-100/80 hover:bg-emerald-500/20 hover:text-white hover:translate-x-1.5 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`transition-transform duration-200 group-hover:scale-115 ${isActive ? 'text-emerald-400' : 'text-emerald-300/60 group-hover:text-emerald-300'}`}>
                {item.icon}
              </span>
              <span className="transition-colors group-hover:font-semibold text-xs sm:text-[13px]">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/50 group-hover:border-emerald-400">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-64 bg-gradient-to-b from-[#07241b] via-[#0b3326] to-[#0e3d2e] text-white flex flex-col shrink-0 border-r border-emerald-950/40 shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight leading-tight">
              Waste<span className="text-emerald-400">Lab</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-medium tracking-tight">
              Burn or Recycle? · v2.0
            </div>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-emerald-200/60 leading-tight">
          THPT Chuyên Chu Văn An · KHKT 2026–2027
        </div>
      </div>

      {/* Data Mode Switcher */}
      <div className="px-4 py-3 bg-black/20 border-b border-emerald-900/40">
        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-200 mb-1.5">
          <span>Chế độ dữ liệu:</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
            dataMode === 'real' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-900'
          }`}>
            {dataMode === 'real' ? 'DỮ LIỆU THẬT' : 'MINH HỌA'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-black/40 rounded-lg text-xs">
          <button
            onClick={() => onToggleDataMode('real')}
            className={`py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              dataMode === 'real'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            Thực tế
          </button>
          <button
            onClick={() => onToggleDataMode('demo')}
            className={`py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              dataMode === 'demo'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            Minh họa
          </button>
        </div>
        {dataMode === 'demo' && (
          <div className="flex items-center gap-1 text-[10px] text-amber-300 mt-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Đang bật mẫu minh họa (không tính vào nhật ký thật).</span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {renderNavGroup('Ứng Dụng Đô Thị & Học Sinh', urbanMenuItems)}
        {renderNavGroup('Nghiên Cứu Thực Nghiệm (Seebeck)', researchMenuItems)}
        {renderNavGroup('Tư Liệu Thực Địa', fieldSurveyItems)}
      </nav>

      {/* Footer Project Info */}
      <div className="p-3.5 border-t border-emerald-800/30 bg-[#061e16]">
        <div className="text-[11px] text-emerald-200/80 leading-relaxed">
          <div className="font-bold text-white mb-0.5">Tác giả đề tài:</div>
          <div className="font-semibold text-emerald-300">Tạ Giang Nam & Tô Thuỳ Trân</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">
            Bản dùng thử: Dữ liệu lưu cục bộ trên thiết bị
          </div>
        </div>
      </div>
    </aside>
  );
};
