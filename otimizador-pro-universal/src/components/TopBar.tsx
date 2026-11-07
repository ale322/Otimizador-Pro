import React from 'react';
import { DeviceProfile } from '../types/cleaner';
import { Smartphone, Sparkles, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedDevice: DeviceProfile;
  devices: DeviceProfile[];
  onSelectDevice: (device: DeviceProfile) => void;
  onRunFullScan: () => void;
  isScanning: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  selectedDevice,
  devices,
  onSelectDevice,
  onRunFullScan,
  isScanning,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
            OP
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
            Otimizador Pro Universal
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => onSelectTab('storage')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'storage'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Diagnóstico de Armazenamento
          </button>
          
          <button
            onClick={() => onSelectTab('packages')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'packages'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Pacotes de Limpeza (20+ GB)
          </button>

          <button
            onClick={() => onSelectTab('schedule')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'schedule'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Agendamento Automático
          </button>

          <button
            onClick={() => onSelectTab('ram')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'ram'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Otimizador de RAM
          </button>

          <button
            onClick={() => onSelectTab('performance')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'performance'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-amber-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Fluidez & Turbo
          </button>

          <button
            onClick={() => onSelectTab('accessibility')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'accessibility'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Robô de Acessibilidade
          </button>

          <button
            onClick={() => onSelectTab('code')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentTab === 'code'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Código-Fonte Kotlin & XML
          </button>
        </nav>

        {/* Zone 3: 1 primary action & device selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative inline-flex items-center">
            <Smartphone className="w-4 h-4 absolute left-2.5 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
            <select
              value={selectedDevice.id}
              onChange={(e) => {
                const dev = devices.find((d) => d.id === e.target.value);
                if (dev) onSelectDevice(dev);
              }}
              className="pl-8 pr-7 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
              title="Selecione o aparelho e versão do Android"
            >
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} (API {device.apiLevel})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 text-[10px] text-neutral-400">▼</div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isDarkMode ? 'Mudar para tema Claro' : 'Mudar para tema Escuro'}
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onRunFullScan}
            disabled={isScanning}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Escaneando...' : 'Escanear Armazenamento'}</span>
          </button>
        </div>

      </div>

      {/* Mobile nav scrollbar */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 gap-4 text-xs font-medium no-scrollbar">
        <button
          onClick={() => onSelectTab('storage')}
          className={`whitespace-nowrap ${currentTab === 'storage' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-500'}`}
        >
          Armazenamento
        </button>
        <button
          onClick={() => onSelectTab('packages')}
          className={`whitespace-nowrap ${currentTab === 'packages' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-500'}`}
        >
          Limpeza 20+ GB
        </button>
        <button
          onClick={() => onSelectTab('schedule')}
          className={`whitespace-nowrap ${currentTab === 'schedule' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-500'}`}
        >
          Agendamento
        </button>
        <button
          onClick={() => onSelectTab('ram')}
          className={`whitespace-nowrap ${currentTab === 'ram' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-500'}`}
        >
          RAM & Processos
        </button>
        <button
          onClick={() => onSelectTab('performance')}
          className={`whitespace-nowrap ${currentTab === 'performance' ? 'text-amber-500 font-semibold' : 'text-neutral-500'}`}
        >
          Fluidez & Turbo
        </button>
        <button
          onClick={() => onSelectTab('accessibility')}
          className={`whitespace-nowrap ${currentTab === 'accessibility' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-500'}`}
        >
          Robô de Acessibilidade
        </button>
        <button
          onClick={() => onSelectTab('code')}
          className={`whitespace-nowrap ${currentTab === 'code' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-500'}`}
        >
          Código Kotlin & XML
        </button>
      </div>
    </header>
  );
};
