import { WasteMaterial, CollectionHub, EnergyScenario } from '../types';

// Danh mục 28 vật liệu ban đầu với từ đồng nghĩa và tên không dấu
export const INITIAL_MATERIALS: WasteMaterial[] = [
  {
    id: 'mat_pet_clean',
    name: 'Chai nhựa PET sạch',
    commonName: 'Chai nước lọc, chai nước ngọt trong suốt',
    synonyms: ['chai pet', 'chai nuoc', 'chai nhua', 'chai pepsi', 'chai aquafina', 'pet'],
    category: 'plastic',
    categoryLabel: 'Nhựa',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Tráng sơ bằng nước để hết cặn ngọt',
      'Tháo nắp và vòng cổ chai (nắp làm bằng nhựa HDPE/PP khác)',
      'Bẹp dẹp thân chai để tiết kiệm thể tích lưu trữ'
    ],
    canRecycle: true,
    heatingValueMJ: 22,
    isHazardous: false
  },
  {
    id: 'mat_pet_dirty',
    name: 'Chai nhựa PET dính dầu mỡ / hóa chất',
    commonName: 'Chai dầu ăn, chai nước rửa chén, chai nhớt',
    synonyms: ['chai dau an', 'chai hoa chat', 'chai nhot', 'chai rua bat'],
    category: 'plastic',
    categoryLabel: 'Nhựa',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Khó tái chế cơ học do nhiễm bẩn sâu',
      'Đóng chặt nắp, bỏ vào thùng rác sinh hoạt còn lại',
      'Chỉ đưa vào thu hồi năng lượng nếu cơ sở địa phương tiếp nhận'
    ],
    safetyWarning: 'Không dùng lại để đựng thực phẩm hoặc nước uống.',
    canRecycle: false,
    heatingValueMJ: 20,
    isHazardous: false
  },
  {
    id: 'mat_hdpe',
    name: 'Can / Chai nhựa HDPE',
    commonName: 'Chai dầu gội, sữa tắm, can nước giặt',
    synonyms: ['chai dau goi', 'can nuoc giat', 'chai hdpe', 'nhua hdpe', 'can nhua'],
    category: 'plastic',
    categoryLabel: 'Nhựa',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Dùng hết dung dịch bên trong',
      'Tráng sạch bọt xà phòng',
      'Gom chung với lô nhựa tái chế giá trị cao'
    ],
    canRecycle: true,
    heatingValueMJ: 40,
    isHazardous: false
  },
  {
    id: 'mat_soft_plastic',
    name: 'Túi nilon sạch (LDPE / LLDPE)',
    commonName: 'Túi quai xách siêu thị, bọc chống sốc',
    synonyms: ['tui nilon', 'bich nilon', 'tui xop', 'mang boc', 'bong bong khi', 'tui pe'],
    category: 'plastic',
    categoryLabel: 'Nhựa',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Giữ sạch và khô ráo, không dính thức ăn thừa',
      'Cuộn ép chặt vào một túi lớn hơn',
      'Chuyển cho điểm thu gom tái chế màng film'
    ],
    canRecycle: true,
    heatingValueMJ: 38,
    isHazardous: false
  },
  {
    id: 'mat_foam_ps',
    name: 'Hộp xốp / Mút xốp (PS)',
    commonName: 'Hộp cơm xốp, thùng xốp đựng đá',
    synonyms: ['hop xop', 'thung xop', 'mut xop', 'hop com xop', 'xop eps'],
    category: 'plastic',
    categoryLabel: 'Nhựa',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Hộp xốp dính dầu mỡ không tái chế cơ học được',
      'Bẻ nhỏ bỏ vào túi rác còn lại của địa phương',
      'Thùng xốp sạch nguyên vẹn nên dùng lại để trồng cây hoặc giữ nhiệt'
    ],
    canReuse: true,
    canRecycle: false,
    heatingValueMJ: 35,
    isHazardous: false
  },
  {
    id: 'mat_carton',
    name: 'Bìa carton / Thùng giấy',
    commonName: 'Thùng carton chuyển hàng, bìa các tông',
    synonyms: ['thung carton', 'bia carton', 'hop giay', 'carton', 'thung giay'],
    category: 'paper',
    categoryLabel: 'Giấy',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Gỡ bỏ băng dính nhựa và đinh ghim kim loại',
      'Gấp phẳng thùng carton để tiết kiệm diện tích',
      'Giữ khô ráo tuyệt đối, không để dính nước mưa'
    ],
    canRecycle: true,
    heatingValueMJ: 16,
    isHazardous: false
  },
  {
    id: 'mat_paper_white',
    name: 'Giấy văn phòng / Sách vở học sinh',
    commonName: 'Giấy A4, vở viết cũ, sách báo cũ',
    synonyms: ['giay a4', 'vo cu', 'sach cu', 'bao cu', 'giay trang', 'giay in'],
    category: 'paper',
    categoryLabel: 'Giấy',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Loại bỏ bìa nilon và lò xo nhựa/sắt',
      'Xếp phẳng theo cọc và buộc dây gọn gàng',
      'Sách truyện còn tốt nên ưu tiên quyên góp dùng lại'
    ],
    canReuse: true,
    canRecycle: true,
    heatingValueMJ: 14,
    isHazardous: false
  },
  {
    id: 'mat_tetra_pak',
    name: 'Vỏ hộp sữa nhiều lớp (Tetra Pak)',
    commonName: 'Vỏ hộp sữa chua uống, sữa tươi giấy',
    synonyms: ['hop sua', 'vo hop sua', 'tetra pak', 'hop sua giay', 'hop milo'],
    category: 'paper',
    categoryLabel: 'Giấy nhiều lớp',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Bóc 4 tai hộp sữa và ấn bẹp phẳng',
      'Cắt góc tráng sạch bên trong hoặc cắm ống hút vào lòng hộp',
      'Mang đến trạm thu gom vỏ hộp sữa chuyên dụng'
    ],
    canRecycle: true,
    heatingValueMJ: 15,
    isHazardous: false
  },
  {
    id: 'mat_paper_dirty',
    name: 'Giấy ăn / Giấy vệ sinh đã sử dụng',
    commonName: 'Khăn giấy ướt, giấy lau dầu mỡ',
    synonyms: ['giay an', 'giay ve sinh', 'khan giay', 'giay lau'],
    category: 'paper',
    categoryLabel: 'Giấy',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Sợi cellulose đã nát và chứa vi khuẩn/dầu',
      'Bỏ trực tiếp vào thùng rác sinh hoạt thông thường',
      'Tuyệt đối không bỏ lẫn vào túi giấy tái chế'
    ],
    canRecycle: false,
    heatingValueMJ: 8,
    isHazardous: false
  },
  {
    id: 'mat_aluminum_can',
    name: 'Lon nhôm đồ uống',
    commonName: 'Lon coca, lon bia, lon nước ngọt',
    synonyms: ['lon bia', 'lon nuoc ngot', 'lon nhom', 'vo lon', 'can nhom'],
    category: 'metal',
    categoryLabel: 'Kim loại',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Dốc hết nước thừa bên trong lon',
      'Giữ lại khoen bật gắn trên lon',
      'Bẹp dẹp lon để gom thành lô kim loại giá trị cao'
    ],
    canRecycle: true,
    heatingValueMJ: 0,
    isHazardous: false
  },
  {
    id: 'mat_steel_can',
    name: 'Hộp thiếc / Sắt tây',
    commonName: 'Hộp sữa đặc, hộp cá hộp, lon sữa bột',
    synonyms: ['hop sua dac', 'hop ca hop', 'lon sua bot', 'hop thiec', 'vo hop sat'],
    category: 'metal',
    categoryLabel: 'Kim loại',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Tráng sạch cặn thức ăn hoặc dầu bảo quản',
      'Cẩn thận mép cắt sắc nhọn, gập nắp vào trong',
      'Tập kết bàn giao cho người thu mua ve chai/điểm thu gom'
    ],
    canRecycle: true,
    heatingValueMJ: 0,
    isHazardous: false
  },
  {
    id: 'mat_glass_bottle',
    name: 'Chai / Lọ thủy tinh nguyên vẹn',
    commonName: 'Chai nước mắm, chai bia thủy tinh, hũ mứt',
    synonyms: ['chai thuy tinh', 'hu thuy tinh', 'lo thuy tinh', 'chai bia thuy tinh'],
    category: 'glass',
    categoryLabel: 'Thủy tinh',
    treatmentGroup: 'reuse',
    defaultInstructions: [
      'Ưu tiên dùng lại đựng gia vị, ngâm thực phẩm',
      'Rửa sạch, tháo nút cao su hoặc nắp sắt',
      'Xếp đứng trong thùng carton tránh va đập vỡ'
    ],
    canReuse: true,
    canRecycle: true,
    heatingValueMJ: 0,
    isHazardous: false
  },
  {
    id: 'mat_broken_glass',
    name: 'Thủy tinh vỡ / Mảnh sành sứ',
    commonName: 'Mảnh bát vỡ, gương vỡ, kính cửa vỡ',
    synonyms: ['thuy tinh vo', 'guong vo', 'bat vo', 'chen vo', 'manh sanh'],
    category: 'glass',
    categoryLabel: 'Thủy tinh & Vô cơ',
    treatmentGroup: 'inorganic',
    defaultInstructions: [
      'Gói nhiều lớp báo dày hoặc cho vào hộp nhựa cứng',
      'Ghi nhãn cảnh báo "MẢNH VỠ NGUY HIỂM" bên ngoài',
      'Bàn giao riêng cho công nhân môi trường để tránh tai nạn lao động'
    ],
    safetyWarning: 'Mảnh vỡ sắc nhọn có nguy cơ gây thương tích nghiêm trọng cho người thu gom.',
    canRecycle: false,
    heatingValueMJ: 0,
    isHazardous: true
  },
  {
    id: 'mat_battery',
    name: 'Pin đã qua sử dụng (Pin AA, AAA, Cúc áo)',
    commonName: 'Pin con thỏ, pin remote, pin đồng hồ',
    synonyms: ['pin', 'pin con tho', 'pin aa', 'pin aaa', 'pin tieu', 'pin cu', 'pin remote'],
    category: 'battery_electronic',
    categoryLabel: 'Pin & Điện tử',
    treatmentGroup: 'specialized',
    defaultInstructions: [
      'Dán băng dính vào 2 đầu cực của pin để tránh chập cháy',
      'Đựng trong lọ nhựa/hộp kín khô ráo để nơi cao ráo',
      'Mang đến điểm thu gom pin chuyên dụng tại UBND hoặc siêu thị'
    ],
    safetyWarning: 'CHỨA KIM LOẠI NẶNG (Chì, Thủy ngân, Cadimi). Tuyệt đối không vứt vào thùng rác chung và không được tự ý đốt!',
    canRecycle: false,
    heatingValueMJ: 0,
    isHazardous: true
  },
  {
    id: 'mat_e_waste',
    name: 'Rác điện tử nhỏ (Điện thoại cũ, sạc, tai nghe)',
    commonName: 'Dây cáp hỏng, bàn phím cũ, củ sạc, bo mạch',
    synonyms: ['dien thoai cu', 'day sac', 'tai nghe', 'e waste', 'chuot hong', 'bo mach'],
    category: 'battery_electronic',
    categoryLabel: 'Pin & Điện tử',
    treatmentGroup: 'specialized',
    defaultInstructions: [
      'Xóa sạch dữ liệu cá nhân nếu thiết bị còn khởi động',
      'Không đập vỡ màn hình hoặc tự ý tháo pin phồng',
      'Chuyển giao cho đơn vị thu hồi rác điện tử có cấp phép'
    ],
    canRecycle: true,
    heatingValueMJ: 5,
    isHazardous: true
  },
  {
    id: 'mat_organic_food',
    name: 'Thực phẩm thừa / Rác nhà bếp dễ phân hủy',
    commonName: 'Cuống rau, vỏ trái cây, bã trà, bã cà phê',
    synonyms: ['thuc pham thua', 'rac nha bep', 'vo hoa qua', 'ba ca phe', 'ba tra', 'rau cu'],
    category: 'organic',
    categoryLabel: 'Rác hữu cơ',
    treatmentGroup: 'organic',
    defaultInstructions: [
      'Gạn kiệt nước thừa để giảm trọng lượng và mùi hôi',
      'Ủ làm phân compost bón cây hoặc nuôi trùn quế',
      'Giao cho tuyến thu gom hữu cơ riêng nếu địa phương có phân loại'
    ],
    canReuse: true,
    canRecycle: false,
    heatingValueMJ: 4,
    isHazardous: false
  },
  {
    id: 'mat_organic_bones',
    name: 'Xương động vật to / Vỏ nghêu sò cứng',
    commonName: 'Xương bò, xương heo lớn, vỏ hàu, mai cua',
    synonyms: ['xuong bo', 'xuong heo', 'vo ngao', 'vo so', 'vo oc', 'vo hau'],
    category: 'organic',
    categoryLabel: 'Rác hữu cơ khó phân hủy',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Cấu trúc canxi cứng khó ủ compost nhanh ở quy mô gia đình',
      'Bỏ vào túi rác sinh hoạt còn lại của địa phương',
      'Tránh làm kẹt máy nghiền hữu cơ'
    ],
    canRecycle: false,
    heatingValueMJ: 2,
    isHazardous: false
  },
  {
    id: 'mat_textile_good',
    name: 'Quần áo cũ còn nguyên vẹn',
    commonName: 'Áo phông, quần jean, áo khoác còn mặc được',
    synonyms: ['quan ao cu', 'ao cu', 'do tu thien', 'quan ao quyen gop'],
    category: 'other',
    categoryLabel: 'Dệt may',
    treatmentGroup: 'reuse',
    defaultInstructions: [
      'Giặt sạch sẽ và phơi khô thơm tho',
      'Gấp gọn phân loại theo lứa tuổi (trẻ em, người lớn)',
      'Quyên góp cho các nhóm thiện nguyện hoặc tủ đồ từ thiện'
    ],
    canReuse: true,
    heatingValueMJ: 18,
    isHazardous: false
  },
  {
    id: 'mat_textile_rag',
    name: 'Vải vụn / Quần áo rách nát',
    commonName: 'Giẻ lau rách, vải vụn may mặc, tất rách',
    synonyms: ['vai vun', 'gie lau', 'quan ao rach', 'vai phe'],
    category: 'other',
    categoryLabel: 'Dệt may',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Cắt làm giẻ lau máy móc đồ đạc trước khi thải bỏ',
      'Vải sợi tổng hợp có nhiệt trị tốt cho thu hồi năng lượng công nghiệp',
      'Bàn giao theo tuyến thu gom rác còn lại'
    ],
    canReuse: true,
    heatingValueMJ: 19,
    isHazardous: false
  },
  {
    id: 'mat_light_bulb_cfl',
    name: 'Bóng đèn huỳnh quang / Đèn tuýp hỏng',
    commonName: 'Bóng đèn chữ U, bóng tuýp néon, bóng compact',
    synonyms: ['bong den', 'bong huynh quang', 'den compact', 'den tuyp', 'den neon'],
    category: 'battery_electronic',
    categoryLabel: 'Chất thải nguy hại',
    treatmentGroup: 'specialized',
    defaultInstructions: [
      'CHỨA HƠI THỦY NGÂN: Cẩn thận không làm vỡ bóng',
      'Cho bóng hỏng vào vỏ hộp giấy ban đầu để bảo vệ',
      'Bàn giao cho điểm tiếp nhận chất thải nguy hại đô thị'
    ],
    safetyWarning: 'Nếu bóng vỡ: Mở cửa thông gió ngay, không dùng máy hút bụi, dùng bìa cứng hót sạch mảnh và lau bằng khăn ẩm.',
    isHazardous: true,
    heatingValueMJ: 0
  },
  {
    id: 'mat_spray_can',
    name: 'Bình xịt khí nén (Bình sơn, bình xịt muỗi, bình gas mini)',
    commonName: 'Bình xịt côn trùng, bình xịt tóc, bình gas du lịch',
    synonyms: ['binh xit', 'binh gas mini', 'binh xit muoi', 'binh son xit'],
    category: 'metal',
    categoryLabel: 'Kim loại có áp suất',
    treatmentGroup: 'specialized',
    defaultInstructions: [
      'NGUY CƠ CHÁY NỔ: Tuyệt đối không đập bẹp hay ném vào lửa',
      'Xịt kiệt khí ra ngoài nơi thoáng gió',
      'Bàn giao riêng cho điểm thu gom kim loại có cảnh báo áp suất'
    ],
    safetyWarning: 'Có thể phát nổ gây cháy trong lò đốt rác nếu còn tồn dư khí hóa lỏng!',
    isHazardous: true,
    heatingValueMJ: 0
  },
  {
    id: 'mat_medicine_expired',
    name: 'Thuốc men hết hạn / Vỉ thuốc cũ',
    commonName: 'Thuốc kháng sinh hết đát, siro ho, thuốc viên',
    synonyms: ['thuoc het han', 'vi thuoc', 'thuoc tay cu', 'duoc pham'],
    category: 'other',
    categoryLabel: 'Dược phẩm',
    treatmentGroup: 'specialized',
    defaultInstructions: [
      'Không xả thuốc xuống bồn cầu vì làm ô nhiễm nguồn nước ngầm',
      'Giữ nguyên vỉ hoặc chai lọ đóng kín',
      'Bàn giao tại trạm y tế phường hoặc thùng thu hồi dược phẩm của nhà thuốc'
    ],
    safetyWarning: 'Tuyệt đối không để trẻ nhỏ tiếp xúc.',
    isHazardous: true,
    heatingValueMJ: 0
  },
  {
    id: 'mat_cooking_oil',
    name: 'Dầu ăn thừa đã qua sử dụng',
    commonName: 'Dầu chiên rán thừa, mỡ heo cũ',
    synonyms: ['dau an thua', 'dau an cu', 'dau chien ran', 'mo dong vat'],
    category: 'organic',
    categoryLabel: 'Chất lỏng hữu cơ',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Lọc bỏ cặn thức ăn cháy đen',
      'Rót vào chai nhựa đậy chặt nắp',
      'Không đổ xuống cống thoát nước vì gây tắc nghẽn mỡ (fatberg)',
      'Giao cho đơn vị thu mua sản xuất nhiên liệu sinh học Biodiesel'
    ],
    canRecycle: true,
    heatingValueMJ: 39,
    isHazardous: false
  },
  {
    id: 'mat_ceramic',
    name: 'Gốm sứ / Gạch vữa phế thải',
    commonName: 'Chén đĩa mẻ, chậu hoa vỡ, gạch ốp tường',
    synonyms: ['chen bat gom', 'chau hoa vo', 'gach men', 'xa ban'],
    category: 'other',
    categoryLabel: 'Chất thải vô cơ trơ',
    treatmentGroup: 'inorganic',
    defaultInstructions: [
      'Gốm sứ trơ nhiệt không cháy và không tái chế thành thủy tinh được',
      'Tập kết cùng phế thải xây dựng để san lấp hạ tầng',
      'Không trộn lẫn vào túi rác sinh hoạt có thể tích lớn'
    ],
    canRecycle: false,
    heatingValueMJ: 0,
    isHazardous: false
  },
  {
    id: 'mat_mask_sanitary',
    name: 'Khẩu trang y tế / Băng vệ sinh / Tã bỉm',
    commonName: 'Khẩu trang dùng 1 lần, bỉm trẻ em',
    synonyms: ['khau trang', 'khau trang y te', 'bim', 'ta giay', 'bang ve sinh'],
    category: 'other',
    categoryLabel: 'Rác vệ sinh cá nhân',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Chất thải có nguy cơ lây nhiễm vi sinh vật',
      'Gấp kín cuộn lại và cho vào túi nilon buộc chặt miệng',
      'Đưa vào tuyến rác sinh hoạt còn lại để xử lý nhiệt tiêu hủy mầm bệnh'
    ],
    safetyWarning: 'Phải buộc kín túi đựng, không vứt bừa bãi ra môi trường.',
    canRecycle: false,
    heatingValueMJ: 16,
    isHazardous: true
  },
  {
    id: 'mat_coconut_shell',
    name: 'Vỏ sọ dừa / Cành cây gỗ khô',
    commonName: 'Gáo dừa, bã mía, cành củi khô tỉa cành',
    synonyms: ['so dua', 'gao dua', 'ba mia', 'cui kho', 'canh cay'],
    category: 'organic',
    categoryLabel: 'Sinh khối gỗ cứng',
    treatmentGroup: 'organic',
    defaultInstructions: [
      'Có thể chặt nhỏ phơi khô làm chất đốt lò sinh khối rất tốt',
      'Gáo dừa có thể dùng làm than hoạt tính gáo dừa',
      'Hoặc nghiền dăm để ủ phủ đất giữ ẩm cho cây'
    ],
    canReuse: true,
    heatingValueMJ: 18,
    isHazardous: false
  },
  {
    id: 'mat_composite_packaging',
    name: 'Bao bì màng nhôm phức hợp (Túi snack, vỏ kẹo)',
    commonName: 'Túi bim bim, túi bánh kẹo, gói mì tôm',
    synonyms: ['tui bim bim', 'tui snack', 'vo keo', 'goi mi tom', 'mang ghep'],
    category: 'plastic',
    categoryLabel: 'Nhựa màng ghép',
    treatmentGroup: 'residual',
    defaultInstructions: [
      'Nhiều lớp nhựa và nhôm mỏng ép dính không thể bóc tách cơ học',
      'Không có đơn vị tái chế cơ học tiếp nhận',
      'Đưa vào dòng rác còn lại để chuyển tuyến thu hồi nhiệt điện'
    ],
    canRecycle: false,
    heatingValueMJ: 24,
    isHazardous: false
  },
  {
    id: 'mat_rubber_tire',
    name: 'Săm lốp cao su cũ',
    commonName: 'Lốp xe máy hỏng, săm xe đạp rách',
    synonyms: ['lop xe', 'sam xe', 'lop xe may', 'cao su cu'],
    category: 'other',
    categoryLabel: 'Cao su',
    treatmentGroup: 'recycle',
    defaultInstructions: [
      'Dùng lại làm xích đu, chậu trồng hoa hoặc đệm chống va đập tàu bè',
      'Giao cho xưởng tái chế cao su thành hạt cao su sân bóng',
      'TUYỆT ĐỐI KHÔNG ĐỐT LỘ THIÊN vì sinh khí độc dioxin và muội than đen'
    ],
    safetyWarning: 'Không đốt lộ thiên ngoài trời!',
    canReuse: true,
    canRecycle: true,
    heatingValueMJ: 32,
    isHazardous: true
  }
];

