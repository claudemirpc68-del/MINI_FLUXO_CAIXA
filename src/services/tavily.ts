export interface TavilyMarketPriceResult {
  product: string;
  marketPrice: number | null;
  foundPrices?: number[];
  source: string;
  status: 'SUCCESS' | 'FALLBACK';
}

export class TavilyBridgeService {
  private static SERVER_URL = 'http://localhost:5000/api/market-price';

  /**
   * Fetches real-time market price for a product using the Tavily ClickSuper Scraper Bridge
   */
  static async fetchMarketPrice(productDescription: string): Promise<TavilyMarketPriceResult | null> {
    try {
      const response = await fetch(`${this.SERVER_URL}?q=${encodeURIComponent(productDescription)}`);
      if (response.ok) {
        const data: TavilyMarketPriceResult = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Tavily Bridge local server offline, fallback enabled:', e);
    }
    return null;
  }
}
