
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Attraction, AppStatus } from './types';
import { fetchAttractions } from './services/taipeiApi';
import Header from './components/Header';
import AttractionCard from './components/AttractionCard';
import SkeletonCard from './components/SkeletonCard';
import DetailModal from './components/DetailModal';

const App: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AppStatus>(AppStatus.LOADING);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  const loadData = useCallback(async (targetPage: number) => {
    setStatus(AppStatus.LOADING);
    setErrorMsg(null);
    try {
      const result = await fetchAttractions(targetPage, 'zh-tw');
      
      // 確保 API 回傳結構正確
      if (result && result.data) {
        setAttractions(result.data);
        setTotalCount(result.total || 0);
        setStatus(result.data.length === 0 ? AppStatus.EMPTY : AppStatus.IDLE);
      } else {
        throw new Error("EMPTY_RESPONSE");
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("App error handler:", error);
      setStatus(AppStatus.ERROR);
      
      if (error.message.includes('FAILED_TO_FETCH') || error.message.includes('Failed to fetch')) {
        setErrorMsg('無法連接到臺北旅遊網 API。這通常是瀏覽器的 CORS 安全限制，我們已嘗試使用代理，請檢查網路連線或嘗試更換瀏覽器。');
      } else if (error.message.includes('HTTP_401')) {
        setErrorMsg('API 認證失效，請確認 API Key 是否需要更新。');
      } else {
        setErrorMsg(`連線發生異常 (${error.message})。請點擊下方按鈕重新整理。`);
      }
    }
  }, []);

  useEffect(() => {
    loadData(page);
  }, [page, loadData]);

  const filteredAttractions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return attractions;
    return attractions.filter(attr => 
      attr.name.toLowerCase().includes(term) ||
      attr.address.toLowerCase().includes(term) ||
      attr.introduction.toLowerCase().includes(term)
    );
  }, [attractions, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <Header onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* 頂部狀態列 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${status === AppStatus.ERROR ? 'bg-red-500 animate-pulse' : (status === AppStatus.LOADING ? 'bg-yellow-400 animate-ping' : 'bg-green-500')}`}></div>
            <span className="text-slate-600 text-sm font-bold">
              {status === AppStatus.ERROR ? 'API 連線失敗' : (status === AppStatus.LOADING ? '資料讀取中...' : '資料更新成功')}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <span>第 {page} 頁</span>
            <span>總筆數：{totalCount}</span>
          </div>
        </div>

        {/* 內容顯示區 */}
        {status === AppStatus.LOADING ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : status === AppStatus.ERROR ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-red-50 text-center px-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <i className="fas fa-exclamation-triangle text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">連線失敗</h2>
            <p className="text-slate-500 mb-8 max-w-lg leading-relaxed">{errorMsg}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => loadData(page)}
                className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                重新載入
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                強制重整網頁
              </button>
            </div>
          </div>
        ) : filteredAttractions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-6">
            <i className="fas fa-search-location text-5xl text-slate-200 mb-6"></i>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">查無結果</h2>
            <p className="text-slate-500">找不到符合「{searchTerm}」的景點，請嘗試其他關鍵字。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {filteredAttractions.map((attr) => (
              <AttractionCard 
                key={attr.id} 
                attraction={attr} 
                onClick={setSelectedAttraction}
              />
            ))}
          </div>
        )}

        {/* 分頁按鈕 */}
        {!searchTerm && status === AppStatus.IDLE && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button 
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-20"
            >
              <i className="fas fa-chevron-left mr-2"></i> 上一頁
            </button>
            <div className="bg-indigo-50 text-indigo-700 px-5 py-3 rounded-xl font-black">
              {page}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={attractions.length < 30}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-20"
            >
              下一頁 <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        )}
      </main>

      {selectedAttraction && (
        <DetailModal 
          attraction={selectedAttraction} 
          onClose={() => setSelectedAttraction(null)} 
        />
      )}
    </div>
  );
};

export default App;
