import React, { useState } from 'react';
import { SERAPHIN_SURVEY_INFO, PRACTICE_CASES } from '../data/wasteSpecData';
import seraphinPlantImg from '../assets/images/nha_may_dien_rac_seraphin_1791446774890.jpg';
import { 
  BookOpen, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Layers, 
  AlertTriangle,
  ZoomIn
} from 'lucide-react';

export const EducationTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'seraphin' | 'articles' | 'quiz'>('seraphin');
  
  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelectOption = (caseId: number, optIndex: number) => {
    setUserAnswers({ ...userAnswers, [caseId]: optIndex });
    setShowResults({ ...showResults, [caseId]: true });
  };

  const articles = [
    {
      id: 'art-1',
      title: '1. Vì sao cần phân loại rác trước khi đốt rác phát điện?',
      summary: 'Không phải mọi loại rác có nhiệt trị cao đều nên đốt. Vật liệu có khả năng tái chế cơ học (nhựa sạch, giấy, lon nhôm) tiết kiệm tài nguyên và năng lượng gốc gấp 4-8 lần so với việc đốt lấy điện.',
      content: 'Khi đốt rác hỗn hợp chứa nhiều rác hữu cơ có độ ẩm cao, năng lượng của buồng đốt bị tiêu hao để sấy bốc hơi nước, làm giảm nhiệt độ lò dưới 850°C - ngưỡng dễ phát sinh khí độc dioxin/furan. Do đó, tách riêng hữu cơ và tái chế là tiền đề quyết định để nhà máy điện rác vận hành an toàn và bền vững.'
    },
    {
      id: 'art-2',
      title: '2. Phân biệt Xỉ đáy (Bottom Ash) và Tro bay (Fly Ash)',
      summary: 'Hai loại chất thải phát sinh sau quá trình đốt rác có đặc tính độc tính và phương pháp xử lý hoàn toàn khác nhau.',
      content: '• Xỉ đáy (chiếm ~15-20% khối lượng): Là phần cặn tro thô còn lại trên ghi lò sau khi rác cháy hết. Xỉ đáy có hàm lượng kim loại vụn (sắt, nhôm) được nam châm tách thu hồi; phần trơ còn lại được thử nghiệm làm vật liệu san lấp hoặc gạch không nung.\n• Tro bay (chiếm ~2-3% khối lượng): Là bụi mịn bay theo khói được giữ lại tại tháp hấp phụ và màng lọc túi vải. Tro bay chứa hàm lượng kim loại nặng và hợp chất clo hữu cơ cao, được phân loại là chất thải nguy hại và bắt buộc phải hóa rắn bằng xi măng trước khi chôn lấp chuyên biệt.'
    },
    {
      id: 'art-3',
      title: '3. Chuỗi biến đổi nhiệt năng thành điện năng trong lò đốt',
      summary: 'Chu trình nhiệt động lực học Rankine tiêu chuẩn tương tự các nhà máy nhiệt điện than nhưng sử dụng nhiên liệu rác thải.',
      content: '1. Buồng đốt ghi cơ học: Rác được đốt cháy ở nhiệt độ 850°C–1050°C để phân hủy hoàn toàn các chất hữu cơ độc hại.\n2. Nồi hơi thu hồi nhiệt: Khí nóng đi qua dàn ống nước đun sôi nước tạo thành hơi quá nhiệt áp suất 40 bar.\n3. Tua-bin hơi nước: Dòng hơi áp lực cao phun vào các cánh tua-bin làm quay trục với tốc độ 3000 vòng/phút.\n4. Máy phát điện: Trục tua-bin truyền động cho máy phát điện đồng bộ để tạo ra dòng điện xoay chiều, nâng áp hòa lưới điện 110kV.'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-emerald-950/10">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide uppercase">
          <span>Kiến thức chuyên môn & Bằng chứng thực nghiệm</span>
          <span aria-hidden="true">·</span>
          <span>WasteLab Education</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight mt-0.5">
          Tìm Hiểu Điện Rác & Tư Liệu Seraphin
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Tài liệu học tập ngắn gọn, kết quả khảo sát thực địa tại Nhà máy Điện rác Seraphin và bài tập tình huống.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveSection('seraphin')}
          className={`pb-2 px-3 font-bold transition-all relative ${
            activeSection === 'seraphin'
              ? 'text-emerald-800 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Khảo sát Seraphin (Hà Nội)
        </button>
        <button
          onClick={() => setActiveSection('articles')}
          className={`pb-2 px-3 font-bold transition-all relative ${
            activeSection === 'articles'
              ? 'text-emerald-800 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Kiến thức cốt lõi (3 bài đọc)
        </button>
        <button
          onClick={() => setActiveSection('quiz')}
          className={`pb-2 px-3 font-bold transition-all relative ${
            activeSection === 'quiz'
              ? 'text-emerald-800 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Luyện tập 6 tình huống thực tế
        </button>
      </div>

      {activeSection === 'seraphin' && (
        /* =================== CHUYÊN ĐỀ KHẢO SÁT SERAPHIN (Page 13) =================== */
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d3b2b] to-[#1a6448] text-white shadow-sm">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/20 text-emerald-200">
              {SERAPHIN_SURVEY_INFO.subtitle}
            </span>
            <h2 className="text-xl font-black mt-2">
              {SERAPHIN_SURVEY_INFO.title}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Các thông tin do kỹ sư nhà máy giới thiệu được gắn nhãn "Ghi chép khảo sát". Nhà máy là đối tượng khảo sát kỹ thuật thực tế, không phải đơn vị triển khai phần mềm WasteLab.
            </p>
          </div>

          {/* Hình ảnh tư liệu Nhà máy Seraphin */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 relative h-56 md:h-auto bg-slate-900 overflow-hidden group">
                <img
                  src={seraphinPlantImg}
                  alt="Nhà máy Điện rác Seraphin"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/65 text-white text-[11px] font-semibold backdrop-blur-xs">
                  Ảnh Khảo Sát Thực Địa
                </div>
              </div>
              <div className="md:col-span-7 p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    <span>Nhà máy điện rác Seraphin (Hà Nội)</span>
                    <span>·</span>
                    <span>Công nghệ ghi lò</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    Mô hình công nghệ xử lý rác thải sinh hoạt phát điện quy mô 37 MW
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Đây là nhà máy điện rác hiện đại thứ hai tại Hà Nội, ứng dụng công nghệ đốt rác trên ghi lò cơ học kết hợp hệ thống lọc khí thải chuẩn châu Âu. Kết quả thực địa tại nhà máy là căn cứ thực nghiệm giúp nhóm xây dựng các hệ số trong thuật toán phân tích.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <div className="font-black text-emerald-900 text-sm">2.250 tấn</div>
                    <div className="text-[10px] text-emerald-700">Rác/ngày đêm</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <div className="font-black text-emerald-900 text-sm">37 MW</div>
                    <div className="text-[10px] text-emerald-700">Công suất phát điện</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <div className="font-black text-emerald-900 text-sm">&gt; 850°C</div>
                    <div className="text-[10px] text-emerald-700">Nhiệt độ buồng đốt</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERAPHIN_SURVEY_INFO.notes.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10.5px] group-hover:bg-emerald-100 transition-colors">
                      {item.tag}
                    </span>
                    <span className="text-[10.5px] text-slate-400 font-mono">
                      Mục 0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 text-[10.5px] text-slate-400 italic">
                  Căn cứ: Khảo sát thực địa Chuyên Chu Văn An
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'articles' && (
        /* =================== CÁC BÀI ĐỌC CỐT LÕI (Page 13) =================== */
        <div className="space-y-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3"
            >
              <h3 className="font-extrabold text-slate-900 text-base">
                {art.title}
              </h3>
              <p className="text-xs text-emerald-950 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 font-medium leading-relaxed">
                {art.summary}
              </p>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {art.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'quiz' && (
        /* =================== 6 TÌNH HUỐNG LUYỆN TẬP (Page 13) =================== */
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Bài tập tình huống: </strong>
            Kết quả làm bài là điểm số học tập trong ứng dụng, dùng để củng cố kiến thức phân loại và hiểu biết về điện rác.
          </div>

          <div className="space-y-4">
            {PRACTICE_CASES.map((item, idx) => {
              const selectedOpt = userAnswers[item.id];
              const isAnswered = showResults[item.id];
              const isCorrect = selectedOpt === item.correctIndex;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    {item.options.map((opt, oIdx) => {
                      let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
                      if (isAnswered) {
                        if (oIdx === item.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                        } else if (selectedOpt === oIdx) {
                          btnStyle = 'border-red-400 bg-red-50 text-red-950 line-through';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(item.id, oIdx)}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2 ${btnStyle}`}
                        >
                          <span className="font-bold shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className={`p-3.5 rounded-xl text-xs space-y-1 animate-in fade-in ${
                      isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-amber-50 border border-amber-200 text-amber-950'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-amber-600" />
                        )}
                        <span>{isCorrect ? 'Chính xác!' : 'Giải thích đáp án đúng:'}</span>
                      </div>
                      <p className="leading-relaxed text-[11.5px] opacity-90">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
