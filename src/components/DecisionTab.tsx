import React, { useState } from 'react';
import { DecisionResult } from '../types';
import { Recycle, Flame, AlertCircle, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

export const DecisionTab: React.FC = () => {
  const [wasteType, setWasteType] = useState<string>('paper');
  const [mass, setMass] = useState<number>(10);
  const [moisture, setMoisture] = useState<number>(20);
  const [recyclePotential, setRecyclePotential] = useState<number>(75);
  const [contamination, setContamination] = useState<number>(15);

  const [result, setResult] = useState<DecisionResult>({
    decision: 'Ưu tiên tái chế vật liệu',
    type: 'recycle',
    reason: 'Nhóm rác này có khả năng thu hồi vật liệu cao và độ lẫn tạp thấp. Đề xuất ưu tiên phân loại và chuyển đến đơn vị tái chế cơ học thay vì đốt ngay.',
    materialScore: 82,
    energyScore: 61,
    environmentScore: 87,
    recommendedAction: 'Thu gom riêng, ép kiện sạch và chuyển đến nhà máy tái chế bột giấy/carton.'
  });

  const analyzeDecision = () => {
    if (!mass || mass <= 0) {
      alert('Vui lòng nhập khối lượng rác lớn hơn 0');
      return;
    }

    const typeEnergy: Record<string, number> = {
      paper: 72,
      plastic: 90,
      organic: 38,
      textile: 68,
      mixed: 55
    };

    const typeMaterial: Record<string, number> = {
      paper: 88,
      plastic: 82,
      organic: 35,
      textile: 60,
      mixed: 45
    };

    let energy = typeEnergy[wasteType] - moisture * 0.55 - contamination * 0.15;
    let material = recyclePotential * 0.75 + typeMaterial[wasteType] * 0.25 - contamination * 0.25;
    let environment = 100 - energy * 0.25 + material * 0.25 - contamination * 0.15;

    energy = Math.max(0, Math.min(100, Math.round(energy)));
    material = Math.max(0, Math.min(100, Math.round(material)));
    environment = Math.max(0, Math.min(100, Math.round(environment)));

    let decision = '';
    let type: DecisionResult['type'] = 'recycle';
    let reason = '';
    let action = '';

    if (material >= 65 && contamination <= 35) {
      decision = 'Ưu tiên tái chế vật liệu';
      type = 'recycle';
      reason = 'Nhóm rác này có khả năng thu hồi vật liệu tương đối cao và tỷ lệ lẫn tạp chấp nhận được. Đề xuất ưu tiên phân loại và đưa vật liệu tới đơn vị tái chế thay vì tiêu hủy nhiệt.';
      action = 'Phân loại tại nguồn, làm sạch sơ bộ, đóng gói theo quy chuẩn tái chế.';
    } else if (energy >= 65 && material < 65) {
      decision = 'Ưu tiên thu hồi năng lượng (Waste-to-Energy)';
      type = 'energy';
      reason = 'Khả năng thu hồi vật liệu hạn chế hoặc chi phí tái chế cao, trong khi tiềm năng nhiệt trị tốt. Đưa vào hệ thống thu hồi năng lượng giúp giảm bãi chôn lấp và tạo điện.';
      action = 'Kiểm tra độ ẩm, nạp vào buồng đốt sinh nhiệt điện có kiểm soát khí thải.';
    } else {
      decision = 'Phân loại & Tiền xử lý trước';
      type = 'pretreatment';
      reason = 'Chưa nên quyết định đốt hoặc tái chế ngay. Cần phân loại tách dòng, sấy giảm độ ẩm hoặc loại bỏ tạp chất gây độc hại để tối ưu giá trị tài nguyên.';
      action = 'Phân tách kim loại/tạp chất độc hại, phơi giảm độ ẩm trước khi quyết định.';
    }

    setResult({
      decision,
      type,
      reason,
      materialScore: material,
      energyScore: energy,
      environmentScore: environment,
      recommendedAction: action
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-950/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
            Burn or Recycle? — Hỗ Trợ Quyết Định
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Không phải rác có nhiệt trị cao đều nên đốt: Tối ưu giữa thu hồi vật liệu và thu hồi năng lượng.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
          <Recycle className="w-3.5 h-3.5" />
          DECISION SUPPORT SYSTEM
        </div>
      </div>

      {/* Philosophy Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d3b2b] to-[#1a6448] text-white shadow-sm">
        <h2 className="text-base font-bold text-white mb-1">
          Triết lý Bảo vệ Môi trường của WasteLab
        </h2>
        <p className="text-xs text-emerald-100/90 leading-relaxed">
          Tái chế vật liệu luôn tiết kiệm năng lượng và giảm phát thải CO₂ lớn hơn so với việc đốt rác tạo điện. Chỉ những dòng rác không còn khả năng tái chế tuần hoàn mới được đưa vào chu trình chuyển đổi nhiệt điện.
        </p>
      </div>

      {/* Main Grid: Form & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Thông Tin Dòng Chất Thải Đầu Vào
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nhóm loại rác thải
            </label>
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white"
            >
              <option value="paper">Giấy / Thùng carton</option>
              <option value="plastic">Nhựa phế phẩm (PP, PE, PET)</option>
              <option value="organic">Rác hữu cơ / Thực phẩm thừa</option>
              <option value="textile">Vải sợi / Phế liệu dệt may</option>
              <option value="mixed">Rác sinh hoạt hỗn hợp</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Khối lượng (kg)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Độ ẩm ước tính (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Khả năng thu hồi vật liệu (%):</span>
                <span className="font-mono font-bold text-emerald-800">{recyclePotential}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={recyclePotential}
                onChange={(e) => setRecyclePotential(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Mức độ lẫn tạp / chất bẩn (%):</span>
                <span className="font-mono font-bold text-amber-800">{contamination}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={contamination}
                onChange={(e) => setContamination(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={analyzeDecision}
            className="w-full py-3 px-4 bg-[#103d2b] hover:bg-[#165a3f] text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Phân Tích Phương Án Xử Lý Tối Ưu
          </button>
        </div>

        {/* Results & Scores */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                KẾT QUẢ PHÂN TÍCH
              </span>
              <span className="text-xs text-slate-400">WasteLab Logic</span>
            </div>

            <div className={`p-4 rounded-xl border ${
              result.type === 'recycle'
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : result.type === 'energy'
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-blue-50/70 border-blue-300 text-blue-950'
            }`}>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Đề Xuất Hành Động:
              </div>
              <div className="text-xl font-black mt-1">
                {result.decision}
              </div>
              <p className="text-xs mt-2 leading-relaxed opacity-90">
                {result.reason}
              </p>
            </div>

            {/* Score Indicators */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Thu Hồi Vật Liệu</span>
                <span className="text-lg font-bold font-mono text-emerald-800">
                  {result.materialScore}
                </span>
                <span className="text-[10px] text-slate-400 block">/100</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Tiềm Năng Năng Lượng</span>
                <span className="text-lg font-bold font-mono text-amber-800">
                  {result.energyScore}
                </span>
                <span className="text-[10px] text-slate-400 block">/100</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Ưu Tiên Môi Trường</span>
                <span className="text-lg font-bold font-mono text-teal-800">
                  {result.environmentScore}
                </span>
                <span className="text-[10px] text-slate-400 block">/100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
              <strong className="text-slate-800">Gợi ý kỹ thuật: </strong>
              {result.recommendedAction}
            </div>
          </div>

          {/* Citizen Community Message */}
          <div className="p-5 rounded-2xl bg-[#09291f] text-white shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Recycle className="w-4 h-4 text-emerald-400" />
              Từ Phòng Thí Nghiệm Đến Người Dân
            </h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Mục tiêu cuối cùng không chỉ là tạo thêm điện từ rác, mà là giúp cộng đồng hiểu rằng mỗi loại rác có một "đường đi" khác nhau: thu hồi vật liệu, tái sử dụng, hoặc biến thành nhiệt điện. Phân loại đúng từ đầu giúp bảo vệ môi trường bền vững.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
