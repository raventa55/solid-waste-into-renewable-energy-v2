import React, { useState } from 'react';
import { CollectionHub, WasteMaterial } from '../types';
import { INITIAL_HUBS, INITIAL_MATERIALS } from '../data/wasteSpecData';
import { 
  MapPin, 
  Phone, 
  Copy, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Calendar, 
  Info,
  Check
} from 'lucide-react';

interface ReceiversTabProps {
  filterMaterialId?: string;
  userDistrict: string;
}

export const ReceiversTab: React.FC<ReceiversTabProps> = ({
  filterMaterialId = '',
  userDistrict
}) => {
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>(filterMaterialId);
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchHubName, setSearchHubName] = useState<string>('');
  const [savedHubIds, setSavedHubIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSaveHub = (id: string) => {
    if (savedHubIds.includes(id)) {
      setSavedHubIds(savedHubIds.filter(h => h !== id));
    } else {
      setSavedHubIds([...savedHubIds, id]);
    }
  };

  const copyAddress = (hub: CollectionHub) => {
    navigator.clipboard.writeText(`${hub.name} - ${hub.address}`);
    setCopiedId(hub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHubs = INITIAL_HUBS.filter((hub) => {
    if (districtFilter !== 'all' && !hub.district.includes(districtFilter)) {
      return false;
    }
    if (selectedMaterialFilter && !hub.acceptedMaterials.includes(selectedMaterialFilter)) {
      return false;
    }
    if (searchHubName) {
      const q = searchHubName.toLowerCase();
      if (!hub.name.toLowerCase().includes(q) && !hub.address.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-emerald-950/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
          Mạng Lưới Điểm Thu Gom Tiếp Nhận
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Danh sách cơ sở có thông tin thực tế, điều kiện tiếp nhận và căn cứ xác nhận minh bạch.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Tìm tên */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên điểm, đường phố..."
              value={searchHubName}
              onChange={(e) => setSearchHubName(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Lọc theo khu vực */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
            >
              <option value="all">Tất cả quận / huyện</option>
              <option value="Tây Hồ">Quận Tây Hồ</option>
              <option value="Cầu Giấy">Quận Cầu Giấy</option>
              <option value="Ba Đình">Quận Ba Đình</option>
            </select>
          </div>

          {/* Lọc theo vật liệu */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedMaterialFilter}
              onChange={(e) => setSelectedMaterialFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
            >
              <option value="">Tất cả loại rác nhận</option>
              {INITIAL_MATERIALS.slice(0, 15).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedMaterialFilter && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500">Đang lọc điểm nhận vật liệu:</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {INITIAL_MATERIALS.find(m => m.id === selectedMaterialFilter)?.name}
            </span>
            <button
              onClick={() => setSelectedMaterialFilter('')}
              className="text-slate-400 hover:text-slate-700 underline text-[11px]"
            >
              Bỏ lọc
            </button>
          </div>
        )}
      </div>

      {/* Danh sách điểm thu gom */}
      {filteredHubs.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            Chưa tìm thấy điểm thu gom phù hợp với bộ lọc hiện tại.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hệ thống không tự bịa điểm thu mua giả định. Bạn có thể mở rộng phạm vi quận hoặc lưu lô để bàn giao sau.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHubs.map((hub) => {
            const isSaved = savedHubIds.includes(hub.id);
            return (
              <div
                key={hub.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-3.5 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {hub.district}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                        {hub.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleSaveHub(hub.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'border-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      title={isSaved ? 'Đã lưu điểm' : 'Lưu điểm thu gom'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </p>

                  {/* Điều kiện tiếp nhận (Bắt buộc theo đặc tả - Page 7) */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                      Điều kiện bàn giao & Quy cách:
                    </span>
                    <p className="text-slate-600 text-[11.5px] leading-relaxed">
                      {hub.conditions}
                    </p>
                    {hub.pricing && (
                      <div className="text-[11px] text-emerald-800 pt-1 font-medium">
                        Giá / Hình thức: {hub.pricing}
                      </div>
                    )}
                  </div>

                  {/* Danh sách vật liệu nhận */}
                  <div className="mt-2.5">
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Các vật liệu được nhận tại điểm:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {hub.acceptedMaterials.map((matId) => {
                        const mat = INITIAL_MATERIALS.find(m => m.id === matId);
                        return mat ? (
                          <span
                            key={matId}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              matId === filterMaterialId
                                ? 'bg-emerald-700 text-white font-bold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {mat.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Căn cứ xác nhận & Các nút hành động (Page 7) */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="text-[10.5px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã xác nhận ({hub.verifiedDate})
                    </span>
                    <span className="truncate max-w-[210px] italic text-slate-400">
                      {hub.verificationSource}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <a
                      href={`tel:${hub.phone}`}
                      className="py-1.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-3 h-3" />
                      Gọi điện
                    </a>

                    <button
                      onClick={() => copyAddress(hub)}
                      className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-center flex items-center justify-center gap-1"
                    >
                      {copiedId === hub.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedId === hub.id ? 'Đã chép' : 'Chép địa chỉ'}
                    </button>

                    <button
                      onClick={() => alert(`Đã mở kênh liên hệ để hẹn thời gian giao rác tại: ${hub.name} (SĐT: ${hub.phone})`)}
                      className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-center"
                    >
                      Liên hệ để hẹn
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