// Danh sách điểm thu gom thực tế có điều kiện, căn cứ xác nhận (Hà Nội)
export const INITIAL_HUBS: CollectionHub[] = [
  {
    id: 'hub_green_life_tay_ho',
    name: 'Trạm Đổi Rác Lấy Quà Green Life (Tây Hồ)',
    district: 'Tây Hồ, Hà Nội',
    address: 'Số 12 ngõ 89 Lạc Long Quân, P. Nghĩa Đô, Q. Cầu Giấy (giáp Tây Hồ)',
    phone: '0981 234 567',
    acceptedMaterials: ['mat_pet_clean', 'mat_carton', 'mat_paper_white', 'mat_aluminum_can', 'mat_tetra_pak', 'mat_battery'],
    conditions: 'Rác phải được rửa sạch, phơi khô ráo và phân loại riêng theo từng bao tải. Không nhận rác dính dầu mỡ.',
    pricing: 'Đổi lấy sen đá, cây cảnh mini hoặc đồ dùng thân thiện môi trường',
    status: 'verified',
    verificationSource: 'Nhóm nghiên cứu khảo sát trực tiếp tại điểm ngày 02/10/2026',
    verifiedDate: '2026-10-02'
  },
  {
    id: 'hub_ubnd_pin_thuy_khue',
    name: 'Thùng Thu Gom Pin UBND Phường Thụy Khuê',
    district: 'Tây Hồ, Hà Nội',
    address: 'Trụ sở UBND Phường Thụy Khuê, số 157 Thụy Khuê, Q. Tây Hồ',
    phone: '024 3847 1234',
    acceptedMaterials: ['mat_battery'],
    conditions: 'Chỉ tiếp nhận pin cúc áo, pin tiểu AA/AAA gia dụng. Dán băng dính 2 đầu cực. Bỏ trực tiếp vào thùng kim loại màu đỏ tại sảnh tiếp dân.',
    pricing: 'Tiếp nhận phi lợi nhuận',
    status: 'verified',
    verificationSource: 'Biên bản ghi nhận điểm thu gom công cộng UBND Phường',
    verifiedDate: '2026-09-28'
  },
  {
    id: 'hub_tetra_pak_vinmart_xuan_la',
    name: 'Thùng Thu Hồi Vỏ Hộp Sữa Tetra Pak (WinMart Xuân La)',
    district: 'Tây Hồ, Hà Nội',
    address: 'Siêu thị WinMart, Tòa chung cư Kosmo Tây Hồ, Xuân La',
    phone: '024 7108 8899',
    acceptedMaterials: ['mat_tetra_pak'],
    conditions: 'Hộp sữa đã bóc 4 tai, ấn dẹp và tráng sạch, cắm ống hút vào trong. Không nhận hộp sữa còn thừa nước thiu chua.',
    pricing: 'Chương trình trách nhiệm mở rộng nhà sản xuất (EPR)',
    status: 'verified',
    verificationSource: 'Xác nhận theo danh mục điểm thu hồi của Liên minh Tái chế Bao bì PRO Việt Nam',
    verifiedDate: '2026-09-15'
  },
  {
    id: 'hub_vietnam_recycle_cau_giay',
    name: 'Điểm Thu Hồi Rác Điện Tử Vietnam Recycles',
    district: 'Cầu Giấy, Hà Nội',
    address: 'Chi cục Bảo vệ Môi trường Hà Nội, số 17 Trung Yên 3, Cầu Giấy',
    phone: '0909 999 123',
    acceptedMaterials: ['mat_battery', 'mat_e_waste', 'mat_light_bulb_cfl'],
    conditions: 'Thiết bị điện tử cũ hỏng, bóng đèn, pin. Giữ nguyên trạng, không đập vỡ, không đốt cháy.',
    pricing: 'Tiếp nhận xử lý chuẩn quốc tế miễn phí',
    status: 'verified',
    verificationSource: 'Chương trình Vietnam Recycles được Bộ TN&MT xác nhận',
    verifiedDate: '2026-08-20'
  },
  {
    id: 'hub_ve_chai_yen_phu',
    name: 'Đại lý Thu mua Phế liệu Cô Lan (Yên Phụ)',
    district: 'Tây Hồ, Hà Nội',
    address: 'Ngõ 200 Âu Cơ, P. Yên Phụ, Q. Tây Hồ',
    phone: '0912 345 678',
    acceptedMaterials: ['mat_pet_clean', 'mat_hdpe', 'mat_carton', 'mat_paper_white', 'mat_aluminum_can', 'mat_steel_can', 'mat_glass_bottle'],
    conditions: 'Nhận từ 2kg trở lên. Giấy khô, lon bẹp, chai nhựa sạch.',
    pricing: 'Theo giá thị trường phế liệu hàng ngày (Lon nhôm ~25.000đ/kg, Giấy carton ~2.500đ/kg)',
    status: 'verified',
    verificationSource: 'Tin nhắn đối soát và phỏng vấn trực tiếp của học sinh',
    verifiedDate: '2026-10-04'
  }
];

