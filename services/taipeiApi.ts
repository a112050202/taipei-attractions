
import { ApiResponse } from '../types';

/**
 * 臺北旅遊網 Open API Service
 * 
 * 使用者指定的原始 URL: https://www.travel.taipei/open-api/{lang}/Attractions/All?page={page}
 * 遵循使用者提供的 CURL 規格：
 * curl -H "accept: application/json" "https://www.travel.taipei/open-api/zh-tw/Attractions/All?page=1"
 */
export const fetchAttractions = async (page: number = 1, lang: string = 'zh-tw'): Promise<ApiResponse> => {
  const targetUrl = `https://www.travel.taipei/open-api/${lang}/Attractions/All?page=${page}`;
  
  // 為了解決瀏覽器直接呼叫政府 API 時產生的 CORS 錯誤（Failed to fetch）
  // 我們使用 corsproxy.io 代理轉發請求。它會將請求帶到目標伺服器並回傳資料。
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
  
  try {
    // 優先使用代理呼叫
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json' // 嚴格遵守使用者指定的 Header
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.warn(`Proxy fetch failed for ${targetUrl}, trying direct connection as fallback...`);
    
    // 備援機制：如果代理伺服器有問題，嘗試直接連線（雖然在多數瀏覽器會被 CORS 阻擋）
    try {
      const directResponse = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      if (!directResponse.ok) throw new Error(`DIRECT_HTTP_${directResponse.status}`);
      return await directResponse.json();
    } catch (directError: any) {
      console.error("Critical Fetch Error:", directError);
      // 拋出最終錯誤供 App 層級捕捉
      throw new Error(directError.message || "FAILED_TO_FETCH");
    }
  }
};
