
import React from 'react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
  onClick: (attraction: Attraction) => void;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onClick }) => {
  const imageUrl = attraction.images.length > 0 
    ? attraction.images[0].src 
    : 'https://picsum.photos/seed/taipei/400/300';

  const categoryName = attraction.category?.[0]?.name || '其他';

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onClick(attraction)}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={attraction.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/400/300';
          }}
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
          {categoryName}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {attraction.name}
        </h3>
        
        <div className="flex items-start gap-2 text-slate-500 text-sm mb-3">
          <i className="fas fa-map-marker-alt mt-1 flex-shrink-0 text-indigo-400"></i>
          <span className="line-clamp-1">{attraction.address}</span>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
          {attraction.introduction}
        </p>
        
        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-indigo-600 font-medium text-sm">
          <span>更多資訊</span>
          <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
