import React, { useState } from 'react';
import { ExperimentSample } from '../types';
import { Download, Search, Trash2, Filter, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface DataTabProps {
  samples: ExperimentSample[];
  onDeleteSample: (id: string) => void;
  onResetData: () => void;
}

export const DataTab: React.FC<DataTabProps> = ({ samples, onDeleteSample, onResetData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSamples = samples.filter((s) => {
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || s.wasteType === selectedType;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    let csv = "ID,Loai rac,Nhiet do (C),Khoi luong (g),Dien ap (V),Dong dien (A),Cong suat (W),Hieu suat (%),Thoi gian ghi\n";
    samples.forEach((row) => {
      csv += `${row.id},"${row.wasteType}",${row.temperature},${row.mass},${row.voltage},${row.current},${row.power},${row.efficiency}%,"${row.createdAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wastelab-data-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-950/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
            Bộ Dữ Liệu Thực Nghiệm
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tổng hợp các lần chạy thử nghiệm phục vụ phân tích thuật toán và thẩm định kết quả.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Khôi phục dữ liệu mẫu ban đầu"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Khôi phục
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Xuất File CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo ID, loại rác..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Lọc loại rác:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
          >
            <option value="all">Tất cả ({samples.length})</option>
            <option value="Rác hữu cơ">Rác hữu cơ</option>
            <option value="Nhựa">Nhựa</option>
            <option value="Giấy">Giấy</option>
            <option value="Rác hỗn hợp">Rác hỗn hợp</option>
            <option value="Vải / Dệt may">Vải / Dệt may</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Mã Mẫu</th>
                <th className="py-3 px-4">Loại Rác Thải</th>
                <th className="py-3 px-4 text-right">Nhiệt Độ</th>
                <th className="py-3 px-4 text-right">Khối Lượng</th>
                <th className="py-3 px-4 text-right">Điện Áp (U)</th>
                <th className="py-3 px-4 text-right">Dòng Điện (I)</th>
                <th className="py-3 px-4 text-right">Công Suất (P)</th>
                <th className="py-3 px-4 text-center">Hiệu Suất (η)</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 font-sans">
                    Không tìm thấy mẫu thí nghiệm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      #{sample.id}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-800">
                      {sample.wasteType}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {sample.temperature}°C
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {sample.mass}g
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {sample.voltage.toFixed(2)}V
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {sample.current.toFixed(2)}A
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-800">
                      {sample.power.toFixed(2)}W
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {sample.efficiency}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteSample(sample.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa mẫu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
