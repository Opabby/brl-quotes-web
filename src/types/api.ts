export interface Quote {
  buy_price: number;
  sell_price: number;
  source: string;
  timestamp: string;
  additional_info?: {
    mid_market_rate?: number;
    spread_percentage?: number;
    currency_pair?: string;
    provider?: string;
    date?: string;
    note?: string;
  };
}

export interface Average {
  average_buy_price: number;
  average_sell_price: number;
  timestamp: string;
  sources_count: number;
  additional_info: {
    calculation_method: string;
    sources: string[];
  };
}

export interface Slippage {
  buy_price_slippage: number;
  sell_price_slippage: number;
  source: string;
  timestamp: string;
  additional_info: {
    quote_buy_price: number;
    quote_sell_price: number;
    average_buy_price: number;
    average_sell_price: number;
    provider: string;
  };
}