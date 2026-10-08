import React, { useState } from 'react';
import { WasteBatch, HandoverEvent, DataMode, CollectionHub } from '../types';
import { INITIAL_HUBS, INITIAL_MATERIALS } from '../data/wasteSpecData';
import { 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface BatchesTabProps {
  batches: WasteBatch[];
  handovers: HandoverEvent[];
  dataMode: DataMode;
  onAddBatch: (batch: Omit<WasteBatch, 'id' | 'createdAt'>) => void;
  onRecordHandover: (event: Omit<HandoverEvent, 'id'>) => void;
  onDeleteBatch: (id: string) => void;
  onDeleteHandover: (id: string) => void;
}

export const BatchesTab: React.FC<BatchesTabProps> = ({
  batches,
  handovers,
  dataMode,
  onAddBatch,
  onRecordHandover,
  onDeleteBatch,
  onDeleteHandover
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'batches' | 'handovers'>('batches');
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [selectedBatchForHandover, setSelectedBatchForHandover] = useState<WasteBatch | null>(null);

  // Form bàn giao
  const [hubId, setHubId] = useState(INITIAL_HUBS[0].id);
  const [offeredWeight, setOfferedWeight] = useState<number>(5);
  const [acceptedWeight, setAcceptedWeight] = useState<number>(4);
  const [rejectedWeight, setRejectedWeight] = useState<number>(1);
  const [rejectionReason, setRejectionReason] = useState<string>('Bị dính dầu máy và tạp chất');
  const [deliveryMethod, setDeliveryMethod] = useState<'self_delivered' | 'pickup'>('self_delivered');
  const [verificationLevel, setVerificationLevel] = useState<'self_reported' | 'verified_by_hub'>('verified_by_hub');
  const [evidenceCode, setEvidenceCode] = useState<string>('PHIEU-CAN-0810-01');

  // Lọc theo chế độ dữ liệu
  const currentBatches = batches.filter(b => b.dataMode === dataMode);
  const currentHandovers = handovers.filter(h => h.dataMode === dataMode);

  const openHandoverModal = (batch: WasteBatch) => {
    setSelectedBatchForHandover(batch);
    setOfferedWeight(batch.remainingQuantity);
    setAcceptedWeight(batch.remainingQuantity);
    setRejectedWeight(0);
    setRejectionReason('');
    setIsHandoverModalOpen(true);
  };

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForHandover) return;

    if (acceptedWeight + rejectedWeight !== offeredWeight) {
      alert(`Lỗi cộng số: Khối lượng được nhận (${acceptedWeight}) + từ chối (${rejectedWeight}) phải bằng khối lượng trình giao (${offeredWeight}).`);
      return;
    }

    const hub = INITIAL_HUBS.find(h => h.id === hubId) || INITIAL_HUBS[0];

    onRecordHandover({
      batchId: selectedBatchForHandover.id,
      batchName: selectedBatchForHandover.name,
      hubId: hub.id,
      hubName: hub.name,
      date: new Date().toISOString().slice(0, 10),
      deliveryMethod,
      offeredWeight,
      acceptedWeight,
      rejectedWeight,
      rejectionReason: rejectedWeight > 0 ? rejectionReason : undefined,
      verificationLevel,
      evidenceCode: evidenceCode.trim() || undefined,
      dataMode
    });

    setIsHandoverModalOpen(false);
  };

  // Xuất file CSV chuẩn UTF-8 (Page 10)
  const exportHandoversCSV = () => {
    let csv = "\uFEFFMã sự kiện,Mã lô,Tên lô,Điểm thu gom,Ngày giao,Cách giao,Lượng trình giao (kg),Lượng được nhận (kg),Lượng từ chối (kg),Lý do từ chối,Cấp chứng cứ,Mã chứng từ,Chế độ\n";
    currentHandovers.forEach((h) => {
      csv += `"${h.id}","${h.batchId}","${h.batchName}","${h.hubName}","${h.date}","${h.deliveryMethod === 'self_delivered' ? 'Tự mang đến' : 'Thu gom'} ",${h.offeredWeight},${h.acceptedWeight},${h.rejectedWeight},"${h.rejectionReason || ''}","${h.verificationLevel === 'verified_by_hub' ? 'Có xác nhận nơi nhận' : 'Người dùng ghi nhận'}","${h.evidenceCode || ''}","${h.dataMode === 'real' ? 'Thật' : 'Minh họa'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wastelab-nhat-ky-${dataMode}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-950/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
            Quản Lý Lô Vật Liệu & Nhật Ký Bàn Giao
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Lưu vết từng lần giao, kiểm soát sai lệch giữa lượng ước tính và cân thực tế, đối soát hai chiều.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentHandovers.length > 0 && (
            <button
              onClick={exportHandoversCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất File CSV
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs: Danh sách Lô vs Nhật ký bàn giao */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveSubTab('batches')}
          className={`pb-2 px-3 font-bold transition-all relative ${
            activeSubTab === 'batches'
              ? 'text-emerald-800 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Lô vật liệu đang lưu ({currentBatches.length})
        </button>
        <button
          onClick={() => setActiveSubTab('handovers')}
          className={`pb-2 px-3 font-bold transition-all relative ${
            activeSubTab === 'handovers'
              ? 'text-emerald-800 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Nhật ký các lần bàn giao thực tế ({currentHandovers.length})
        </button>
      </div>

      {activeSubTab === 'batches' ? (
        /* =================== TAB 1: DANH SÁCH LÔ VẬT LIỆU =================== */
        <div className="space-y-4">
          {currentBatches.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                Chưa có lô vật liệu nào trong kho lưu của bạn.
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Khi tra cứu và phân loại một món rác, hãy nhấn nút <b>"Lưu vào lô vật liệu"</b> để theo dõi và chuẩn bị bàn giao.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-500">
                        {batch.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        batch.remainingQuantity === 0 ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {batch.remainingQuantity === 0 ? 'Đã giao hết' : 'Đang chờ bàn giao'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {batch.conditionDescription}
                    </p>

                    {/* Số lượng & cân đo */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Lượng ban đầu:</span>
                        <span className="font-bold text-slate-800">
                          {batch.quantity} {batch.unit} ({batch.weightType === 'weighed' ? 'Đã cân' : 'Ước lượng'})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-sans">Còn lại chưa giao:</span>
                        <span className="font-bold text-emerald-700 text-sm">
                          {batch.remainingQuantity} {batch.unit}
                        </span>
                      </div>
                    </div>

                    {batch.receiverName && (
                      <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Nơi nhận dự kiến: {batch.receiverName}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onDeleteBatch(batch.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                      title="Xóa lô này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {batch.remainingQuantity > 0 ? (
                      <button
                        onClick={() => openHandoverModal(batch)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Ghi bàn giao thực tế</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Lô đã hoàn tất</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* =================== TAB 2: NHẬT KÝ BÀN GIAO THỰC TẾ =================== */
        <div className="space-y-4">
          {currentHandovers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Chưa có bản ghi bàn giao nào trong nhật ký.
              </p>
              <p className="text-xs text-slate-500">
                Khi mang rác tới điểm thu gom, bấm "Ghi bàn giao thực tế" trên thẻ Lô để lưu lại số cân và biên nhận.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Mã Sự Kiện</th>
                      <th className="py-3 px-4">Tên Lô & Điểm Nhận</th>
                      <th className="py-3 px-4 text-right">Trình Giao</th>
                      <th className="py-3 px-4 text-right text-emerald-800">Được Nhận</th>
                      <th className="py-3 px-4 text-right text-red-700">Từ Chối</th>
                      <th className="py-3 px-4">Cấp Xác Nhận</th>
                      <th className="py-3 px-4 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentHandovers.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {h.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{h.batchName}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{h.hubName} · {h.date}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                          {h.offeredWeight} kg
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                          +{h.acceptedWeight} kg
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-red-600">
                          {h.rejectedWeight > 0 ? `-${h.rejectedWeight} kg` : '0 kg'}
                          {h.rejectionReason && (
                            <span className="block text-[10px] font-sans font-normal text-slate-400">
                              {h.rejectionReason}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            h.verificationLevel === 'verified_by_hub'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {h.verificationLevel === 'verified_by_hub' ? 'Xác nhận nơi nhận' : 'Tự khai'}
                          </span>
                          {h.evidenceCode && (
                            <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                              {h.evidenceCode}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onDeleteHandover(h.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600"
                            title="Xóa bản ghi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL GHI BÀN GIAO THỰC TẾ (Tuân thủ Page 8) */}
      {isHandoverModalOpen && selectedBatchForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                  GHI NHẬN SỰ KIỆN THỰC TẾ
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Bàn Giao: {selectedBatchForHandover.name}
                </h3>
              </div>
              <button
                onClick={() => setIsHandoverModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleHandoverSubmit} className="space-y-3.5 text-xs">
              {/* Điểm thu gom tiếp nhận */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Điểm thu gom thực tế:
                </label>
                <select
                  value={hubId}
                  onChange={(e) => setHubId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
                >
                  {INITIAL_HUBS.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.district})</option>
                  ))}
                </select>
              </div>

              {/* Lượng cân trình giao */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Lượng cân trình giao tại điểm (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={offeredWeight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOfferedWeight(val);
                    setAcceptedWeight(val);
                    setRejectedWeight(0);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Phân bổ: Được nhận vs Từ chối (Page 8) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">
                  Kết quả kiểm tra tại trạm cân (Tổng = {offeredWeight} kg):
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-emerald-800 font-bold block mb-1">
                      Được tiếp nhận (kg):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={offeredWeight}
                      value={acceptedWeight}
                      onChange={(e) => {
                        const acc = Number(e.target.value);
                        setAcceptedWeight(acc);
                        setRejectedWeight(Number((offeredWeight - acc).toFixed(2)));
                      }}
                      className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg font-mono font-bold text-emerald-800 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-red-700 font-bold block mb-1">
                      Bị từ chối (kg):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={offeredWeight}
                      value={rejectedWeight}
                      onChange={(e) => {
                        const rej = Number(e.target.value);
                        setRejectedWeight(rej);
                        setAcceptedWeight(Number((offeredWeight - rej).toFixed(2)));
                      }}
                      className="w-full px-3 py-1.5 border border-red-300 rounded-lg font-mono font-bold text-red-700 bg-white outline-none"
                    />
                  </div>
                </div>

                {rejectedWeight > 0 && (
                  <div>
                    <label className="text-slate-600 block mb-1">Lý do từ chối cụ thể:</label>
                    <input
                      type="text"
                      placeholder="VD: Dính dầu mỡ, lẫn tạp chất, không đúng chủng loại..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white outline-none"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Căn cứ xác nhận (Cấp chứng cứ) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Cấp chứng cứ:</label>
                  <select
                    value={verificationLevel}
                    onChange={(e) => setVerificationLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white"
                  >
                    <option value="verified_by_hub">Có xác nhận nơi nhận (Phiếu cân/Tin nhắn)</option>
                    <option value="self_reported">Người dùng tự ghi nhận</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Mã phiếu / Biên nhận:</label>
                  <input
                    type="text"
                    placeholder="VD: PHIEU-0810-01"
                    value={evidenceCode}
                    onChange={(e) => setEvidenceCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsHandoverModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-2xs"
                >
                  Xác nhận lưu nhật ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