// Kịch bản kiểm tra kế thừa chuẩn 100 kg (Đặc tả trang 12)
export const PRESET_100KG_SCENARIO: EnergyScenario = {
  id: 'scenario_preset_100kg',
  name: 'Mẻ kiểm tra kế thừa chuẩn (100 kg mẫu gốc)',
  totalMassKg: 100,
  components: [
    { name: 'Nhựa các loại', massKg: 25, qMJ: 15, route: 'recycle' },
    { name: 'Giấy & carton', massKg: 8, qMJ: 0, route: 'recycle' },
    { name: 'Kim loại lon nhôm/sắt', massKg: 7, qMJ: 0, route: 'recycle' },
    { name: 'Rác hữu cơ', massKg: 35, qMJ: 4, route: 'organic' },
    { name: 'Rác sinh hoạt còn lại', massKg: 20, qMJ: 12, route: 'residual' },
    { name: 'Pin & chuyên biệt', massKg: 5, qMJ: 0, route: 'specialized' }
  ],
  materialRecoveryRate: 80, // 80%
  organicRecoveryRate: 70,  // 70%
  efficiencyEta: 20,        // 20%
  internalUseRatio: 10,     // 10%
  isPresetExample: true,
  // Giá trị tính toán đúng từng chữ số theo Trang 12 của ĐẶC TẢ
  recycledMass: 32.0,       // 32 kg tái chế
  organicMass: 24.5,        // 24.5 kg hữu cơ
  thermalMass: 35.5,        // 35.5 kg tuyến nhiệt
  inorganicMass: 3.0,       // 3 kg vô cơ khác
  specializedMass: 5.0,     // 5 kg chuyên biệt
  grossKWh: 19.83,
  internalKWh: 1.98,
  netKWh: 17.85,            // Điện ròng 17.85 kWh
  theoreticalMixedKWh: 37.75 // Mốc hỗn hợp lý thuyết 37.75 kWh
};

