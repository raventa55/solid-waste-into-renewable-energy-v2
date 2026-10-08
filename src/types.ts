/**
 * ĐẶC TẢ DỮ LIỆU WASTELAB 2.0 (THPT CHUYÊN CHU VĂN AN)
 * Tách bạch nhóm xử lý & trạng thái tiếp nhận, quản lý lô & sự kiện bàn giao
 */

export type AppTab = 
  | 'home'          // Trang chủ & Tổng quan (có 5 tư liệu ảnh môi trường)
  | 'classify'      // Phân loại rác (Tra cứu 28 vật liệu & Tình trạng)
  | 'receivers'     // Điểm thu gom
  | 'batches'       // Nhật ký & Lô vật liệu
  | 'energy'        // Điện rác & Mô phỏng mẻ 100kg
  | 'experiment'    // Hệ thí nghiệm Seebeck đo P = U * I
  | 'data'          // Bộ dữ liệu thực nghiệm & Xuất CSV
  | 'ai'            // AI Phân tích trọng số các yếu tố
  | 'decision'      // Công cụ Burn or Recycle?
  | 'education'     // Tìm hiểu & Khảo sát Seraphin
  | 'evaluation';   // Đánh giá kết quả & Hạn chế đề tài

// 1. Nhóm xử lý vật liệu (Vật này phù hợp hướng nào?)
export type TreatmentGroup = 
  | 'recycle'       // Tái chế
  | 'reuse'         // Dùng lại
  | 'organic'       // Hữu cơ (Ủ phân/Vi sinh)
  | 'residual'      // Rác còn lại
  | 'specialized'   // Thu gom chuyên biệt (Pin, ắc quy, bóng đèn...)
  | 'inorganic'     // Vô cơ riêng (Xà bần, gốm sứ...)
  | 'unidentified'; // Cần xác định vật liệu

// 2. Trạng thái nơi nhận (Đã bàn giao được chưa?)
export type ReceiverStatus = 
  | 'no_receiver_yet'  // Chưa chọn nơi nhận
  | 'not_found'        // Chưa tìm thấy nơi nhận phù hợp trong danh sách
  | 'needs_contact'    // Cần liên hệ nơi nhận
  | 'conditions_met'   // Đã xác nhận điều kiện tiếp nhận
  | 'partially_done'   // Đã bàn giao một phần
  | 'completed'        // Hoàn tất bàn giao
  | 'rejected';        // Từ chối tiếp nhận

// Cấp chứng cứ xác nhận
export type VerificationLevel = 
  | 'self_reported'    // Người dùng ghi nhận
  | 'verified_by_hub'; // Có xác nhận nơi nhận (Biên nhận / Tin nhắn kiểm tra)

// Chế độ dữ liệu
export type DataMode = 'real' | 'demo'; // Mặc định là 'real', chế độ 'demo' có nhãn cảnh báo rõ ràng

// Vật liệu trong danh mục
export interface WasteMaterial {
  id: string;
  name: string;
  commonName: string;
  synonyms: string[]; // Từ đồng nghĩa và tên không dấu (vd: "chai nhua", "PET", "chai nuoc")
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'organic' | 'battery_electronic' | 'other';
  categoryLabel: string;
  treatmentGroup: TreatmentGroup;
  defaultInstructions: string[];
  safetyWarning?: string;
  canReuse?: boolean;
  canRecycle?: boolean;
  heatingValueMJ: number; // Nhiệt trị tham khảo MJ/kg
  isHazardous?: boolean;
}

// Điểm thu gom
export interface CollectionHub {
  id: string;
  name: string;
  district: string; // Quận/huyện
  address: string;
  phone: string;
  acceptedMaterials: string[]; // Danh sách material_id
  conditions: string; // Điều kiện: độ sạch, đóng gói, số lượng tối thiểu
  pricing?: string; // Giá thu mua hoặc "Liên hệ nơi nhận"
  status: 'verified' | 'checking' | 'needs_recheck' | 'suspended';
  verificationSource: string; // Căn cứ xác nhận: Người kiểm tra, ngày, tin nhắn
  verifiedDate: string;
}

