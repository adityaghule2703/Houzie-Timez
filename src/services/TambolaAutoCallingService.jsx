import { webSocketService } from './WebSocketService';

class TambolaAutoCallingService {
  constructor() {
    this.baseURL = 'https://tambolatime.co.in/public/api';
  }

  async getCallingStatus(gameId, token) {
    try {
      const response = await fetch(
        `${this.baseURL}/user/games/${gameId}/calling-status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting calling status:', error);
      return { success: false, message: 'Failed to get status' };
    }
  }

  async getCalledNumbers(gameId, token) {
    try {
      const response = await fetch(
        `${this.baseURL}/user/games/${gameId}/called-numbers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting called numbers:', error);
      return { success: false, message: 'Failed to get numbers' };
    }
  }
}

export const tambolaAutoCallingService = new TambolaAutoCallingService();