// Hàm tính toán kịch bản điện rác tuân thủ công thức:
// Q = Σ(m_i * q_i)
// E_phát = (Q * η) / 3.6
// E_ròng = E_phát - E_tự_dùng
export function calculateScenario(
  totalMass: number,
  composition: { name: string; massKg: number; qMJ: number; route: string }[],
  materialRecoveryPct: number,
  organicRecoveryPct: number,
  etaPct: number,
  internalUsePct: number
) {
  // 1. Phân bổ các dòng vật liệu
  let recycled = 0;
  let organic = 0;
  let thermal = 0;
  let inorganic = 0;
  let specialized = 0;

  composition.forEach((item) => {
    if (item.route === 'recycle') {
      const rec = item.massKg * (materialRecoveryPct / 100);
      recycled += rec;
      // Phần còn lại không thu hồi được chuyển sang tuyến nhiệt nếu có nhiệt trị hoặc vô cơ
      if (item.qMJ > 0) {
        thermal += (item.massKg - rec);
      } else {
        inorganic += (item.massKg - rec);
      }
    } else if (item.route === 'organic') {
      const org = item.massKg * (organicRecoveryPct / 100);
      organic += org;
      // Phần hữu cơ thừa còn lại đi vào dòng rác chung
      thermal += (item.massKg - org);
    } else if (item.route === 'residual') {
      thermal += item.massKg;
    } else if (item.route === 'specialized') {
      specialized += item.massKg;
    } else {
      inorganic += item.massKg;
    }
  });

  // 2. Tính năng lượng vào Q (MJ) cho các dòng đưa vào lò nhiệt
  let totalQ_MJ = 0;
  composition.forEach((item) => {
    if (item.route === 'residual') {
      totalQ_MJ += item.massKg * item.qMJ;
    } else if (item.route === 'recycle') {
      const notRecycled = item.massKg * (1 - materialRecoveryPct / 100);
      totalQ_MJ += notRecycled * item.qMJ;
    } else if (item.route === 'organic') {
      const notOrganic = item.massKg * (1 - organicRecoveryPct / 100);
      totalQ_MJ += notOrganic * item.qMJ;
    }
  });

  // 3. Tính điện năng
  const grossKWh = Number(((totalQ_MJ * (etaPct / 100)) / 3.6).toFixed(2));
  const internalKWh = Number((grossKWh * (internalUsePct / 100)).toFixed(2));
  const netKWh = Number((grossKWh - internalKWh).toFixed(2));

  // Mốc đốt hỗn hợp lý thuyết (nếu đốt tất cả các thành phần có q)
  const theoreticalQ = composition.reduce((acc, c) => acc + (c.massKg * c.qMJ), 0);
  const theoreticalMixedKWh = Number((((theoreticalQ * (etaPct / 100)) / 3.6) * (1 - internalUsePct / 100)).toFixed(2));

  return {
    recycledMass: Number(recycled.toFixed(1)),
    organicMass: Number(organic.toFixed(1)),
    thermalMass: Number(thermal.toFixed(1)),
    inorganicMass: Number(inorganic.toFixed(1)),
    specializedMass: Number(specialized.toFixed(1)),
    grossKWh,
    internalKWh,
    netKWh,
    theoreticalMixedKWh
  };
}

