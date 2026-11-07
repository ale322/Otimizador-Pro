import React, { useState, useEffect } from 'react';
import { 
  DEVICE_PROFILES, 
  INITIAL_STORAGE_CATEGORIES, 
  INITIAL_CLEAN_ITEMS, 
  MOCK_PROCESSES, 
  MOCK_APP_STORAGE_WEIGHTS, 
  MOCK_BIOMETRIC_STATUS 
} from './data/mockDeviceData';
import { DeviceProfile, CleanableItem, ProcessItem, AppStorageWeight, StorageCategoryBreakdown, BiometricDiagnosticResult, ScheduleConfig, ScheduleExecutionLog } from './types/cleaner';
import { TopBar } from './components/TopBar';
import { StorageDashboard } from './components/StorageDashboard';
import { CleaningPackages } from './components/CleaningPackages';
import { ScheduleCleaner } from './components/ScheduleCleaner';
import { RamOptimizer } from './components/RamOptimizer';
import { PerformanceTweaker } from './components/PerformanceTweaker';
import { AccessibilitySimulator } from './components/AccessibilitySimulator';
import { AppWeightRank } from './components/AppWeightRank';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { SystemExplainerModal } from './components/SystemExplainerModal';
import { CleaningModal } from './components/CleaningModal';
import { formatBytes } from './utils/formatters';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [selectedDevice, setSelectedDevice] = useState<DeviceProfile>(DEVICE_PROFILES[0]);
  const [currentTab, setCurrentTab] = useState<string>('storage');
  
  // Storage state
  const [storageCategories, setStorageCategories] = useState<StorageCategoryBreakdown[]>(INITIAL_STORAGE_CATEGORIES);
  const [cleanItems, setCleanItems] = useState<CleanableItem[]>(INITIAL_CLEAN_ITEMS);
  const [processes, setProcesses] = useState<ProcessItem[]>(MOCK_PROCESSES);
  const [apps, setApps] = useState<AppStorageWeight[]>(MOCK_APP_STORAGE_WEIGHTS);
  const [biometricStatus, setBiometricStatus] = useState<BiometricDiagnosticResult>(MOCK_BIOMETRIC_STATUS);

  // Modals state
  const [isSystemExplainerOpen, setIsSystemExplainerOpen] = useState<boolean>(false);
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Cleaning Schedule (WorkManager) state
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    isEnabled: true,
    scheduleMode: 'BOTH',
    targetTime: '03:00',
    frequency: 'DAILY',
    requireIdle: true,
    requireCharging: true,
    requireBatteryNotLow: true,
    requireWifi: false,
    cleanTrash: true,
    cleanScenario1: true,
    cleanScenario2Private: false,
    cleanOrphanFolders: true,
    cleanZeroPasswordCache: true,
    killRamProcesses: true,
    showMorningNotification: true,
  });

  const [scheduleLogs, setScheduleLogs] = useState<ScheduleExecutionLog[]>([
    {
      id: 'log-1',
      timestamp: 'Hoje às 03:00:14',
      triggerReason: 'Horário Noturno Agendado (03:00) + Aparelho Ocioso',
      bytesFreed: 2.45 * 1024 * 1024 * 1024,
      itemsRemoved: 642,
      durationMs: 1420,
      status: 'SUCCESS',
      criteriaMet: { idle: true, charging: true, batteryOk: true },
    },
    {
      id: 'log-2',
      timestamp: 'Ontem às 03:00:08',
      triggerReason: 'Horário Noturno Agendado (03:00) + Aparelho Ocioso',
      bytesFreed: 1.82 * 1024 * 1024 * 1024,
      itemsRemoved: 410,
      durationMs: 1180,
      status: 'SUCCESS',
      criteriaMet: { idle: true, charging: true, batteryOk: true },
    },
    {
      id: 'log-3',
      timestamp: '03/11 às 03:00:22',
      triggerReason: 'Horário Noturno Agendado (03:00) + Aparelho Ocioso',
      bytesFreed: 3.10 * 1024 * 1024 * 1024,
      itemsRemoved: 890,
      durationMs: 1640,
      status: 'SUCCESS',
      criteriaMet: { idle: true, charging: true, batteryOk: true },
    },
  ]);

  const [isSimulatingWorker, setIsSimulatingWorker] = useState<boolean>(false);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Recalculate totals
  const totalStorageBytes = selectedDevice.storageTotalBytes;
  const usedStorageBytes = storageCategories.reduce((acc, cat) => acc + cat.bytes, 0);
  const freeStorageBytes = Math.max(0, totalStorageBytes - usedStorageBytes);
  const totalRecoverableBytes = cleanItems.reduce((acc, item) => acc + item.sizeBytes, 0);

  // Switch device handler
  const handleSelectDevice = (device: DeviceProfile) => {
    setSelectedDevice(device);
    // Adjust total bytes if legacy (e.g. 64GB on S9)
    if (device.storageCommercialGB === 64) {
      setStorageCategories(
        INITIAL_STORAGE_CATEGORIES.map((cat) => ({
          ...cat,
          bytes: cat.bytes * 0.5,
          cleanableBytes: cat.cleanableBytes * 0.5,
        }))
      );
      setCleanItems(
        INITIAL_CLEAN_ITEMS.map((item) => ({
          ...item,
          sizeBytes: item.sizeBytes * 0.5,
        }))
      );
    } else {
      setStorageCategories(INITIAL_STORAGE_CATEGORIES);
      setCleanItems(INITIAL_CLEAN_ITEMS);
    }
  };

  // Toggle single item
  const handleToggleItem = (id: string) => {
    setCleanItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Select all items
  const handleSelectAll = (select: boolean) => {
    setCleanItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  // Kill single background process
  const handleKillProcess = (packageName: string) => {
    setProcesses((prev) =>
      prev.map((p) => (p.packageName === packageName ? { ...p, isKilled: true, cpuPercent: 0 } : p))
    );
  };

  // Kill all background processes
  const handleKillAllProcesses = () => {
    setProcesses((prev) => prev.map((p) => ({ ...p, isKilled: true, cpuPercent: 0 })));
  };

  // Test biometrics
  const handleTestBiometrics = () => {
    setBiometricStatus({
      ...MOCK_BIOMETRIC_STATUS,
      latencyMs: Math.floor(Math.random() * 10) + 12,
      nodeReadValue: `HW_ID: 0x82a9 | STATE: CALIBRATED_READY | LATENCY: ${Math.floor(Math.random() * 10) + 12}ms`,
    });
  };

  // Clean single app cache from AppWeightRank
  const handleCleanAppCache = (packageName: string) => {
    setApps((prev) =>
      prev.map((a) =>
        a.packageName === packageName
          ? { ...a, cacheBytes: 0, totalBytes: a.appCodeBytes + a.userDataBytes }
          : a
      )
    );
  };

  // Start deep clean modal
  const handleExecuteClean = () => {
    setIsCleaningModalOpen(true);
  };

  // On clean complete
  const handleCleaningFinished = (freedBytes: number) => {
    // Update categories (shrink trash, outro, audio, apps, etc.)
    setStorageCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === 'trash') {
          return { ...cat, bytes: 0.1 * 1024 * 1024 * 1024, cleanableBytes: 0 };
        }
        if (cat.id === 'outro') {
          return { ...cat, bytes: Math.max(1.2 * 1024 * 1024 * 1024, cat.bytes - 8.5 * 1024 * 1024 * 1024), cleanableBytes: 0.2 * 1024 * 1024 * 1024 };
        }
        if (cat.id === 'audio') {
          return { ...cat, bytes: Math.max(2.1 * 1024 * 1024 * 1024, cat.bytes - 1.8 * 1024 * 1024 * 1024), cleanableBytes: 0 };
        }
        if (cat.id === 'apks') {
          return { ...cat, bytes: 0, cleanableBytes: 0 };
        }
        return cat;
      })
    );

    // Mark cleaned items as empty/unselected
    setCleanItems((prev) =>
      prev.map((item) =>
        item.selected
          ? { ...item, sizeBytes: 0, itemCount: 0, selected: false }
          : item
      )
    );
  };

  // Run full scan action
  const handleRunFullScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCurrentTab('packages');
    }, 900);
  };

  // Trigger simulated background WorkManager run
  const handleTriggerScheduleTest = () => {
    setIsSimulatingWorker(true);
    setTimeout(() => {
      const simulatedBytes = 2.18 * 1024 * 1024 * 1024;
      const newLog: ScheduleExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Agora (Disparo Simulado)',
        triggerReason: 'Simulação Manual do Worker: Restrições Satisfeitas',
        bytesFreed: simulatedBytes,
        itemsRemoved: 530,
        durationMs: 840,
        status: 'SUCCESS',
        criteriaMet: { idle: true, charging: true, batteryOk: true },
      };

      setScheduleLogs((prev) => [newLog, ...prev]);

      // Free some storage in category
      setStorageCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === 'trash') {
            return { ...cat, bytes: Math.max(0.2 * 1024 * 1024 * 1024, cat.bytes * 0.4) };
          }
          if (cat.id === 'outro') {
            return { ...cat, bytes: Math.max(2 * 1024 * 1024 * 1024, cat.bytes * 0.8) };
          }
          return cat;
        })
      );

      setIsSimulatingWorker(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* 3-Zone Contract Top Bar */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedDevice={selectedDevice}
        devices={DEVICE_PROFILES}
        onSelectDevice={handleSelectDevice}
        onRunFullScan={handleRunFullScan}
        isScanning={isScanning}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Navigation Tabs Content */}
        {currentTab === 'storage' && (
          <div className="space-y-8">
            <StorageDashboard
              device={selectedDevice}
              categories={storageCategories}
              totalBytes={totalStorageBytes}
              usedBytes={usedStorageBytes}
              freeBytes={freeStorageBytes}
              recoverableBytes={totalRecoverableBytes}
              onOpenCleaningPackages={() => setCurrentTab('packages')}
              onOpenSystemExplainer={() => setIsSystemExplainerOpen(true)}
            />

            {/* App Weight Ranking Section */}
            <AppWeightRank
              apps={apps}
              onCleanAppCache={handleCleanAppCache}
            />
          </div>
        )}

        {currentTab === 'packages' && (
          <CleaningPackages
            items={cleanItems}
            onToggleItem={handleToggleItem}
            onSelectAll={handleSelectAll}
            onExecuteClean={handleExecuteClean}
            device={selectedDevice}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleCleaner
            device={selectedDevice}
            config={scheduleConfig}
            onUpdateConfig={setScheduleConfig}
            logs={scheduleLogs}
            onTriggerTestRun={handleTriggerScheduleTest}
            isSimulating={isSimulatingWorker}
          />
        )}

        {currentTab === 'ram' && (
          <RamOptimizer
            device={selectedDevice}
            processes={processes}
            onKillProcess={handleKillProcess}
            onKillAllProcesses={handleKillAllProcesses}
            biometricStatus={biometricStatus}
            onTestBiometrics={handleTestBiometrics}
          />
        )}

        {currentTab === 'performance' && (
          <PerformanceTweaker
            device={selectedDevice}
          />
        )}

        {currentTab === 'accessibility' && (
          <AccessibilitySimulator
            device={selectedDevice}
          />
        )}

        {currentTab === 'code' && (
          <SourceCodeViewer />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Otimizador Pro Universal</span>
            <span aria-hidden="true">·</span>
            <span>Compatibilidade Universal: Android 8.0 (API 26) ao Android 15 (API 35)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>AOSP · One UI · HyperOS · MyUX · Realme UI</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Risco para Dados Pessoais</span>
          </div>
        </div>
      </footer>

      {/* System Storage Explainer Dialog */}
      <SystemExplainerModal
        isOpen={isSystemExplainerOpen}
        onClose={() => setIsSystemExplainerOpen(false)}
        device={selectedDevice}
      />

      {/* Live Deep Cleaning & Recovery Modal */}
      <CleaningModal
        isOpen={isCleaningModalOpen}
        onClose={() => setIsCleaningModalOpen(false)}
        selectedItems={cleanItems.filter((i) => i.selected)}
        device={selectedDevice}
        initialUsedBytes={usedStorageBytes}
        initialFreeBytes={freeStorageBytes}
        onCleaningFinished={handleCleaningFinished}
      />

    </div>
  );
}
