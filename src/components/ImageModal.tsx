import React from 'react';
import { EnvironmentImage } from '../types';
import { X, Tag, Info, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  image: EnvironmentImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              {image.categoryLabel}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {image.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Frame */}
        <div className="relative bg-slate-950 max-h-[460px] overflow-hidden flex items-center justify-center">
          <img 
            src={image.src} 
            alt={image.title} 
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[460px] object-contain"
          />
        </div>

        {/* Content & Environmental Insight */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              Tóm tắt bối cảnh môi trường
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {image.caption}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-sm text-emerald-950 leading-relaxed">
            <span className="font-semibold text-emerald-800 block mb-1">
              Ý nghĩa trong nghiên cứu WasteLab:
            </span>
            {image.detailedDescription}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {image.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="text-slate-400 text-right italic text-[11px]">
              {image.sourceOrCredit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
