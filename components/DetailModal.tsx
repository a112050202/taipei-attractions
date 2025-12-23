
import React from 'react';
import { Attraction } from '../types';

interface DetailModalProps {
  attraction: Attraction | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ attraction, onClose }) => {
  if (!attraction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <i className="fas fa-times text-slate-800"></i>
        </button>

        <div className="overflow-y-auto flex-grow scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery or Hero Image */}
            <div className="h-64 md:h-full bg-gray-100">
              {attraction.images.length > 0 ? (
                <img 
                  src={attraction.images[0].src} 
                  alt={attraction.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-image text-6xl"></i>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{attraction.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {attraction.category.map(cat => (
                    <span key={cat.id} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <i className="fas fa-map-marked-alt text-indigo-500 w-5 mt-1"></i>
                  <p className="text-slate-700">{attraction.address}</p>
                </div>
                {attraction.tel && (
                  <div className="flex items-center gap-3">
                    <i className="fas fa-phone-alt text-indigo-500 w-5"></i>
                    <p className="text-slate-700">{attraction.tel}</p>
                  </div>
                )}
                {attraction.open_time && (
                  <div className="flex items-start gap-3">
                    <i className="fas fa-clock text-indigo-500 w-5 mt-1"></i>
                    <p className="text-slate-700">{attraction.open_time}</p>
                  </div>
                )}
              </div>

              <div className="prose prose-slate max-w-none">
                <h4 className="text-lg font-semibold text-slate-800 border-b border-gray-100 pb-2 mb-3">景點介紹</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {attraction.introduction}
                </p>
              </div>

              {attraction.url && (
                <div className="pt-4">
                  <a 
                    href={attraction.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    前往官方網站
                    <i className="fas fa-external-link-alt text-sm"></i>
                  </a>
                </div>
              )}

              <div className="text-xs text-slate-400 border-t border-gray-50 pt-4 mt-8 italic">
                最後更新日期: {new Date(attraction.modified).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