// Nội dung tư liệu Khảo sát Nhà máy Điện rác Seraphin (Hà Nội)
export const SERAPHIN_SURVEY_INFO = {
  title: 'Khảo sát Nhà máy Điện rác Seraphin (Hà Nội)',
  subtitle: 'Ghi chép khảo sát thực địa của nhóm học sinh THPT Chuyên Chu Văn An',
  notes: [
    {
      title: 'Nhóm khảo sát tại Nhà máy điện rác Seraphin',
      desc: 'Tư liệu thu thập qua đợt tham quan học tập thực tế tại Nhà máy điện rác Seraphin (Sơn Tây, Hà Nội). Lưu ý: Nhà máy là đối tượng khảo sát kỹ thuật, không phải đơn vị triển khai phần mềm WasteLab.',
      tag: 'Ghi chép khảo sát'
    },
    {
      title: 'Sau đốt vẫn có kim loại cần thu hồi từ xỉ đáy',
      desc: 'Sau khi qua lò đốt ghi cơ học ở nhiệt độ trên 850°C–1000°C, phần xỉ đáy (bottom ash chiếm ~15-20% khối lượng) được nam châm điện tách thu hồi sắt, nhôm kim loại. Điều này chứng minh: Thu hồi vật liệu trước xử lý vẫn là giải pháp kinh tế và khoa học hơn.',
      tag: 'Thu hồi kim loại'
    },
    {
      title: 'Tro bay được thu gom và hóa rắn nghiêm ngặt',
      desc: 'Tro bay (fly ash chiếm ~2-3% khối lượng) sinh ra từ hệ thống lọc khí thải túi vải có chứa dioxin, furan và kim loại nặng. Phần này được hóa rắn bằng xi măng và phụ gia trước khi chôn lấp chuyên biệt, không được phóng thích ra ngoài.',
      tag: 'Kiểm soát tro bay'
    },
    {
      title: 'Rác tiếp nhận và rác cấp vào lò khác khối lượng',
      desc: 'Rác sinh hoạt tại Hà Nội có độ ẩm rất cao. Khi xe rác đổ vào hố chứa rác kín, rác được ủ từ 3-7 ngày để ép chảy nước rỉ rác (nước rác chiếm 15-20% khối lượng). Lượng rác thực tế nạp vào phễu lò có khối lượng nhỏ hơn lượng rác cân lúc nhập trạm.',
      tag: 'Cơ sở cân đo'
    },
    {
      title: 'Chuỗi công nghệ: Lò ghi - Nồi hơi - Tua bin - Máy phát',
      desc: 'Nhiệt cháy của rác đun sôi nước tạo hơi quá nhiệt áp suất cao (khoảng 40 bar, 400°C) dẫn vào tua-bin hơi nước kéo máy phát điện đồng bộ để phát điện hòa lưới quốc gia 110kV.',
      tag: 'Chuỗi nhiệt điện'
    }
  ]
};

