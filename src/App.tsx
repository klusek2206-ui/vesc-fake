import { useState, useEffect } from 'react';
import { FakeVESCService } from './services/FakeVESCService';
import { TelemetryData, AppSettings } from './types/vesc';
import { HeaderTabs } from './components/HeaderTabs';
import { BottomBar } from './components/BottomBar';
import { PWAInstallerBanner } from './components/PWAInstallerBanner';
import { StartPage } from './pages/StartPage';
import { RealtimeDataPage } from './pages/RealtimeDataPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { SettingsModal } from './pages/SettingsModal';

const vescService = new FakeVESCService();

export function App() {
  const [activeTab, setActiveTab] = useState<'rt' | 'profiles' | 'start'>('start');
  const [showSettings, setShowSettings] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    gpsSpeed: 0,
    displaySpeed: 0,
    current: 0,
    power: 0,
    duty: 0,
    batteryPercent: 100,
    batteryRangeKm: 45,
    tempEsc: 30,
    tempMotor: 30,
    consumption: 0,
    consumptionAvg: 0,
    odometer: 0,
    trip: 0,
    uptimeSeconds: 0
  });

  useEffect(() => {
    vescService.start((data) => {
      setTelemetry(data);
    });

    return () => vescService.stop();
  }, []);

  const handleSelectProfile = (id: string) => {
    vescService.setActiveProfile(id);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    vescService.updateSettings(newSettings);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#121315] text-white overflow-hidden">
      <PWAInstallerBanner />

      <HeaderTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeProfileName={vescService.activeProfile.name}
      />

      {activeTab === 'start' && (
        <StartPage
          onStartClick={() => setActiveTab('rt')}
          activeProfileName={vescService.activeProfile.name}
        />
      )}

      {activeTab === 'rt' && (
        <RealtimeDataPage
          data={telemetry}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {activeTab === 'profiles' && (
        <ProfilesPage
          profiles={vescService.profiles}
          onSelectProfile={handleSelectProfile}
        />
      )}

      <BottomBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {showSettings && (
        <SettingsModal
          settings={vescService.settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;