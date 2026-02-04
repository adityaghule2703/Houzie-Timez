import { Platform } from 'react-native';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.gameId = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.subscribers = new Map();
  }

  async connect(gameId, token) {
    try {
      this.gameId = gameId;
      
      // Determine WebSocket URL
      let wsUrl;
      if (__DEV__) {
        // For development - update with your server IP
        wsUrl = `ws://localhost:6001/app/${gameId}?token=${token}`;
        // OR if using Laravel Echo Server
        wsUrl = `ws://localhost:6001/app/${gameId}?token=${token}`;
      } else {
        // For production
        wsUrl = `wss://exilance.com/app/${gameId}?token=${token}`;
      }
      
      // Close existing connection
      if (this.ws) {
        this.disconnect();
      }
      
      console.log('Connecting to WebSocket:', wsUrl);
      
      // Create WebSocket connection
      this.ws = new WebSocket(wsUrl);
      
      // Setup event handlers
      this.setupEventHandlers();
      
      // Wait for connection
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);
        
        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.isConnected = true;
          resolve();
        };
        
        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      });
      
      this.reconnectAttempts = 0;
      console.log('WebSocket connected successfully');
      
      return true;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnection();
      throw error;
    }
  }

  setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connection opened');
      this.isConnected = true;
      this.notifySubscribers('connected', { isConnected: true });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data.event, data.data);
        
        // Handle different event types
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
      this.notifySubscribers('error', { error });
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.isConnected = false;
      this.notifySubscribers('disconnected', { 
        code: event.code, 
        reason: event.reason 
      });
      
      // Attempt to reconnect
      if (event.code !== 1000) {
        this.handleReconnection();
      }
    };
  }

  handleMessage(data) {
    const eventType = data.event;
    const eventData = data.data;
    
    switch (eventType) {
      case 'number.called':
        this.notifySubscribers('numberCalled', eventData);
        break;
        
      case 'calling.status.updated':
        this.notifySubscribers('callingStatusUpdated', eventData);
        break;
        
      case 'game.completed':
        this.notifySubscribers('gameCompleted', eventData);
        break;
        
      default:
        console.log('Unhandled WebSocket event:', eventType);
    }
  }

  subscribe(eventName, callback) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
    }
    this.subscribers.get(eventName).add(callback);
    
    // Return unsubscribe function
    return () => {
      if (this.subscribers.has(eventName)) {
        this.subscribers.get(eventName).delete(callback);
      }
    };
  }

  notifySubscribers(eventName, data) {
    if (this.subscribers.has(eventName)) {
      this.subscribers.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.notifySubscribers('reconnectionFailed', {
        attempts: this.reconnectAttempts
      });
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(async () => {
      if (this.gameId) {
        try {
          const token = await this.getAuthToken();
          await this.connect(this.gameId, token);
        } catch (error) {
          console.error('Reconnection failed:', error);
          this.handleReconnection();
        }
      }
    }, delay);
  }

  async getAuthToken() {
    // Implement your token retrieval logic
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    return await AsyncStorage.getItem("token");
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
    console.log('WebSocket disconnected');
  }
}

export const webSocketService = new WebSocketService();