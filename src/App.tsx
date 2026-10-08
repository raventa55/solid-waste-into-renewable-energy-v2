/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * WasteLab – Burn or Recycle? (Phiên bản Đặc tả 2.0)
 * Tác giả: Tạ Giang Nam & Tô Thuỳ Trân · THPT Chuyên Chu Văn An
 */

import React, { useState, useEffect } from 'react';
import { AppTab, DataMode, WasteBatch, HandoverEvent, EnvironmentImage, ExperimentSample } from './types';
import { INITIAL_HUBS, INITIAL_MATERIALS } from './data/wasteSpecData';
import { Sidebar } from './components/Sidebar';
import { HomeTab } from './components/HomeTab';
import { ClassifyTab } from './components/ClassifyTab';
import { ReceiversTab } from './components/ReceiversTab';
import { BatchesTab } from './components/BatchesTab';
import { EnergyTab } from './components/EnergyTab';
import { EducationTab } from './components/EducationTab';
import { ExperimentTab } from './components/ExperimentTab';
import { DataTab } from './components/DataTab';
import { AIAnalysisTab } from './components/AIAnalysisTab';
import { DecisionTab } from './components/DecisionTab';
import { EvaluationTab } from './components/EvaluationTab';
import { ImageModal } from './components/ImageModal';
import { AddImageModal } from './components/AddImageModal';
import { INITIAL_ENVIRONMENT_IMAGES, INITIAL_SAMPLES } from './data/defaultData';
import { Menu, X, Leaf, Check, AlertTriangle } from 'lucide-react';

// Mẫu khởi tạo theo ví dụ minh họa chuẩn trong đặc tả (Page 8 & 20)
const SEED_BATCHES: WasteBatch[] = [
  {
    id: 'LO-2026-001',
    name: 'Chai PET sạch (5 kg) - 08/10',
    materialId: 'mat_pet_clean',
    materialName: 'Chai nhựa PET sạch',
    treatmentGroup: 'recycle',
    conditionDescription: 'Tình trạng: Sạch & Rỗng · Đã rửa và tháo nắp',
    unit: 'kg',
    weightType: 'weighed',
    quantity: 5,
    remainingQuantity: 1, // Còn lại 1 kg do bị từ chối 1 kg
    receiverId: 'hub_green_life_tay_ho',
    receiverName: 'Trạm Đổi Rác Lấy Quà Green Life (Tây Hồ)',
    receiverStatus: 'partially_done',
    status: 'partial',
    createdAt: '2026-10-08 09:30',
    dataMode: 'demo',
    notes: 'Lô minh họa: mang 5kg, được nhận 4kg, 1kg bị dính dầu mỡ'
  }
];

