import { ExperimentSample, EnvironmentImage } from '../types';

import greenNatureImg from '../assets/images/moi_truong_xanh_sustainable_1791430769941.jpg';
import oceanPollutionImg from '../assets/images/o_nhiem_rac_thai_bien_1791430783222.jpg';
import labApparatusImg from '../assets/images/he_thi_nghiem_wastelab_1791430795026.jpg';
import communityRecycleImg from '../assets/images/phan_loai_rac_cong_dong_1791430824073.jpg';
import seraphinPlantImg from '../assets/images/nha_may_dien_rac_seraphin_1791446774890.jpg';

export const INITIAL_ENVIRONMENT_IMAGES: EnvironmentImage[] = [
  {
    id: 'env-1',
    title: 'Hệ thí nghiệm WasteLab thực tế',
    category: 'apparatus',
    categoryLabel: 'Hệ thí nghiệm',
    src: labApparatusImg,
    caption: 'Mô hình chuyển đổi nhiệt năng từ rác thải thành điện năng với các cảm biến kỹ thuật số.',
    detailedDescription: 'Mô hình thực nghiệm quy mô phòng thí nghiệm trang bị buồng gia nhiệt kiểm soát, đầu đo nhiệt thermocouple chuẩn K, khối thu nhiệt điện Seebeck và đồng hồ đo điện áp - dòng điện để ghi nhận công suất phát điện liên tục.',
    sourceOrCredit: 'WasteLab Project · Nhóm nghiên cứu Chuyên Chu Văn An',
    tags: ['Hệ thí nghiệm', 'Waste-to-Energy', 'Cảm biến số', 'Điện áp Seebeck']
  },
  {
    id: 'env-2',
    title: 'Hướng tới phát triển bền vững',
    category: 'nature',
    categoryLabel: 'Thiên nhiên & Bền vững',
    src: greenNatureImg,
    caption: 'Tận dụng chất thải chuyển hóa thành năng lượng sạch, giảm thiểu ô nhiễm và bảo vệ hệ sinh thái.',
    detailedDescription: 'Mục tiêu lâu dài của nghiên cứu là giảm phát thải ròng và giữ gìn các hệ sinh thái nguyên sinh. Mỗi kilogam rác thải được phân loại và xử lý hợp lý sẽ tránh được hàng mét khối khí mê-tan sinh ra tại các bãi chôn lấp lộ thiên.',
    sourceOrCredit: 'Mục tiêu SDGs số 7 (Năng lượng sạch) & số 12 (Tiêu dùng bền vững)',
    tags: ['Sinh thái', 'Năng lượng sạch', 'Phát triển bền vững', 'Bảo tồn rừng']
  },
  {
    id: 'env-3',
    title: 'Báo động ô nhiễm rác thải & đại dương',
    category: 'pollution',
    categoryLabel: 'Thực trạng ô nhiễm',
    src: oceanPollutionImg,
    caption: 'Rác thải nhựa và phế phẩm tràn lan đe dọa sinh vật biển và làm suy thoái môi trường sống.',
    detailedDescription: 'Thực trạng rác thải khó phân hủy tích tụ tại bờ biển và các bãi rác tự phát là động lực thúc đẩy nhóm nghiên cứu tìm giải pháp công nghệ: vừa giảm thể tích rác chôn lấp, vừa thu hồi được năng lượng điện hữu ích phục vụ cuộc sống.',
    sourceOrCredit: 'Tài liệu khảo sát hiện trạng môi trường ven biển',
    tags: ['Rác thải nhựa', 'Ô nhiễm biển', 'Báo động sinh thái', 'Chôn lấp']
  },
  {
    id: 'env-4',
    title: 'Phân loại rác tại nguồn & Kinh tế tuần hoàn',
    category: 'recycling',
    categoryLabel: 'Tuần hoàn & Phân loại',
    src: communityRecycleImg,
    caption: 'Hệ thống phân loại rác đô thị thông minh: vật liệu tái chế được thu hồi, phần còn lại mới xử lý nhiệt.',
    detailedDescription: 'Phân loại rác khoa học ngay từ hộ gia đình và trường học giúp phân tách giấy, kim loại, nhựa có thể tái sinh cơ học. Chỉ những thành phần rác thải không thể tái chế mới được đưa vào buồng nhiệt phân sinh năng lượng.',
    sourceOrCredit: 'Chương trình Phân loại rác thông minh trường học & đô thị',
    tags: ['Kinh tế tuần hoàn', 'Phân loại tại nguồn', 'Tái sinh vật liệu', 'Đô thị xanh']
  },
  {
    id: 'env-5',
    title: 'Nhà máy Điện rác Seraphin hiện đại (Hà Nội)',
    category: 'apparatus',
    categoryLabel: 'Nhà máy Điện rác',
    src: seraphinPlantImg,
    caption: 'Mô hình công nghiệp xử lý rác thải sinh hoạt phát điện công nghệ ghi lò hiện đại tại Hà Nội.',
    detailedDescription: 'Tư liệu khảo sát thực địa tại Nhà máy Điện rác Seraphin (Hà Nội) - công suất xử lý 1.500-2.250 tấn rác/ngày đêm, phát điện công suất 37 MW. Đây là đối tượng nghiên cứu thực tiễn giúp nhóm đối chiếu hiệu suất buồng đốt thực tế và mô hình vi mô.',
    sourceOrCredit: 'Hồ sơ khảo sát thực địa Nhà máy Điện rác Seraphin · KHKT 2026–2027',
    tags: ['Nhà máy Seraphin', 'Điện rác Hà Nội', 'Công nghệ lò ghi', '37 MW phát điện']
  }
];

