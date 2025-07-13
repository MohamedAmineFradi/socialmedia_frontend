"use client";

import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function BackendStatus() {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        setIsChecking(true);
        await api.get('/public/test');
        setIsBackendAvailable(true);
      } catch (error) {
        console.error('Backend status check failed:', error);
        setIsBackendAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackendStatus();
  }, []);

  if (isChecking) {
    return null; // Don't show anything while checking
  }

  if (!isBackendAvailable) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚠️</span>
          <h3 className="font-bold">Backend Unavailable</h3>
        </div>
        <p className="text-sm mb-3">
          The backend server is not running. Please start the Spring Boot backend on port 8084.
        </p>
        <div className="text-xs space-y-1">
          <p><strong>To start the backend:</strong></p>
          <p>1. Open terminal in socialMediaBackend folder</p>
          <p>2. Run: <code className="bg-red-600 px-1 rounded">mvn spring-boot:run</code></p>
          <p>3. Wait for "Started SocialMediaBackendApplication" message</p>
        </div>
      </div>
    );
  }

  return null;
} 