import React, { useState, useEffect } from 'react';
import { WasteMaterial, CollectionHub, WasteBatch, DataMode, TreatmentGroup, ReceiverStatus } from '../types';
import { INITIAL_MATERIALS, INITIAL_HUBS } from '../data/wasteSpecData';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowLeft, 
  Plus, 
  MapPin, 
  ChevronDown, 
  HelpCircle,
  Flag,
  Share2
} from 'lucide-react';

interface ClassifyTabProps {
  initialKeyword?: string;
  dataMode: DataMode;
  userDistrict: string;
  onSaveBatch: (batch: Omit<WasteBatch, 'id' | 'createdAt'>) => void;
  onNavigateToHubs: (materialId: string) => void;
}

export const ClassifyTab: React.FC<ClassifyTabProps> = ({
  initialKeyword = '',
  dataMode,
  userDistrict,
  onSaveBatch,
  onNavigateToHubs
}) => {
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<WasteMaterial | null>(null);

  // Form tình trạng vật liệu
  const [canReuseAnswer, setCanReuseAnswer] = useState<'yes' | 'no' | 'unclear'>('no');
  const [cleanliness, setCleanliness] = useState<'clean' | 'dirty_food' | 'chemicals' | 'unclear'>('clean');
  const [structure, setStructure] = useState<'single' | 'composite' | 'unclear'>('single');
  const [unitType, setUnitType] = useState<'kg' | 'mon'>('kg');
  const [weightType, setWeightType] = useState<'weighed' | 'estimated'>('estimated');
  const [quantity, setQuantity] = useState<number>(1);
  const [batchNotes, setBatchNotes] = useState<string>('');
  
  // Trạng thái kết quả & phản hồi sai sót
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [showWhyDetail, setShowWhyDetail] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    if (initialKeyword) {
      setSearchTerm(initialKeyword);
    }
  }, [initialKeyword]);

  // Tìm kiếm theo tên có dấu, không dấu và từ đồng nghĩa
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  };

  const filteredMaterials = INITIAL_MATERIALS.filter((mat) => {
    const q = normalize(searchTerm.trim());
    if (q) {
      const matchName = normalize(mat.name).includes(q);
      const matchCommon = normalize(mat.commonName).includes(q);
      const matchSynonyms = mat.synonyms.some(s => normalize(s).includes(q));
      if (!matchName && !matchCommon && !matchSynonyms) return false;
    }
    if (selectedCategory !== 'all' && mat.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleSelectMaterial = (mat: WasteMaterial) => {
    setSelectedMaterial(mat);
    setCleanliness('clean');
    setCanReuseAnswer(mat.canReuse ? 'yes' : 'no');
    setStructure(mat.id === 'mat_tetra_pak' || mat.id === 'mat_composite_packaging' ? 'composite' : 'single');
    setIsSavedSuccessfully(false);
    setShowWhyDetail(false);
  };

  // Tính toán kết quả phân loại theo Logic Đặc tả (Page 5)
  const determineResult = () => {
    if (!selectedMaterial) return null;

    let group: TreatmentGroup = selectedMaterial.treatmentGroup;
    let title = '';
    let explanation = '';
    let warning = selectedMaterial.safetyWarning;

    // Ngoại lệ an toàn: Pin hoặc vật có nguy cơ KHÔNG được chuyển sang nhóm thông thường dù chọn "sạch"
    if (selectedMaterial.isHazardous) {
      group = 'specialized';
      title = 'THU GOM RIÊNG';
      explanation = 'Chất thải nguy hại hoặc chứa hóa chất/kim loại nặng. Tuyệt đối không bỏ chung với rác thông thường.';
    } else if (canReuseAnswer === 'yes' && selectedMaterial.canReuse) {
      group = 'reuse';
      title = 'DÙNG LẠI (TÁI SỬ DỤNG)';
      explanation = 'Sản phẩm còn nguyên giá trị sử dụng. Ưu tiên giữ lại dùng tiếp hoặc quyên góp thiện nguyện.';
    } else if (cleanliness === 'chemicals') {
      group = 'residual';
      title = 'RÁC CÒN LẠI (DÍNH HÓA CHẤT)';
      explanation = 'Vật liệu bị dính hóa chất/chất tẩy không đủ tiêu chuẩn tái chế cơ học an toàn. Đưa vào dòng rác sinh hoạt còn lại.';
    } else if (cleanliness === 'dirty_food' && selectedMaterial.category === 'plastic') {
      group = 'residual';
      title = 'RÁC CÒN LẠI (NHỰA NHIỄM BẨN)';
      explanation = 'Nhựa dính dầu mỡ hữu cơ khó làm sạch. Nếu không thể rửa sạch, chuyển vào túi rác còn lại để xử lý nhiệt.';
    } else {
      // Mặc định theo nhóm vật liệu
      if (group === 'recycle') title = 'TÁI CHẾ VẬT LIỆU';
      else if (group === 'organic') title = 'RÁC HỮU CƠ (Ủ PHÂN / VI SINH)';
      else if (group === 'inorganic') title = 'VÔ CƠ RIÊNG (MẢNH VỠ / TRƠ)';
      else title = 'RÁC CÒN LẠI';
      explanation = selectedMaterial.commonName;
    }

    // Kiểm tra nơi nhận phù hợp trong danh sách
    const matchingHubs = INITIAL_HUBS.filter(h => 
      h.acceptedMaterials.includes(selectedMaterial.id) && h.status === 'verified'
    );

    let receiverStatus: ReceiverStatus = 'not_found';
    let matchingHub = matchingHubs.length > 0 ? matchingHubs[0] : null;

    if (matchingHub) {
      receiverStatus = 'conditions_met';
    } else {
      receiverStatus = 'not_found';
    }

    return {
      group,
      title,
      explanation,
      warning,
      matchingHub,
      receiverStatus,
      instructions: selectedMaterial.defaultInstructions
    };
  };

  const result = determineResult();

  const handleSaveToBatch = () => {
    if (!selectedMaterial || !result) return;

    const suggestedName = `${selectedMaterial.name} (${unitType === 'kg' ? quantity + 'kg' : quantity + ' món'}) - ${new Date().toLocaleDateString('vi-VN')}`;

    onSaveBatch({
      name: suggestedName,
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.name,
      treatmentGroup: result.group,
      conditionDescription: `Tình trạng: ${cleanliness === 'clean' ? 'Sạch' : cleanliness === 'dirty_food' ? 'Dính thức ăn' : 'Dính hóa chất'}${canReuseAnswer === 'yes' ? ' · Còn dùng được' : ''}`,
      unit: unitType,
      weightType: weightType,
      quantity: quantity,
      remainingQuantity: quantity,
      receiverId: result.matchingHub?.id,
      receiverName: result.matchingHub?.name,
      receiverStatus: result.receiverStatus,
      status: 'saving',
      dataMode,
      notes: batchNotes.trim()
    });

    setIsSavedSuccessfully(true);
  };

  const categories = [
    { id: 'all', label: 'Tất cả 28 loại' },
    { id: 'plastic', label: 'Nhựa' },
    { id: 'paper', label: 'Giấy' },
    { id: 'metal', label: 'Kim loại' },
    { id: 'glass', label: 'Thủy tinh' },
    { id: 'organic', label: 'Hữu cơ' },
    { id: 'battery_electronic', label: 'Pin & Điện tử' },
    { id: 'other', label: 'Vật khác' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-emerald-950/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
          Phân Loại Rác Có Căn Cứ
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Tra cứu 28 loại vật liệu, hướng xử lý tối ưu và kết nối với mạng lưới điểm tiếp nhận.
        </p>
      </div>

      {!selectedMaterial ? (
        /* =================== MÀN HÌNH TRA CỨU DANH MỤC =================== */
        <div className="space-y-5">
          {/* Search bar & Category filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm theo tên có dấu hoặc không dấu: chai pet, bia carton, hop sua, pin con tho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all duration-200 cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-emerald-800 text-white font-bold shadow-xs scale-102'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-900 hover:scale-105 active:scale-95'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Danh sách vật liệu */}
          {filteredMaterials.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                Chưa tìm thấy vật liệu "{searchTerm}"
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bạn có thể thử tìm bằng từ đồng nghĩa (ví dụ: chai nước, túi xốp, vỏ lon) hoặc gửi thông tin để nhóm nghiên cứu bổ sung vào danh mục.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Xem toàn bộ 28 vật liệu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => handleSelectMaterial(mat)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-emerald-100/70 group-hover:text-emerald-800 transition-colors">
                        {mat.categoryLabel}
                      </span>
                      {mat.isHazardous && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 flex items-center gap-1 group-hover:bg-red-200/80 transition-colors">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Nguy hại
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                      {mat.name}
                    </h3>
                    <p className="text-xs text-slate-500 group-hover:text-slate-600 mt-1 line-clamp-2 transition-colors">
                      {mat.commonName}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700">
                      {mat.treatmentGroup === 'recycle' ? '♻ Tái chế' :
                       mat.treatmentGroup === 'specialized' ? '⚠ Thu gom riêng' :
                       mat.treatmentGroup === 'organic' ? '🌿 Hữu cơ' :
                       mat.treatmentGroup === 'reuse' ? '↻ Dùng lại' : '🗑 Rác còn lại'}
                    </span>
                    <span className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 font-medium transition-all duration-200">
                      Chọn phân loại →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* =================== MÀN HÌNH TÌNH TRẠNG VẬT LIỆU & KẾT QUẢ =================== */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedMaterial(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh mục vật liệu
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột trái: Câu hỏi tình trạng vật liệu (Chỉ hỏi câu cần thiết - Page 4) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10.5px] uppercase font-bold text-emerald-800 tracking-wider">
                  {selectedMaterial.categoryLabel}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedMaterial.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedMaterial.commonName}
                </p>
              </div>

              {/* Câu hỏi 1: Còn dùng được không (Chỉ hiện nếu có thể dùng lại) */}
              {selectedMaterial.canReuse && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Món đồ này còn dùng được không?
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'yes', label: 'Còn dùng tốt' },
                      { id: 'no', label: 'Đã hỏng / Thải bỏ' },
                      { id: 'unclear', label: 'Chưa rõ' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCanReuseAnswer(opt.id as any)}
                        className={`py-2 px-2.5 rounded-xl border text-center font-medium transition-all ${
                          canReuseAnswer === opt.id
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Câu hỏi 2: Tình trạng hiện tại */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tình trạng bề mặt & độ sạch:
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'clean', label: 'Sạch và rỗng (đã rửa hoặc không dính bẩn)' },
                    { id: 'dirty_food', label: 'Còn thức ăn hoặc dầu mỡ thông thường' },
                    { id: 'chemicals', label: 'Dính hóa chất, sơn hoặc không rõ chất chứa' },
                    { id: 'unclear', label: 'Chưa rõ tình trạng' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCleanliness(opt.id as any)}
                      className={`w-full py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        cleanliness === opt.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {cleanliness === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Câu hỏi 3: Khối lượng hoặc số lượng (Không bắt buộc để tra cứu - Page 5) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Định lượng (dùng khi lưu vào lô vật liệu):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Đơn vị đo:</label>
                    <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setUnitType('kg')}
                        className={`py-1 rounded-md font-bold text-[11px] ${
                          unitType === 'kg' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Khối lượng (kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnitType('mon')}
                        className={`py-1 rounded-md font-bold text-[11px] ${
                          unitType === 'mon' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Số món (cái)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Cơ sở ghi:</label>
                    <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setWeightType('weighed')}
                        className={`py-1 rounded-md font-bold text-[11px] ${
                          weightType === 'weighed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Đã cân
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeightType('estimated')}
                        className={`py-1 rounded-md font-bold text-[11px] ${
                          weightType === 'estimated' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Ước lượng
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">
                    Số lượng ({unitType === 'kg' ? 'kg' : 'món'}):
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step={unitType === 'kg' ? '0.1' : '1'}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Cột phải: Thẻ kết quả 5 khối (Ngắn, Cụ thể, Có hành động - Page 5) */}
            {result && (
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  {/* Khối 1: Tên vật và tình trạng */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 font-mono">KẾT QUẢ ĐỀ XUẤT</span>
                      <h3 className="text-base font-bold text-slate-900">
                        {selectedMaterial.name}
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {cleanliness === 'clean' ? 'Sạch & Rỗng' : 'Có lẫn tạp'}
                    </span>
                  </div>

                  {/* Cảnh báo an toàn nếu có */}
                  {result.warning && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-red-800">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                        CẢNH BÁO AN TOÀN BẮT BUỘC
                      </div>
                      <p className="leading-relaxed text-[11.5px]">
                        {result.warning}
                      </p>
                    </div>
                  )}

                  {/* Khối 2: Nhóm xử lý */}
                  <div className={`p-4 rounded-xl border ${
                    result.group === 'recycle' ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' :
                    result.group === 'specialized' ? 'bg-amber-50 border-amber-300 text-amber-950' :
                    result.group === 'reuse' ? 'bg-blue-50 border-blue-300 text-blue-950' :
                    result.group === 'organic' ? 'bg-teal-50 border-teal-300 text-teal-950' :
                    'bg-slate-100 border-slate-300 text-slate-900'
                  }`}>
                    <span className="text-[11px] uppercase font-bold tracking-wider opacity-70 block mb-0.5">
                      Hướng xử lý vật liệu:
                    </span>
                    <div className="text-xl font-black">
                      {result.title}
                    </div>
                    <p className="text-xs mt-1.5 leading-relaxed opacity-90">
                      {result.explanation}
                    </p>
                  </div>

                  {/* Khối 3: Tối đa 3 việc chuẩn bị */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                      Các bước chuẩn bị trước khi bàn giao:
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      {result.instructions.map((ins, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{ins}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Khối 4: Trạng thái nơi nhận (Tách riêng khỏi nhóm xử lý - Page 3 & 6) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Trạng thái nơi nhận:
                    </span>
                    {result.matchingHub ? (
                      <div>
                        <div className="font-bold text-emerald-900 text-sm">
                          {result.matchingHub.name}
                        </div>
                        <div className="text-slate-600 text-[11.5px] mt-0.5">
                          Địa chỉ: {result.matchingHub.address}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ngày xác nhận: {result.matchingHub.verifiedDate}</span>
                          <span>· Căn cứ: {result.matchingHub.verificationSource}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-amber-800 font-medium">
                        Chưa tìm thấy nơi nhận phù hợp trong danh sách hiện tại tại khu vực {userDistrict}.
                        <p className="text-[11px] text-slate-500 font-normal mt-1">
                          Vẫn hướng dẫn giữ riêng chai/vật liệu sạch; không đổi kết luận thành "đốt".
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Khối 5: Nút hành động */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    {result.matchingHub ? (
                      <button
                        onClick={() => onNavigateToHubs(selectedMaterial.id)}
                        className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-2xs"
                      >
                        Xem điểm thu gom
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigateToHubs('')}
                        className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-2xs"
                      >
                        Tìm điểm khác
                      </button>
                    )}

                    <button
                      onClick={handleSaveToBatch}
                      disabled={isSavedSuccessfully}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 ${
                        isSavedSuccessfully
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {isSavedSuccessfully ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã lưu 1 lô; Xem nhật ký
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Lưu vào lô vật liệu
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phần mở rộng "Vì sao?" (Page 6) */}
                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => setShowWhyDetail(!showWhyDetail)}
                      className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{showWhyDetail ? 'Thu gọn giải thích chuyên môn' : 'Vì sao có kết quả này?'}</span>
                    </button>

                    {showWhyDetail && (
                      <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11.5px] text-slate-600 space-y-1.5 leading-relaxed animate-in fade-in">
                        <div>
                          <strong>Quy tắc áp dụng: </strong>
                          Phân loại theo cấu trúc chuỗi giá trị rác thải đô thị v2.0 (Chuyên Chu Văn An).
                        </div>
                        <div>
                          <strong>Nhiệt trị tham khảo: </strong>
                          {selectedMaterial.heatingValueMJ > 0
                            ? `${selectedMaterial.heatingValueMJ} MJ/kg (Cơ sở khô)`
                            : '0 MJ/kg (Không có giá trị nhiệt)'}
                        </div>
                        <div>
                          <strong>Điều kiện thay đổi kết quả: </strong>
                          Nếu vật bị dính dầu mỡ hoặc lẫn hóa chất độc hại, hướng xử lý sẽ chuyển sang dòng rác còn lại hoặc thu gom chuyên biệt.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nút báo thông tin sai (Page 6) */}
                  <div className="text-right">
                    <button
                      onClick={() => setReportModalOpen(true)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                    >
                      <Flag className="w-3 h-3" />
                      Báo thông tin chưa chính xác
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Báo Thông Tin Sai */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-600" />
              Gửi phản hồi về quy tắc phân loại
            </h3>
            <p className="text-xs text-slate-500">
              Phản hồi của bạn sẽ được lưu kèm mã vật liệu để ban quản trị đối chiếu và cập nhật phiên bản quy tắc tiếp theo.
            </p>
            <textarea
              rows={3}
              placeholder="Mô tả sai sót (ví dụ: điểm thu gom đã ngừng tiếp nhận, quy cách làm sạch chưa đúng...)"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert('Đã gửi phản hồi kiểm tra. Cảm ơn đóng góp của bạn!');
                  setReportModalOpen(false);
                  setReportText('');
                }}
                className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg font-bold"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
