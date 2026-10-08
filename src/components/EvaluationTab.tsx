import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, CheckSquare, Square } from 'lucide-react';

export const EvaluationTab: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Thiết kế & lắp ráp mô hình buồng nhiệt hóa Seebeck vi mô', completed: true },
    { id: 2, text: 'Thu thập 8+ mẫu thí nghiệm chuẩn với các dải nhiệt độ khác nhau', completed: true },
    { id: 3, text: 'Tích hợp bộ sưu tập hình ảnh bối cảnh môi trường và hệ thống thực nghiệm', completed: true },
    { id: 4, text: 'Xây dựng thuật toán phân tích tương quan & mô hình AI đánh giá', completed: true },
    { id: 5, text: 'Mở rộng thuật toán "Burn or Recycle" hỗ trợ quyết định phân loại rác', completed: true },
    { id: 6, text: 'Thực hiện đo đạc khí thải phát sinh (CO, CO₂) bằng cảm biến chuyên dụng', completed: false },
    { id: 7, text: 'Thử nghiệm hệ thống làm mát tản nhiệt nước để nâng cao hiệu suất Seebeck', completed: false }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-emerald-950/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f24] tracking-tight">
          Đánh Giá Kết Quả Nghiên Cứu
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tổng hợp kết luận khoa học, đánh giá độ tin cậy và lộ trình hoàn thiện đề tài.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scientific Insights */}
        <div className="lg:col-span-7 space-y-4">
          {/* Finding 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Phát Hiện Chính (Key Findings)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Nhiệt độ buồng hóa nhiệt là nhân tố quyết định lớn nhất đến hiệu điện thế phát ra. Khoảng nhiệt độ <strong>270°C – 300°C</strong> cho hiệu suất biến đổi nhiệt điện ổn định nhất (đạt trên 78%). Việc kết hợp các loại rác có nhiệt trị cao như phế phẩm nhựa tạo ra dòng điện cao hơn nhưng đòi hỏi hệ thống lọc khí thải nghiêm ngặt.
            </p>
          </div>

          {/* Finding 2: Limitations */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Hạn Chế Của Prototype Học Sinh
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Mô hình hiện tại có quy mô buồng thử nghiệm nhỏ (500g mẫu). Sai số đo lường có thể phát sinh do nhiệt độ môi trường xung quanh thay đổi và giới hạn chịu nhiệt của module nhiệt điện Peltier/Seebeck thông thường. Chưa định lượng chi tiết nồng độ khí thải vi mô.
            </p>
          </div>

          {/* Finding 3: Recommendations */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-teal-700" />
              Đề Xuất Hướng Mở Rộng Tiếp Theo
            </div>
            <p className="text-xs text-teal-950/90 leading-relaxed">
              Tăng số lượng mẫu đo thực nghiệm lên trên 50 mẫu; trang bị cảm biến nồng độ khí CO₂ và hạt bụi mịn; cải tiến hệ thống tản nhiệt mặt lạnh bằng quạt tản nhiệt hoặc ống đồng làm mát nước để gia tăng $\Delta T$.
            </p>
          </div>
        </div>

        {/* Right: Interactive Task Checklist */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Tiến Độ Hoàn Thành Dự Án
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {tasks.filter(t => t.completed).length} / {tasks.length} Hạng Mục
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Nhấp vào từng mục để cập nhật tiến độ thực hiện đề tài:
          </p>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs flex items-start gap-2.5 transition-all ${
                  task.completed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className={task.completed ? 'line-through text-slate-500' : 'font-medium'}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 text-center">
            Đề tài Khoa học Kỹ thuật dành cho Học sinh Trung học phổ thông · WasteLab
          </div>
        </div>
      </div>
    </div>
  );
};
