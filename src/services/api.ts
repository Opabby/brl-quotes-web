import type { Quote, Average, Slippage } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private async fetchWithErrorHandling<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async getQuotes(): Promise<Quote[]> {
    return this.fetchWithErrorHandling<Quote[]>('/quotes');
  }

  async getAverage(): Promise<Average> {
    return this.fetchWithErrorHandling<Average>('/average');
  }

  async getSlippage(): Promise<Slippage[]> {
    return this.fetchWithErrorHandling<Slippage[]>('/slippage');
  }
}

export const apiService = new ApiService();