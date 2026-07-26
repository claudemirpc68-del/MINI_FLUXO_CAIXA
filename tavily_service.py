import sys
import os
import json
import re
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

# Tavily API Service & Scraper for Real-Time ClickSuper Market Prices
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY", "")

def fetch_tavily_market_price(product_name):
    """
    Scrapes or searches real-time price quotes from ClickSuper / Supermarket comparison using Tavily Search API.
    """
    query = f"preço {product_name} supermercado clicksuper"
    
    if TAVILY_API_KEY:
        try:
            url = "https://api.tavily.com/search"
            payload = json.dumps({
                "api_key": TAVILY_API_KEY,
                "query": query,
                "search_depth": "basic",
                "include_answer": True,
                "max_results": 5
            }).encode('utf-8')
            
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                
                # Extract prices from search results using regex R$ XX,XX
                text_content = json.dumps(res_data)
                prices = [float(p.replace('.', '').replace(',', '.')) for p in re.findall(r'R\$\s*(\d+[\.,]\d{2})', text_content)]
                
                if prices:
                    avg_price = sum(prices) / len(prices)
                    return {
                        "product": product_name,
                        "marketPrice": round(avg_price, 2),
                        "foundPrices": prices,
                        "source": "Tavily API (ClickSuper Scraped Live)",
                        "status": "SUCCESS"
                    }
        except Exception as e:
            print(f"Tavily API call failed: {e}", file=sys.stderr)
    
    # Fallback heuristic calculation based on product name if API key is not present
    return {
        "product": product_name,
        "marketPrice": None,
        "source": "Tavily Bridge (Aguardando TAVILY_API_KEY em .env)",
        "status": "FALLBACK"
    }

class TavilyRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed_path.query)
        
        if parsed_path.path == '/api/market-price':
            product = params.get('q', [''])[0]
            if product:
                result = fetch_tavily_market_price(product)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
                return
                
        self.send_response(400)
        self.end_headers()

if __name__ == '__main__':
    port = 5000
    print(f"Iniciando Ponte Tavily ClickSuper Scraper na porta {port}...")
    server = HTTPServer(('localhost', port), TavilyRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Servidor encerrado.")
