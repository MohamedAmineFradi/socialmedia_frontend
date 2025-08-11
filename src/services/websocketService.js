import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let getStateAccessor = null;

export function setWebSocketStoreAccessors({ getState }) {
  getStateAccessor = getState;
}

const WebSocketService = {
  client: null,
  subscriptions: new Map(),
  connectionState: 'disconnected',
  connectionPromise: null,

  connect: function() {
    console.log('[WebSocketService] Connect called');

    if (this.connectionState === 'connected') {
      console.log('[WebSocketService] Already connected');
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      console.log('[WebSocketService] Connection already in progress');
      return this.connectionPromise;
    }

    this.connectionState = 'connecting';
    console.log('[WebSocketService] Connection state: connecting');

    let token;

    try {
      const state = getStateAccessor ? getStateAccessor() : {};
      token = state.auth?.token;
      console.log('[WebSocketService] Token retrieved:', token ? 'Token found' : 'No token');
      if (!token) {
        console.error('No authentication token found in Redux store');
      }
    } catch (e) {
      console.error('Error accessing token from Redux store:', e);
    }

    if (!token) {
      console.error('No authentication token found');
      this.connectionState = 'disconnected';
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.connect());
        }, 2000);
      });
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      console.log('[WebSocketService] Creating new WebSocket client');
      console.log('[WebSocketService] Using token for Authorization header');

      const sockJsUrl = (process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8084/ws').replace(/^ws/, 'http');
      console.log('[WebSocketService] SockJS URL:', sockJsUrl);

      this.client = new Client({
        webSocketFactory: () => new SockJS(sockJsUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.debug('WebSocket:', str),
        onWebSocketError: (error) => {
          console.error('[WebSocket] Connection error:', error);
          this.connectionState = 'error';
          this.connectionPromise = null;

          const errorInfo = {
            message: error.message,
            type: error.type || 'Unknown',
            timestamp: new Date().toISOString()
          };

          reject(errorInfo);
        },
        onConnect: () => {
          console.log('[WebSocketService] WebSocket connected');
          console.log('[WebSocketService] Connection headers sent:', {
            Authorization: `Bearer ${token ? 'TOKEN_PRESENT' : 'NO_TOKEN'}`,
            'Content-Type': 'application/json'
          });
          this.connectionState = 'connected';
          resolve();
        },
        onStompError: (frame) => {
          console.error('[WebSocketService] STOMP error:', frame.headers, frame.body);
          this.connectionState = 'error';
          const error = new Error(frame.headers.message);
          this.connectionPromise = null;
          reject(error);
        },
        onWebSocketClose: () => {
          console.log('[WebSocketService] WebSocket closed');
          this.connectionState = 'disconnected';
        },
        onDisconnect: () => {
          console.log('[WebSocketService] WebSocket disconnected');
          this.connectionState = 'disconnected';
          if (this.subscriptions.size > 0) {
            console.log('Attempting to restore subscriptions...');
            this.connect()
                .then(() => {
                  this.subscriptions.forEach((_, destination) => {
                    this.subscribe(destination);
                  });
                })
                .catch(console.error);
          }
        },
        onUnhandledMessage: (message) => {
          console.warn('[WebSocket] Unhandled message:', message);
        },
      });

      console.log('[WebSocketService] Activating WebSocket client');
      this.client.activate();
    });

    return this.connectionPromise;
  },

  subscribe: async function(destination, callback) {
    console.log('[WebSocketService] Subscribing to:', destination);

    try {
      await this.connect();
    } catch (error) {
      console.error('Connection failed during subscribe:', error);
      return null;
    }

    try {
      const sub = this.client.subscribe(destination, callback);
      this.subscriptions.set(destination, sub);
      console.log('[WebSocketService] Subscription successful');
      return sub;
    } catch (error) {
      console.error('Error subscribing:', error);
      return null;
    }
  },

  unsubscribe: function(subscriptionId) {
    console.log('[WebSocketService] Unsubscribing from:', subscriptionId);
    for (const [destination, sub] of this.subscriptions.entries()) {
      if (sub.id === subscriptionId) {
        sub.unsubscribe();
        this.subscriptions.delete(destination);
        console.log('[WebSocketService] Unsubscribed from:', destination);
        return true;
      }
    }

    console.warn('[WebSocketService] Subscription not found for ID:', subscriptionId);
    return false;
  },

  sendMessage: async function(destination, body) {
    console.log('[WebSocketService] Sending message to:', destination);
    console.log('[WebSocketService] Message body:', body);

    if (!this.client || !this.client.connected) {
      console.log('[WebSocketService] Client not connected, attempting to connect');
      await this.connect();
    }
    let token = null;
    try {
      const state = getStateAccessor ? getStateAccessor() : {};
      token = state.auth?.token;
    } catch (e) {
      console.error('Error accessing token for message headers:', e);
    }

    return new Promise((resolve, reject) => {
      try {
        const headers = { 'content-type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        this.client.publish({
          destination,
          body: JSON.stringify(body),
          headers: headers
        });
        console.log('[WebSocketService] Message published successfully with headers:', headers);
        resolve(true);
      } catch (error) {
        console.error('[WebSocketService] Error publishing message:', error);
        reject(error);
      }
    });
  },

  isConnected: function() {
    console.log('[WebSocketService] Checking connection state');
    return this.client && this.client.connected;
  },

  getConnectionState: function() {
    console.log('[WebSocketService] Getting connection state');
    return this.connectionState;
  },

  disconnect: function() {
    console.log('[WebSocketService] Disconnecting WebSocket client');
    if (this.client) {
      this.client.deactivate();
    }
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
    }
  }
};

export default WebSocketService;
