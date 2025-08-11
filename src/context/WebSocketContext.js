import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import WebSocketService from '@/services/websocketService';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const ws = useRef(WebSocketService);
  const [connectionState, setConnectionState] = useState(ws.current.getConnectionState());

  useEffect(() => {
    setConnectionState(ws.current.getConnectionState());
  }, []);

  const value = {
    sendMessage: ws.current.sendMessage.bind(ws.current),
    subscribe: ws.current.subscribe.bind(ws.current),
    unsubscribe: ws.current.unsubscribe.bind(ws.current),
    connectionState,
    isConnected: ws.current.isConnected.bind(ws.current),
  };

  return (
      <WebSocketContext.Provider value={value}>
        {children}
      </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  return useContext(WebSocketContext);
} 