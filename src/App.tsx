import { useState, useEffect, useRef } from 'react';
import { HeaderTabs } from './components/HeaderTabs';
import { BottomBar } from './components/BottomBar';
import { PWAInstallerBanner } from './components/PWAInstallerBanner';
import { StartPage } from './pages/StartPage';
import { RealtimeDataPage } from './pages/RealtimeDataPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { SettingsModal } from './pages/SettingsModal';
import { GPSService } from './services/GPSService';
import { FakeTelemetryEngine } from './services/FakeTelemetryEngine';
import { StorageService } from './services/StorageService';
import { TelemetryData, Settings } from './types/vesc';

export function App() {
  const [activeTab, setActiveTab] = useState<'START' | 'RT DATA' | 'PROFILES'>('START');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(StorageService.getSettings());

  // Stan telemetrii
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    gpsSpeed: 0,
    displaySpeed: 20,
    current: 0,
    power: 0,
    duty: 0,
    tempEsc: 28,
    tempMotor: 29,
    consumption: 0,
    consumptionAvg: 0,
    batteryPercent: 100,
    batteryRangeKm: 999,
    odometer: StorageService.getOdometer(),
    trip: StorageService.getTrip(),
    uptimeSeconds: 0,
    voltage: 52.0
  });

  const gpsServiceRef = useRef<GPSService | null>(null);
  const telemetryEngineRef = useRef<FakeTelemetryEngine>(new FakeTelemetryEngine());

  useEffect(() => {
    // Inicjalizacja GPS z bezpośrednią aktualizacją Odometer & Trip
    gpsServiceRef.current = new GPSService((deltaKm) => {
      const newOdo = StorageService.getOdometer() + deltaKm;
      const newTrip = StorageService.getTrip() + deltaKm;
      StorageService.setOdometer(newOdo);
      StorageService.setTrip(newTrip);
    });

    gpsServiceRef.current.start();

    // Glówna pętla telemetrii (10Hz / co 100ms)
    const interval = setInterval(() => {
      const rawGpsSpeed = gpsServiceRef.current ? gpsServiceRef.current.getSmoothedSpeed() : 0;
      const updatedData = telemetryEngineRef.current.update(rawGpsSpeed, 0.1, settings);
      setTelemetry(updatedData);
    }, 100);

    return () => {
      clearInterval(interval);
      gpsServiceRef.current?.stop();
    };
  }, [settings]);

  const handleConnected = () => {
    setIsConnected(true);
    setActiveTab('RT DATA');
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full bg-[#121315] text-white overflow-hidden justify-between">
      {/* Nagłówek Zakładek */}
      <HeaderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Główny Ekran w Zależności od Zakładki */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'START' && <StartPage onConnected={handleConnected} />}
        {activeTab === 'RT DATA' && (
          <RealtimeDataPage data={telemetry} onOpenSettings={() => setIsSettingsOpen(true)} />
        )}
        {activeTab === 'PROFILES' && <ProfilesPage />}
      </main>

      {/* Pasek Dolny */}
      <BottomBar isConnected={isConnected} onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Banner Instalacji PWA iOS */}
      <PWAInstallerBanner />

      {/* Modal Ustawień */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSet) => setSettings(newSet)}
      />
    </div>
  );
}

export default App;