// 6 Tình huống luyện tập thực tế
export const PRACTICE_CASES = [
  {
    id: 1,
    question: 'Bạn có một chai nước khoáng PET uống xong còn ít nước ngọt dưới đáy. Cách xử lý đúng là gì?',
    options: [
      'Vứt ngay vào thùng rác còn lại vì đã bị bẩn.',
      'Đổ hết nước thừa, tráng sơ, tháo nắp và ép bẹp chai để vào túi nhựa tái chế.',
      'Đem đốt ngay để thu hồi nhiệt lượng.'
    ],
    correctIndex: 1,
    explanation: 'Chai PET có giá trị tái chế cơ học cao nhất. Chỉ cần tráng sạch cặn ngọt và tháo nắp là đủ điều kiện để các cơ sở tái chế tiếp nhận, không nên chuyển sang đốt.'
  },
  {
    id: 2,
    question: 'Điều khiển tivi bị hỏng 2 viên pin tiểu AA. Bạn nên xử lý như thế nào?',
    options: [
      'Bỏ chung vào túi rác sinh hoạt hàng ngày vì chỉ có 2 viên pin nhỏ.',
      'Dán băng dính vào 2 đầu cực, để trong hộp khô ráo và mang đến điểm thu gom pin chuyên dụng.',
      'Đập dẹp pin rồi vứt vào túi ve chai sắt vụn.'
    ],
    correctIndex: 1,
    explanation: 'Pin chứa chì, thủy ngân và dung dịch điện phân độc hại. Khi đốt sinh khói độc, khi chôn lấp ngấm vào nước ngầm. Bắt buộc phải thu gom chuyên biệt.'
  },
  {
    id: 3,
    question: 'Vỏ hộp sữa tươi tiệt trùng nhiều lớp (Tetra Pak) có cấu tạo từ những vật liệu gì?',
    options: [
      '100% bằng giấy bìa carton thông thường.',
      '100% bằng nhựa dẻo cán mỏng.',
      'Cấu tạo phức hợp gồm khoảng 75% giấy, 21% màng nhôm và 4% màng nhựa PE.'
    ],
    correctIndex: 2,
    explanation: 'Vỏ hộp sữa là bao bì đa lớp ép chặt. Nhờ công nghệ nghiền thủy lực đặc biệt, các nhà máy tái chế hiện nay có thể tách bột giấy làm thùng carton và ép màng nhôm-nhựa thành tấm lợp sinh thái.'
  },
  {
    id: 4,
    question: 'Vì sao không nên đốt rác hữu cơ (rau củ thừa) có độ ẩm trên 60%?',
    options: [
      'Vì nhiệt lượng phải tiêu tốn để làm bay hơi nước, làm giảm nhiệt độ lò đốt và sinh khói ô nhiễm.',
      'Vì rác hữu cơ có giá trị thu mua ve chai rất đắt.',
      'Vì rác hữu cơ không thể phân hủy được.'
    ],
    correctIndex: 0,
    explanation: 'Độ ẩm cao làm giảm nhiệt trị của rác (thậm chí gây tắt lò nếu nhiệt độ dưới 850°C, dễ tạo dioxin). Hữu cơ nên ưu tiên ủ phân compost hoặc ủ yếm khí sinh khí Biogas.'
  },
  {
    id: 5,
    question: 'Sau khi rác được đốt tại Nhà máy Seraphin, tro bay (fly ash) được quản lý như thế nào?',
    options: [
      'Được đem bón cho cây trồng làm phân kali.',
      'Được thu gom bằng túi vải, phối trộn với xi măng và hóa chất để hóa rắn trước khi chôn lấp an toàn.',
      'Thổi trực tiếp ra ngoài ống khói nhà máy.'
    ],
    correctIndex: 1,
    explanation: 'Tro bay là chất thải nguy hại chứa kim loại nặng và hợp chất clo hữu cơ, bắt buộc phải hóa rắn bằng xi măng/chất đóng rắn theo quy chuẩn QCVN trước khi lưu giữ tại bãi chuyên biệt.'
  },
  {
    id: 6,
    question: 'Một người mang 5 kg chai nhựa đi bàn giao. Nơi nhận kiểm tra chấp nhận 4 kg chai sạch và từ chối 1 kg chai dính dầu máy. Nhật ký đúng là gì?',
    options: [
      'Ghi nhận đã bàn giao thành công 5 kg.',
      'Xóa toàn bộ bản ghi vì không đạt yêu cầu.',
      'Ghi nhận 4 kg được nhận, giữ 1 kg ở trạng thái rác còn lại với lý do từ chối cụ thể.'
    ],
    correctIndex: 2,
    explanation: 'Nguyên tắc liêm chính dữ liệu: Chỉ ghi nhận khối lượng thực sự được tiếp nhận. 1 kg bị từ chối tiếp tục được theo dõi để xử lý đúng tuyến, không tính khống thành tích.'
  }
];
