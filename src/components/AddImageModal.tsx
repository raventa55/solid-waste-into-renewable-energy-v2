import React, { useState } from 'react';
import { EnvironmentImage } from '../types';
import { X, Upload, Image as ImageIcon, Plus } from 'lucide-react';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (newImage: EnvironmentImage) => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({ isOpen, onClose, onAddImage }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'nature' | 'pollution' | 'recycling' | 'apparatus'>('nature');
  const [caption, setCaption] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [sourceOrCredit, setSourceOrCredit] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = previewSrc || urlInput.trim();
    if (!finalSrc) {
      alert('Vui lòng chọn tệp ảnh hoặc nhập liên kết ảnh.');
      return;
    }
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề cho ảnh.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      nature: 'Thiên nhiên & Bền vững',
      pollution: 'Thực trạng ô nhiễm',
      recycling: 'Tuần hoàn & Phân loại',
      apparatus: 'Hệ thí nghiệm'
    };

    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Môi trường', categoryLabels[category]];

    const newImage: EnvironmentImage = {
      id: 'env-' + Date.now(),
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      src: finalSrc,
      caption: caption.trim() || 'Hình ảnh tư liệu môi trường phục vụ nghiên cứu WasteLab.',
      detailedDescription: detailedDescription.trim() || 'Hình ảnh đóng góp bổ sung cho mục Tổng quan nghiên cứu và bối cảnh môi trường.',
      sourceOrCredit: sourceOrCredit.trim() || 'Thành viên nhóm nghiên cứu WasteLab',
      tags
    };

    onAddImage(newImage);
    onClose();
    // Reset form
    setTitle('');
    setCaption('');
    setDetailedDescription('');
    setPreviewSrc('');
    setUrlInput('');
    setTagsInput('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Thêm ảnh môi trường vào Tổng quan
              </h3>
              <p className="text-xs text-slate-500">
                Tải lên ảnh thực địa, ảnh bối cảnh rác thải hoặc hệ thí nghiệm
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* File Upload / Image Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Tải ảnh từ máy tính hoặc nhập liên kết
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/40 hover:bg-emerald-50 cursor-pointer transition-colors text-center">
                <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-semibold text-emerald-800">Chọn tệp ảnh từ máy</span>
                <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-xs text-slate-500 mb-1">Hoặc dán URL ảnh trực tiếp:</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (!previewSrc) setPreviewSrc(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Preview */}
            {(previewSrc || urlInput) && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100 flex items-center justify-center">
                <img 
                  src={previewSrc || urlInput} 
                  alt="Xem trước" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => { setPreviewSrc(''); setUrlInput(''); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề ảnh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Thu gom rác thải nhựa tại bờ kênh, Thí nghiệm buồng đốt..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phân loại bối cảnh
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-white"
              >
                <option value="nature">Thiên nhiên & Bền vững</option>
                <option value="pollution">Thực trạng ô nhiễm</option>
                <option value="recycling">Tuần hoàn & Phân loại</option>
                <option value="apparatus">Hệ thí nghiệm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nguồn / Tác giả ảnh
              </label>
              <input
                type="text"
                placeholder="VD: Ảnh chụp thực địa, Nhóm 3..."
                value={sourceOrCredit}
                onChange={(e) => setSourceOrCredit(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả ngắn hiển thị dưới ảnh
            </label>
            <input
              type="text"
              placeholder="VD: Rác nhựa trước khi phân loại để chuyển vào lò phản ứng..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          {/* Detailed description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ý nghĩa môi trường / nghiên cứu
            </label>
            <textarea
              rows={2}
              placeholder="Giải thích tác động đến môi trường, giảm bãi chôn lấp, chuyển hóa năng lượng..."
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thẻ từ khóa (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="VD: Rác thải sinh hoạt, Năng lượng sạch, Ô nhiễm nước"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
            >
              + Lưu & Thêm vào Tổng quan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
