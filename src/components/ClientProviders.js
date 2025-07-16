"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthProvider from "@/components/auth/AuthProvider";
import { setStoreAccessors } from "@/services/api";

export default function ClientProviders({ children }) {
  // Inject the store accessors for api.js
  setStoreAccessors({ getState: store.getState });
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
} 