
import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  // 為了符合規格書「查詢按鈕」的需求，點擊按鈕或按下 Enter 才會正式執行檢索
  return (
    <header className="bg-indigo-900 text-white sticky top-0 z-40 shadow-xl overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800 opacity-90"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start group cursor-default">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="bg-white text-indigo-900 px-2 py-0.5 rounded italic">TAIPEI</span>
            景點查詢
          </h1>
          <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 group-hover:text-white transition-colors">
            Taipei City Attractions
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <form onSubmit={handleSubmit} className="relative w-full sm:w-80 md:w-96 flex gap-2">
            <div className="relative flex-grow group">
              <input 
                type="text" 
                className="w-full bg-white text-slate-800 px-4 py-2.5 pl-10 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all font-medium placeholder:text-slate-400"
                placeholder="搜尋景點名稱、地址..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
            </div>
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex-shrink-0"
            >
              查詢
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