export const INITIAL_SAMPLES: ExperimentSample[] = [
  {
    id: '01',
    wasteType: 'Rác hữu cơ',
    temperature: 250,
    mass: 500,
    voltage: 2.31,
    current: 0.35,
    power: 0.81,
    time: 30,
    efficiency: 71.2,
    createdAt: '2026-10-01 09:15'
  },
  {
    id: '02',
    wasteType: 'Rác hữu cơ',
    temperature: 260,
    mass: 500,
    voltage: 2.45,
    current: 0.37,
    power: 0.91,
    time: 30,
    efficiency: 73.8,
    createdAt: '2026-10-01 10:40'
  },
  {
    id: '03',
    wasteType: 'Giấy',
    temperature: 270,
    mass: 500,
    voltage: 2.61,
    current: 0.39,
    power: 1.02,
    time: 30,
    efficiency: 76.1,
    createdAt: '2026-10-02 14:20'
  },
  {
    id: '04',
    wasteType: 'Rác hỗn hợp',
    temperature: 280,
    mass: 500,
    voltage: 2.80,
    current: 0.42,
    power: 1.18,
    time: 30,
    efficiency: 79.4,
    createdAt: '2026-10-03 08:50'
  },
  {
    id: '05',
    wasteType: 'Rác hỗn hợp',
    temperature: 290,
    mass: 500,
    voltage: 2.93,
    current: 0.45,
    power: 1.32,
    time: 30,
    efficiency: 81.3,
    createdAt: '2026-10-03 11:15'
  },
  {
    id: '06',
    wasteType: 'Nhựa',
    temperature: 300,
    mass: 500,
    voltage: 3.01,
    current: 0.46,
    power: 1.38,
    time: 30,
    efficiency: 82.0,
    createdAt: '2026-10-04 15:30'
  },
  {
    id: '07',
    wasteType: 'Giấy',
    temperature: 280,
    mass: 450,
    voltage: 2.76,
    current: 0.41,
    power: 1.13,
    time: 25,
    efficiency: 78.8,
    createdAt: '2026-10-05 09:05'
  },
  {
    id: '08',
    wasteType: 'Rác hữu cơ',
    temperature: 275,
    mass: 550,
    voltage: 2.68,
    current: 0.40,
    power: 1.07,
    time: 35,
    efficiency: 77.5,
    createdAt: '2026-10-06 16:40'
  }
];

export const RESEARCH_FLOW_STEPS = [
  {
    step: '01',
    title: 'Hệ thí nghiệm',
    subtitle: 'Mô hình nhiệt hóa & phát điện',
    desc: 'Thiết kế lò phản ứng vi mô, tích hợp module nhiệt điện Seebeck để thu hồi chênh lệch nhiệt lượng.'
  },
  {
    step: '02',
    title: 'Thu thập dữ liệu',
    subtitle: 'Đo lường đa thông số',
    desc: 'Ghi nhận nhiệt độ, khối lượng rác, điện áp (V), dòng điện (A) và thời lượng phản ứng qua cảm biến.'
  },
  {
    step: '03',
    title: 'Nền tảng Website',
    subtitle: 'Số hóa & Quản lý tập trung',
    desc: 'Lưu trữ tự động, tính toán công suất thời gian thực, quản lý hình ảnh môi trường và xuất báo cáo CSV.'
  },
  {
    step: '04',
    title: 'AI phân tích',
    subtitle: 'Học máy & Tương quan',
    desc: 'Đánh giá trọng số ảnh hưởng của nhiệt độ, vật liệu; dự báo hiệu suất và ước tính độ tin cậy.'
  },
  {
    step: '05',
    title: 'Đánh giá & Ứng dụng',
    subtitle: 'Burn or Recycle',
    desc: 'Đưa ra quyết định tối ưu giữa tái chế vật liệu và thu hồi năng lượng, hỗ trợ giáo dục cộng đồng.'
  }
];