const SEED_HANDOVERS: HandoverEvent[] = [
  {
    id: 'BG-2026-001',
    batchId: 'LO-2026-001',
    batchName: 'Chai PET sạch (5 kg) - 08/10',
    hubId: 'hub_green_life_tay_ho',
    hubName: 'Trạm Đổi Rác Lấy Quà Green Life (Tây Hồ)',
    date: '2026-10-08',
    deliveryMethod: 'self_delivered',
    offeredWeight: 5,
    acceptedWeight: 4,
    rejectedWeight: 1,
    rejectionReason: '1 kg chai dính dầu máy không đạt tiêu chuẩn rửa sạch',
    verificationLevel: 'verified_by_hub',
    evidenceCode: 'BIEN-LAI-GL-0810-01',
    dataMode: 'demo'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [dataMode, setDataMode] = useState<DataMode>('real');
  const [userDistrict, setUserDistrict] = useState<string>('Tây Hồ, Hà Nội');

  // Lô rác & Sự kiện bàn giao
  const [batches, setBatches] = useState<WasteBatch[]>(() => {
    const saved = localStorage.getItem('wastelab_batches_v2');
    return saved ? JSON.parse(saved) : SEED_BATCHES;
  });

  const [handovers, setHandovers] = useState<HandoverEvent[]>(() => {
    const saved = localStorage.getItem('wastelab_handovers_v2');
    return saved ? JSON.parse(saved) : SEED_HANDOVERS;
  });

  // Hình ảnh môi trường: Tự động hợp nhất ảnh mẫu hệ thống và ảnh người dùng thêm, đảm bảo không bao giờ bị mất ảnh
  const [environmentImages, setEnvironmentImages] = useState<EnvironmentImage[]>(() => {
    try {
      const saved = localStorage.getItem('wastelab_env_images_v2');
      if (!saved) return INITIAL_ENVIRONMENT_IMAGES;
      const parsed: EnvironmentImage[] = JSON.parse(saved);
      
      // Lấy danh sách ID của ảnh hệ thống
      const builtInIds = new Set(INITIAL_ENVIRONMENT_IMAGES.map(img => img.id));
      // Giữ lại các ảnh do người dùng tự tải lên (nếu có)
      const customImages = Array.isArray(parsed) ? parsed.filter(img => !builtInIds.has(img.id)) : [];
      
      // Đồng bộ ảnh hệ thống với đường dẫn import thực tế mới nhất
      const mergedBuiltIn = INITIAL_ENVIRONMENT_IMAGES.map(builtIn => {
        const userVersion = Array.isArray(parsed) ? parsed.find(p => p.id === builtIn.id) : null;
        return {
          ...builtIn,
          title: userVersion?.title || builtIn.title,
          caption: userVersion?.caption || builtIn.caption,
          detailedDescription: userVersion?.detailedDescription || builtIn.detailedDescription,
          src: builtIn.src // Luôn đảm bảo đường dẫn asset ảnh hợp lệ
        };
      });
      return [...mergedBuiltIn, ...customImages];
    } catch {
      return INITIAL_ENVIRONMENT_IMAGES;
    }
  });

  const [selectedImage, setSelectedImage] = useState<EnvironmentImage | null>(null);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mẫu thực nghiệm nghiên cứu (Hệ thí nghiệm Seebeck đo P = U * I)
  const [samples, setSamples] = useState<ExperimentSample[]>(() => {
    const saved = localStorage.getItem('wastelab_samples');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLES;
  });

  // Điều hướng có tham số
  const [classifyKeyword, setClassifyKeyword] = useState<string>('');
  const [hubFilterMaterial, setHubFilterMaterial] = useState<string>('');

  // Lưu trữ dữ liệu cục bộ
  useEffect(() => {
    localStorage.setItem('wastelab_batches_v2', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('wastelab_handovers_v2', JSON.stringify(handovers));
  }, [handovers]);

  useEffect(() => {
    localStorage.setItem('wastelab_env_images_v2', JSON.stringify(environmentImages));
  }, [environmentImages]);

  useEffect(() => {
    localStorage.setItem('wastelab_samples', JSON.stringify(samples));
  }, [samples]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  // Thêm mẫu thí nghiệm mới (Seebeck)
  const handleSaveSample = (newSampleData: Omit<ExperimentSample, 'id' | 'createdAt'>) => {
    const nextId = String(samples.length + 1).padStart(2, '0');
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newSample: ExperimentSample = {
      id: nextId,
      ...newSampleData,
      createdAt
    };

    setSamples([newSample, ...samples]);
    showToast(`Đã lưu kết quả đo mẫu thí nghiệm #${nextId}!`);
  };

  const handleDeleteSample = (id: string) => {
    setSamples(samples.filter(s => s.id !== id));
    showToast(`Đã xóa mẫu thí nghiệm #${id}`);
  };

  const handleResetSamples = () => {
    setSamples(INITIAL_SAMPLES);
    showToast('Đã khôi phục dữ liệu mẫu thí nghiệm mặc định');
  };

  // Thêm lô mới
  const handleAddBatch = (newBatchData: Omit<WasteBatch, 'id' | 'createdAt'>) => {
    const newId = `LO-2026-${String(batches.length + 1).padStart(3, '0')}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBatch: WasteBatch = {
      id: newId,
      ...newBatchData,
      createdAt
    };

    setBatches([newBatch, ...batches]);
    showToast(`Đã lưu lô vật liệu ${newId} vào kho của bạn!`);
  };

  // Ghi bàn giao thực tế (Xử lý trừ số lượng còn lại của lô)
  const handleRecordHandover = (newEventData: Omit<HandoverEvent, 'id'>) => {
    const newEventId = `BG-2026-${String(handovers.length + 1).padStart(3, '0')}`;
    const newEvent: HandoverEvent = {
      id: newEventId,
      ...newEventData
    };

    // Cập nhật lô gốc: giảm remainingQuantity bằng số lượng đã bàn giao thành công
    setBatches(batches.map(b => {
      if (b.id === newEventData.batchId) {
        const remaining = Math.max(0, Number((b.remainingQuantity - newEventData.acceptedWeight).toFixed(2)));
        return {
          ...b,
          remainingQuantity: remaining,
          status: remaining === 0 ? 'completed' : 'partial',
          receiverStatus: remaining === 0 ? 'completed' : 'partially_done'
        };
      }
      return b;
    }));

    setHandovers([newEvent, ...handovers]);
    showToast(`Đã ghi nhận bàn giao ${newEventId} thành công (+${newEventData.acceptedWeight} kg)!`);
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(batches.filter(b => b.id !== id));
    showToast(`Đã xóa lô ${id}`);
  };

  const handleDeleteHandover = (id: string) => {
    setHandovers(handovers.filter(h => h.id !== id));
    showToast(`Đã xóa sự kiện bàn giao ${id}`);
  };

  const handleAddEnvironmentImage = (newImage: EnvironmentImage) => {
    setEnvironmentImages([newImage, ...environmentImages]);
    showToast(`Đã thêm ảnh "${newImage.title}" vào mục Tổng quan!`);
  };

  const navigateToTab = (tab: AppTab, keyword?: string) => {
    if (keyword !== undefined) {
      setClassifyKeyword(keyword);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHubsWithMaterial = (materialId: string) => {
    setHubFilterMaterial(materialId);
    setCurrentTab('receivers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeBatchCount = batches.filter(b => b.dataMode === dataMode && b.remainingQuantity > 0).length;

  return (
    <div className="flex h-screen bg-[#f4f7f5] text-[#18352a] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => navigateToTab(tab)}
          dataMode={dataMode}
          onToggleDataMode={(mode) => {
            setDataMode(mode);
            showToast(`Đã chuyển sang chế độ: ${mode === 'real' ? 'Dữ liệu thật' : 'Dữ liệu minh họa'}`);
          }}
          activeBatchCount={activeBatchCount}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-[#09291f] h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-emerald-800/40 text-white">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-base">WasteLab AI v2.0</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  navigateToTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                dataMode={dataMode}
                onToggleDataMode={setDataMode}
                activeBatchCount={activeBatchCount}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#09291f] text-white border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-emerald-200 hover:text-white rounded-lg"
              aria-label="Mở Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-bold text-sm tracking-tight">
              Waste<span className="text-emerald-400">Lab</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              dataMode === 'real' ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-900'
            }`}>
              {dataMode === 'real' ? 'THẬT' : 'MINH HỌA'}
            </span>
          </div>
        </header>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            {currentTab === 'home' && (
              <HomeTab
                dataMode={dataMode}
                userDistrict={userDistrict}
                onChangeDistrict={setUserDistrict}
                batches={batches}
                handovers={handovers}
                environmentImages={environmentImages}
                onNavigateTab={navigateToTab}
                onSelectImage={(img) => setSelectedImage(img)}
                onOpenAddImageModal={() => setIsAddImageModalOpen(true)}
              />
            )}

            {currentTab === 'classify' && (
              <ClassifyTab
                initialKeyword={classifyKeyword}
                dataMode={dataMode}
                userDistrict={userDistrict}
                onSaveBatch={handleAddBatch}
                onNavigateToHubs={navigateToHubsWithMaterial}
              />
            )}

            {currentTab === 'receivers' && (
              <ReceiversTab
                filterMaterialId={hubFilterMaterial}
                userDistrict={userDistrict}
              />
            )}

            {currentTab === 'batches' && (
              <BatchesTab
                batches={batches}
                handovers={handovers}
                dataMode={dataMode}
                onAddBatch={handleAddBatch}
                onRecordHandover={handleRecordHandover}
                onDeleteBatch={handleDeleteBatch}
                onDeleteHandover={handleDeleteHandover}
              />
            )}

            {currentTab === 'energy' && (
              <EnergyTab />
            )}

            {currentTab === 'experiment' && (
              <ExperimentTab onSaveSample={handleSaveSample} />
            )}

            {currentTab === 'data' && (
              <DataTab
                samples={samples}
                onDeleteSample={handleDeleteSample}
                onResetData={handleResetSamples}
              />
            )}

            {currentTab === 'ai' && (
              <AIAnalysisTab samples={samples} />
            )}

            {currentTab === 'decision' && (
              <DecisionTab />
            )}

            {currentTab === 'education' && (
              <EducationTab />
            )}

            {currentTab === 'evaluation' && (
              <EvaluationTab />
            )}
          </div>
        </main>
      </div>

      {/* Lightbox Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Add New Environment Image Modal */}
      <AddImageModal
        isOpen={isAddImageModalOpen}
        onClose={() => setIsAddImageModalOpen(false)}
        onAddImage={handleAddEnvironmentImage}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#09291f] text-white shadow-xl border border-emerald-600/40 text-xs font-medium">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
