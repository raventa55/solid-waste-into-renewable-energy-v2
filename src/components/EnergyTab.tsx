import React, { useState } from 'react';
import { EnergyScenario } from '../types';
import { PRESET_100KG_SCENARIO, calculateScenario } from '../data/wasteSpecData';
import { 
  Flame, 
  Zap, 
  RotateCcw, 
  Sliders, 
  CheckCircle2, 
  Info, 
  Layers, 
  ArrowRight,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

export const EnergyTab: React.FC = () => {
  // Scenario state
  const [activeScenarioMode, setActiveScenarioMode] = useState<'preset' | 'custom'>('preset');
  
  // Custom Scenario Inputs
  const [customMass, setCustomMass] = useState<number>(100);
  const [materialRecovery, setMaterialRecovery] = useState<number>(80);
  const [organicRecovery, setOrganicRecovery] = useState<number>(70);
  const [efficiencyEta, setEfficiencyEta] = useState<number>(20);
  const [internalUseRatio, setInternalUseRatio] = useState<number>(10);

  // Components distribution for custom
  const [compPlastic, setCompPlastic] = useState<number>(25);
  const [compPaper, setCompPaper] = useState<number>(8);
  const [compMetal, setCompMetal] = useState<number>(7);
  const [compOrganic, setCompOrganic] = useState<number>(35);
  const [compResidual, setCompResidual] = useState<number>(20);
  const [compSpecialized, setCompSpecialized] = useState<number>(5);

  const customComposition = [
    { name: 'Nhựa các loại', massKg: compPlastic, qMJ: 15, route: 'recycle' },
    { name: 'Giấy & carton', massKg: compPaper, qMJ: 0, route: 'recycle' },
    { name: 'Kim loại lon/hộp', massKg: compMetal, qMJ: 0, route: 'recycle' },
    { name: 'Rác hữu cơ', massKg: compOrganic, qMJ: 4, route: 'organic' },
    { name: 'Rác sinh hoạt còn lại', massKg: compResidual, qMJ: 12, route: 'residual' },
    { name: 'Pin & chuyên biệt', massKg: compSpecialized, qMJ: 0, route: 'specialized' }
  ];

  const calculatedCustom = calculateScenario(
    customMass,
    customComposition,
    materialRecovery,
    organicRecovery,
    efficiencyEta,
    internalUseRatio
  );

  const activeData = activeScenarioMode === 'preset' ? PRESET_100KG_SCENARIO : {
    ...calculatedCustom,
    name: 'Kịch bản điều chỉnh của người dùng',
    totalMassKg: customMass,
    materialRecoveryRate: materialRecovery,
    organicRecoveryRate: organicRecovery,
    efficiencyEta: efficiencyEta,
    internalUseRatio: internalUseRatio
  };

  const totalInputSum = compPlastic + compPaper + compMetal + compOrganic + compResidual + compSpecialized;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-emerald-950/10">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide uppercase">
          <span>Công cụ mô phỏng vật liệu & năng lượng</span>
          <span aria-hidden="true">·</span>
          <span>Dành cho nhóm nghiên cứu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight mt-0.5">
          Điện Rác: Nhập Kịch Bản & So Sánh Phương Án
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Tính toán công suất điện ròng dựa trên nhiệt trị thấp $Q = \sum(m_i \cdot q_i)$ và đối chiếu giữa hai phương án.
        </p>
      </div>

      {/* Mode selection: Ví dụ gốc vs Tự điều chỉnh */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Chọn chế độ kịch bản:</span>
          <div className="flex p-0.5 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveScenarioMode('preset')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeScenarioMode === 'preset'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mẻ kiểm tra kế thừa (100 kg mẫu)
            </button>
            <button
              onClick={() => setActiveScenarioMode('custom')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeScenarioMode === 'custom'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dùng số liệu của tôi
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
            Hệ số có nguồn: U.S. EIA & Seraphin
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
            Hệ số giả định: η = 20%
          </span>
        </div>
      </div>

      {/* Tùy chỉnh tham số khi ở chế độ 'custom' */}
      {activeScenarioMode === 'custom' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              Điều Chỉnh Thành Phần Mẻ Rác & Tỷ Lệ Thu Hồi
            </h3>
            {totalInputSum !== customMass && (
              <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Tổng thành phần ({totalInputSum} kg) khác khối lượng mẻ ({customMass} kg)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Nhựa (kg):</label>
              <input
                type="number"
                value={compPlastic}
                onChange={(e) => setCompPlastic(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Giấy (kg):</label>
              <input
                type="number"
                value={compPaper}
                onChange={(e) => setCompPaper(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Kim loại (kg):</label>
              <input
                type="number"
                value={compMetal}
                onChange={(e) => setCompMetal(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Hữu cơ (kg):</label>
              <input
                type="number"
                value={compOrganic}
                onChange={(e) => setCompOrganic(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Rác còn lại (kg):</label>
              <input
                type="number"
                value={compResidual}
                onChange={(e) => setCompResidual(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Pin/nguy hại (kg):</label>
              <input
                type="number"
                value={compSpecialized}
                onChange={(e) => setCompSpecialized(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>Thu hồi tái chế:</span>
                <b className="font-mono text-emerald-800">{materialRecovery}%</b>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={materialRecovery}
                onChange={(e) => setMaterialRecovery(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Thu hồi hữu cơ:</span>
                <b className="font-mono text-teal-800">{organicRecovery}%</b>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={organicRecovery}
                onChange={(e) => setOrganicRecovery(Number(e.target.value))}
                className="w-full accent-teal-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Hiệu suất lò η:</span>
                <b className="font-mono text-amber-800">{efficiencyEta}%</b>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={efficiencyEta}
                onChange={(e) => setEfficiencyEta(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Tỷ lệ tự dùng:</span>
                <b className="font-mono text-slate-800">{internalUseRatio}%</b>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={internalUseRatio}
                onChange={(e) => setInternalUseRatio(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* =================== BẢNG KẾT QUẢ VÀ SO SÁNH PHƯƠNG ÁN (Page 11-12) =================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Khối 1: Sơ đồ phân bổ dòng vật liệu */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                SƠ ĐỒ PHÂN BỔ DÒNG VẬT LIỆU
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Mẻ rác {activeData.totalMassKg} kg sau phân loại
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Tổng dòng: {(activeData.recycledMass + activeData.organicMass + activeData.thermalMass + activeData.inorganicMass + activeData.specializedMass).toFixed(1)} kg
            </span>
          </div>

          {/* Thanh phân bổ vật liệu trực quan */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-medium">
                <span className="text-emerald-800 font-bold">1. Thu hồi tái chế vật liệu</span>
                <span className="font-mono font-bold">{activeData.recycledMass} kg</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeData.recycledMass / activeData.totalMassKg) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-medium">
                <span className="text-teal-800 font-bold">2. Hữu cơ thu hồi (Compost/Biogas)</span>
                <span className="font-mono font-bold">{activeData.organicMass} kg</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeData.organicMass / activeData.totalMassKg) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-medium">
                <span className="text-amber-800 font-bold">3. Tuyến thu hồi nhiệt điện (Vào lò đốt)</span>
                <span className="font-mono font-bold">{activeData.thermalMass} kg</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeData.thermalMass / activeData.totalMassKg) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-medium">
                <span className="text-slate-600 font-bold">4. Vô cơ trơ (Mảnh vỡ/xà bần)</span>
                <span className="font-mono font-bold">{activeData.inorganicMass} kg</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeData.inorganicMass / activeData.totalMassKg) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-medium">
                <span className="text-red-700 font-bold">5. Pin & chất thải nguy hại chuyên biệt</span>
                <span className="font-mono font-bold">{activeData.specializedMass} kg</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeData.specializedMass / activeData.totalMassKg) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11.5px] text-slate-600 leading-relaxed">
            <strong>Ghi chú bảo toàn khối lượng: </strong>
            Tổng khối lượng các dòng ({activeData.recycledMass} + {activeData.organicMass} + {activeData.thermalMass} + {activeData.inorganicMass} + {activeData.specializedMass} = {activeData.totalMassKg} kg) đúng bằng khối lượng mẻ đầu vào. Không để thất thoát hay tính trùng dữ liệu.
          </div>
        </div>

        {/* Khối 2: Kết quả năng lượng & So sánh A - B */}
        <div className="lg:col-span-5 space-y-4">
          {/* Thẻ Điện ròng */}
          <div className="bg-gradient-to-br from-[#072f23] to-[#124d36] text-white p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-emerald-300 font-bold">
                KẾT QUẢ ĐIỆN RÒNG
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10.5px]">
                Mô phỏng
              </span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                {activeData.netKWh} <span className="text-base font-sans font-normal text-emerald-200">kWh</span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                Điện ròng ước tính – mô phỏng (sau khi trừ điện tự dùng)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-xs font-mono">
              <div>
                <span className="text-emerald-300/80 block text-[10px] font-sans">Tổng điện phát (gross):</span>
                <b>{activeData.grossKWh} kWh</b>
              </div>
              <div>
                <span className="text-emerald-300/80 block text-[10px] font-sans">Điện tự dùng lò ({activeData.internalUseRatio}%):</span>
                <b>{activeData.internalKWh} kWh</b>
              </div>
            </div>
          </div>

          {/* Bảng so sánh A - B (Page 12) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              So Sánh Hai Phương Án (Cùng Mẻ {activeData.totalMassKg} kg)
            </h4>

            <div className="space-y-2 text-xs">
              {/* Phương án A */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>Phương án A: Phân loại trước xử lý</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {activeData.netKWh} kWh
                  </span>
                </div>
                <div className="text-[11.5px] text-emerald-900/80 mt-1 space-y-0.5">
                  <div>· Thu hồi vật liệu: <b>{activeData.recycledMass} kg tái chế</b></div>
                  <div>· Thu hồi sinh học: <b>{activeData.organicMass} kg phân hữu cơ</b></div>
                  <div>· Rác vào lò nhiệt: <b>{activeData.thermalMass} kg</b></div>
                  <div>· Loại trừ rủi ro: Đã tách riêng 5 kg pin/nguy hại</div>
                </div>
              </div>

              {/* Phương án B */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Phương án B: Đốt hỗn hợp toàn bộ</span>
                  <span className="text-slate-700 font-mono font-bold">
                    {activeData.theoreticalMixedKWh} kWh
                  </span>
                </div>
                <div className="text-[11.5px] text-slate-600 mt-1 space-y-0.5">
                  <div>· Thu hồi vật liệu: <b>0 kg</b> (Mất sạch nhựa, giấy, kim loại)</div>
                  <div>· Nước trong rác hữu cơ làm giảm nhiệt độ buồng đốt</div>
                  <div>· Nguy cơ cao: Pin bị cháy sinh khí độc kim loại nặng</div>
                </div>
              </div>
            </div>

            {/* Thông điệp khoa học */}
            <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px] leading-relaxed">
              <strong>Nhận xét chuyên môn: </strong>
              Mặc dù đốt hỗn hợp tạo ra nhiều điện hơn trên giấy tờ ({activeData.theoreticalMixedKWh} kWh so với {activeData.netKWh} kWh), nhưng làm mất hoàn toàn <b>{activeData.recycledMass} kg nhựa/giấy tái chế</b> và phát sinh nguy cơ phát thải độc hại. Phân loại vật liệu trước xử lý mang lại tổng giá trị tài nguyên và môi trường cao hơn hẳn.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