// Lô vật liệu của người dùng
export interface WasteBatch {
  id: string; // Mã lô duy nhất (vd: "LO-2026-001")
  name: string; // Tên gợi ý (vd: "Chai PET sạch - 08/10")
  materialId: string;
  materialName: string;
  treatmentGroup: TreatmentGroup;
  conditionDescription: string;
  unit: 'kg' | 'mon'; // kg hoặc số món chưa cân
  weightType: 'weighed' | 'estimated'; // Đã cân hoặc Ước lượng
  quantity: number; // Số lượng (kg hoặc món)
  remainingQuantity: number; // Số lượng còn lại chưa giao
  receiverId?: string;
  receiverName?: string;
  receiverStatus: ReceiverStatus;
  status: 'saving' | 'contacted' | 'appointment' | 'partial' | 'completed' | 'cancelled';
  createdAt: string;
  dataMode: DataMode;
  notes?: string;
}

// Sự kiện bàn giao thực tế
export interface HandoverEvent {
  id: string; // Mã sự kiện
  batchId: string;
  batchName: string;
  hubId: string;
  hubName: string;
  date: string;
  deliveryMethod: 'self_delivered' | 'pickup';
  offeredWeight: number; // Lượng cân trình giao (kg hoặc món)
  acceptedWeight: number; // Lượng được nhận thực tế
  rejectedWeight: number; // Lượng bị từ chối
  rejectionReason?: string;
  verificationLevel: VerificationLevel;
  evidenceCode?: string; // Số phiếu cân / Mã biên nhận / Ảnh
  dataMode: DataMode;
}

// Kịch bản điện rác (100kg kiểm tra kế thừa & người dùng tự tạo)
export interface EnergyScenario {
  id: string;
  name: string;
  totalMassKg: number; // Tổng mẻ rác đầu vào
  components: {
    name: string;
    massKg: number;
    qMJ: number; // Nhiệt trị MJ/kg
    route: TreatmentGroup;
  }[];
  materialRecoveryRate: number; // Tỷ lệ thu hồi tái chế (vd 80%)
  organicRecoveryRate: number;  // Tỷ lệ thu hồi hữu cơ (vd 70%)
  efficiencyEta: number;        // Hiệu suất chuyển đổi điện (vd 20%)
  internalUseRatio: number;     // Điện tự dùng (vd 10%)
  isPresetExample: boolean;     // Ví dụ kế thừa hay kịch bản tự tạo
  // Kết quả tính toán
  recycledMass: number;
  organicMass: number;
  thermalMass: number;
  inorganicMass: number;
  specializedMass: number;
  grossKWh: number;
  internalKWh: number;
  netKWh: number;              // Điện ròng
  theoreticalMixedKWh: number; // Mốc hỗn hợp lý thuyết nếu đốt thẳng toàn bộ
}

// Bổ sung các kiểu dữ liệu cho thư viện ảnh môi trường & thực nghiệm
export type TabType = AppTab | 'overview' | 'experiment' | 'data' | 'ai' | 'evaluation' | 'decision';

export interface EnvironmentImage {
  id: string;
  title: string;
  category: 'nature' | 'pollution' | 'recycling' | 'apparatus';
  categoryLabel: string;
  src: string;
  caption: string;
  detailedDescription: string;
  sourceOrCredit: string;
  tags: string[];
}

export interface ExperimentSample {
  id: string;
  wasteType: 'Rác hữu cơ' | 'Nhựa' | 'Giấy' | 'Vải / Dệt may' | 'Rác hỗn hợp';
  temperature: number; // °C
  mass: number; // g
  voltage: number; // V
  current: number; // A
  power: number; // W
  time: number; // phút
  efficiency: number; // %
  createdAt: string;
}

export interface DecisionResult {
  decision: string;
  type: 'recycle' | 'energy' | 'pretreatment';
  reason: string;
  materialScore: number;
  energyScore: number;
  environmentScore: number;
  recommendedAction: string;
}

