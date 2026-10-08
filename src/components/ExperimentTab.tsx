import React, { useState } from 'react';
import { ExperimentSample } from '../types';
import { FlaskConical, Zap, Thermometer, Weight, Clock, Check, RefreshCw, Cpu } from 'lucide-react';

interface ExperimentTabProps {
  onSaveSample: (sample: Omit<ExperimentSample, 'id' | 'createdAt'>) => void;
}

export const ExperimentTab: React.FC<ExperimentTabProps> = ({ onSaveSample }) => {
  const [temperature, setTemperature] = useState<number>(280);
  const [mass, setMass] = useState<number>(500);
  const [voltage, setVoltage] = useState<number>(2.80);
  const [current, setCurrent] = useState<number>(0.42);
  const [time, setTime] = useState<number>(30);
  const [wasteType, setWasteType] = useState<ExperimentSample['wasteType']>('Rác hữu cơ');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Real-time calculation
  const power = Number((voltage * current).toFixed(2));
  const energyWh = Number(((power * time) / 60).toFixed(3));
  const calculatedEfficiency = Math.min(
    95,
    Math.max(40, Math.round(((voltage * current * 100) / 3.2) * 10) / 10)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSample({
      wasteType,
      temperature,
      mass,
      voltage,
      current,
      power,
      time,
      efficiency: calculatedEfficiency
    });

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const loadPreset = (type: ExperimentSample['wasteType'], temp: number, v: number, a: number) => {
    setWasteType(type);
    setTemperature(temp);
    setVoltage(v);
    setCurrent(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-emerald-950/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
          Hệ Thí Nghiệm & Thu Thập Dữ Liệu
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Nhập các thông số thực nghiệm từ cảm biến nhiệt độ, cảm biến điện áp và mô-đun phát điện Seebeck.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Thông Số Mẫu Đo
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Form Kiểm Chuẩn
            </span>
          </div>

          {/* Quick Presets */}
          <div className="mb-5">
            <span className="text-xs text-slate-500 font-semibold block mb-2">
              Chọn nhanh cấu hình mẫu thử:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => loadPreset('Rác hữu cơ', 265, 2.5, 0.38)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                🌿 Rác hữu cơ (265°C)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('Nhựa', 305, 3.1, 0.48)}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                🧴 Nhựa (305°C)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('Giấy', 275, 2.7, 0.41)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                📄 Giấy (275°C)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  Nhiệt độ buồng đốt (°C)
                </label>
                <input
                  type="number"
                  min="50"
                  max="600"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-slate-600" />
                  Khối lượng rác thử nghiệm (g)
                </label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  Điện áp đo được (V)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  Dòng điện đo được (A)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={current}
                  onChange={(e) => setCurrent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  Thời gian thí nghiệm (phút)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Loại rác thực nghiệm
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                >
                  <option value="Rác hữu cơ">Rác hữu cơ (rau củ, bã cà phê...)</option>
                  <option value="Nhựa">Nhựa phế phẩm (PP, PE...)</option>
                  <option value="Giấy">Giấy / Bìa carton</option>
                  <option value="Vải / Dệt may">Vải vụn / Dệt may</option>
                  <option value="Rác hỗn hợp">Rác sinh hoạt hỗn hợp</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                  isSavedRecently
                    ? 'bg-emerald-600'
                    : 'bg-[#103d2b] hover:bg-[#165a3f]'
                }`}
              >
                {isSavedRecently ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đã Lưu Vào Bộ Dữ Liệu Thành Công!
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-4 h-4" />
                    + Lưu Mẫu Thí Nghiệm Vào Dữ Liệu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Simulation Stage & Physics Calculations */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Sensor Monitor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                Mô Phỏng Cảm Biến Real-Time
              </h3>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                ACTIVE
              </span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-2 font-mono tracking-wider">
                ♨️ ➔ ⚡
              </div>
              <div className="text-xs font-semibold text-slate-700">
                Hiệu ứng Nhiệt Điện (Thermoelectric Generation)
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Chênh lệch nhiệt độ giữa bề mặt nóng và bộ tản nhiệt lạnh tạo ra sức điện động $V = S \cdot \Delta T$.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Công suất tức thời</span>
                <span className="text-xl font-bold font-mono text-emerald-800">
                  {power} <span className="text-xs font-normal">W</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">P = U × I</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Năng lượng sinh ra</span>
                <span className="text-xl font-bold font-mono text-blue-800">
                  {energyWh} <span className="text-xs font-normal">Wh</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">E = P × t/60</span>
              </div>
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-emerald-900">Hiệu suất ước tính:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {calculatedEfficiency}%
                </span>
              </div>
              <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculatedEfficiency}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Practical Note Card */}
          <div className="bg-[#103d2b] text-white p-5 rounded-2xl shadow-sm space-y-2">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span>Ghi Chú An Toàn Thí Nghiệm</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Trong thí nghiệm đốt rác tạo điện, buồng đốt cần được bọc lớp cách nhiệt gốm và có đường dẫn khí lọc than hoạt tính để không phát tán khói độc ra môi trường phòng lab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
