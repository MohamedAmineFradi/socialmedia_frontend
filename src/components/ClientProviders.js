"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthProvider from "@/components/auth/AuthProvider";
import { setStoreAccessors } from "@/services/api";
import { setWebSocketStoreAccessors } from "@/services/websocketService";
import { WebSocketProvider } from "@/context/WebSocketContext";

export default function ClientProviders({ children }) {
    setStoreAccessors({ getState: store.getState });
    setWebSocketStoreAccessors({ getState: store.getState });
    return (
        <Provider store={store}>
            <WebSocketProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </WebSocketProvider>
        </Provider>
    );
} 