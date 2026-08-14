import React from 'react';
import { RealtimeDataPage } from './pages/RealtimeDataPage';

export function App() {
  return (
    <div className="w-full h-[100dvh] bg-[#1a1a1a] overflow-hidden select-none font-sans text-white touch-none">
      <RealtimeDataPage />
    </div>
  );
}

export default App;