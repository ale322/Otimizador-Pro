import React, { useState, useEffect } from 'react';
import { DeviceProfile } from '../types/cleaner';
import { 
  Bot, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface AccessibilitySimulatorProps {
  device: DeviceProfile;
}

export const AccessibilitySimulator: React.FC<AccessibilitySimulatorProps> = ({ device }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>(device.manufacturer);
  const [language, setLanguage] = useState<'PT' | 'EN'>('PT');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentAppIndex, setCurrentAppIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Idle, 1: App Settings, 2: Storage Clicked, 3: Clear Cache Clicked, 4: Confirmed
  const [logHistory, setLogHistory] = useState<string[]>([]);

  const zeroPasswordApps = [
    { pkg: 'com.google.android.youtube', name: 'YouTube', iconColor: 'bg-red-600', reason: 'Reloga automaticamente via Conta Google do sistema' },
    { pkg: 'com.google.android.apps.photos', name: 'Google Fotos', iconColor: 'bg-blue-500', reason: 'Limpa apenas banco de thumbnails corrompidos' },
    { pkg: 'com.google.android.tts', name: 'Google Speech (TTS)', iconColor: 'bg-amber-600', reason: 'Descarta modelos de voz offline antigos' },
    { pkg: 'com.hiya.star', name: 'Samsung Smart Call / Hiya', iconColor: 'bg-emerald-600', reason: 'Renova banco offline de números de spam' },
  ];

  // Multi-brand text mappings
  const brandButtonLabels: Record<string, { storage: string; clearCache: string; confirm: string }> = {
    SAMSUNG: {
      storage: language === 'PT' ? 'Armazenamento' : 'Storage',
      clearCache: language === 'PT' ? 'Limpar cache' : 'Clear cache',
      confirm: language === 'PT' ? 'Apagar' : 'Delete',
    },
    XIAOMI: {
      storage: language === 'PT' ? 'Armazenamento' : 'Storage',
      clearCache: language === 'PT' ? 'Limpar dados' : 'Clear data',
      confirm: language === 'PT' ? 'OK' : 'OK',
    },
    MOTOROLA: {
      storage: language === 'PT' ? 'Armazenamento e cache' : 'Storage & cache',
      clearCache: language === 'PT' ? 'Limpar cache' : 'Clear cache',
      confirm: language === 'PT' ? 'Limpar' : 'Clear',
    },
    GOOGLE: {
      storage: language === 'PT' ? 'Armazenamento e cache' : 'Storage & cache',
      clearCache: language === 'PT' ? 'Limpar cache' : 'Clear cache',
      confirm: language === 'PT' ? 'Excluir' : 'Delete',
    },
    REALME: {
      storage: language === 'PT' ? 'Espaço de armazenamento' : 'Storage usage',
      clearCache: language === 'PT' ? 'Limpar cache' : 'Clear cache',
      confirm: language === 'PT' ? 'Confirmar' : 'Confirm',
    },
  };

  const currentLabels = brandButtonLabels[selectedBrand] || brandButtonLabels.SAMSUNG;
  const currentApp = zeroPasswordApps[currentAppIndex];

  // Robot simulation state machine
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      if (currentStep === 1) {
        // App opened -> finding Storage button
        timer = setTimeout(() => {
          setLogHistory((prev) => [
            `[${new Date().toLocaleTimeString()}] findAccessibilityNodeInfosByText("${currentLabels.storage}") -> Nó clicado!`,
            ...prev.slice(0, 7),
          ]);
          setCurrentStep(2);
        }, 1100);
      } else if (currentStep === 2) {
        // Storage opened -> finding Clear Cache button
        timer = setTimeout(() => {
          setLogHistory((prev) => [
            `[${new Date().toLocaleTimeString()}] findAccessibilityNodeInfosByText("${currentLabels.clearCache}") -> performAction(ACTION_CLICK)`,
            ...prev.slice(0, 7),
          ]);
          setCurrentStep(3);
        }, 1100);
      } else if (currentStep === 3) {
        // Clear cache dialog -> confirming
        timer = setTimeout(() => {
          setLogHistory((prev) => [
            `[${new Date().toLocaleTimeString()}] Diálogo confirmado com "${currentLabels.confirm}". Cache de ${currentApp.name} liberado!`,
            ...prev.slice(0, 7),
          ]);
          setCurrentStep(4);
        }, 900);
      } else if (currentStep === 4) {
        // Advancing to next app
        timer = setTimeout(() => {
          if (currentAppIndex < zeroPasswordApps.length - 1) {
            setCurrentAppIndex((prev) => prev + 1);
            setCurrentStep(1);
          } else {
            setIsRunning(false);
            setLogHistory((prev) => [
              `[${new Date().toLocaleTimeString()}] PROTOCOLO ZERO SENHAS CONCLUÍDO! Todos os 4 apps otimizados com sucesso.`,
              ...prev.slice(0, 7),
            ]);
          }
        }, 1200);
      }
    }

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, currentAppIndex, currentLabels, currentApp, zeroPasswordApps.length]);

  const handleStartRobot = () => {
    setCurrentAppIndex(0);
    setCurrentStep(1);
    setIsRunning(true);
    setLogHistory([
      `[${new Date().toLocaleTimeString()}] AutoCacheAccessibilityService ativado para ${zeroPasswordApps[0].pkg}`,
    ]);
  };

  const handleStopRobot = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogHistory((prev) => [`[${new Date().toLocaleTimeString()}] Automação pausada pelo usuário.`, ...prev]);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Robô de Acessibilidade Multi-Fabricante (AutoCacheAccessibilityService)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Automação nativa sem necessidade de root para limpar caches pesados sem exigir senhas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium">Idioma:</span>
            <div className="p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setLanguage('PT')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  language === 'PT'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                PT-BR
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  language === 'EN'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Brand selector buttons */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500">Fabricante Alvo:</span>
          {[
            { id: 'SAMSUNG', name: 'Samsung (One UI)' },
            { id: 'XIAOMI', name: 'Xiaomi (HyperOS/MIUI)' },
            { id: 'MOTOROLA', name: 'Motorola (MyUX)' },
            { id: 'GOOGLE', name: 'Google Pixel (AOSP)' },
            { id: 'REALME', name: 'Realme (Realme UI)' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedBrand === b.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Simulator Grid: Smartphone Screen + Robot Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Smartphone Screen Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-neutral-900 rounded-[36px] p-3 shadow-2xl border-4 border-neutral-800">
            {/* Screen Bezel & Dynamic Island / Camera hole */}
            <div className="w-full bg-neutral-950 rounded-[28px] overflow-hidden border border-neutral-800/80 text-white flex flex-col min-h-[500px]">
              
              {/* Android Status Bar */}
              <div className="px-5 py-2.5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>18:30</span>
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-700" />
                <span>5G · 98%</span>
              </div>

              {/* OS App Details Screen */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md ${currentApp.iconColor}`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold">{currentApp.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{currentApp.pkg}</div>
                  </div>

                  {/* App Action Tiles */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">
                      Abrir
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">
                      Forçar parada
                    </div>
                  </div>

                  {/* Settings Item: Storage */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      currentStep === 1
                        ? 'border-blue-500 bg-blue-950/40 text-blue-200 ring-2 ring-blue-500/50'
                        : currentStep >= 2
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold">{currentLabels.storage}</div>
                        <div className="text-[10px] text-neutral-400">1.84 GB usados no armazenamento interno</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>

                  {/* Storage Sub-screen (Visible when step >= 2) */}
                  {currentStep >= 2 && (
                    <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/90 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                        <span>App: 180 MB</span>
                        <span>Dados: 420 MB</span>
                        <span>Cache: 1.24 GB</span>
                      </div>

                      {/* Clear Cache Action Button */}
                      <div
                        className={`p-2.5 rounded-lg text-center text-xs font-semibold transition-all ${
                          currentStep === 2
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400 animate-pulse'
                            : currentStep >= 3
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {currentLabels.clearCache}
                      </div>

                      {/* Confirmation Dialog Overlay when step === 3 */}
                      {currentStep === 3 && (
                        <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-center space-y-2 animate-in zoom-in-95">
                          <div className="text-[11px] text-neutral-300">
                            Confirmar exclusão de dados de cache temporários?
                          </div>
                          <div className="flex justify-center gap-2">
                            <span className="px-3 py-1 rounded bg-blue-600 text-[10px] font-bold text-white ring-1 ring-blue-300">
                              {currentLabels.confirm}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Success Checkmark when step === 4 */}
                      {currentStep === 4 && (
                        <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-center text-[11px] font-semibold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cache de {currentApp.name} Zerado!</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Android Navigation Bar */}
                <div className="pt-4 flex items-center justify-center">
                  <div className="w-24 h-1 rounded-full bg-neutral-600" />
                </div>

              </div>

            </div>
          </div>

          <div className="mt-3 text-xs text-neutral-500 font-mono text-center">
            Simulador de tela: {selectedBrand} · {language === 'PT' ? 'Português' : 'English'}
          </div>
        </div>

        {/* Automation Controls & Telemetry Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Fila do Pacote "Zero Senhas"
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Estes 4 aplicativos relogam automaticamente pela Conta Google ou chip SIM:
                </p>
              </div>

              {!isRunning ? (
                <button
                  onClick={handleStartRobot}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Iniciar Robô de Limpeza</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRobot}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pausar Automação</span>
                </button>
              )}
            </div>

            {/* App Progress Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {zeroPasswordApps.map((app, idx) => {
                const isCurrent = isRunning && currentAppIndex === idx;
                const isFinished = currentAppIndex > idx || (!isRunning && currentAppIndex === zeroPasswordApps.length - 1 && currentStep === 4);

                return (
                  <div
                    key={app.pkg}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                        : isFinished
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{app.name}</span>
                      {isFinished ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                          LIMPAR CACHE...
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400">Na fila</span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                      {app.reason}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TikTok & Kwai in-app cleaner shortcut */}
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Automação TikTok & Kwai: </span>
                <span className="text-neutral-500 dark:text-neutral-400">Abre diretamente em Perfil &gt; Liberar espaço &gt; Limpar Cache sem logout.</span>
              </div>
              <button
                onClick={() => {
                  setLogHistory((prev) => [
                    `[${new Date().toLocaleTimeString()}] Intent disparado: com.zhiliaoapp.musically/com.ss.android.ugc.aweme.clean.CleanActivity`,
                    ...prev.slice(0, 7),
                  ]);
                }}
                className="px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors shrink-0"
              >
                Testar Atalho
              </button>
            </div>

          </div>

          {/* Live Robot Accessibility Event Log Console */}
          <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-950 rounded-xl p-4 text-neutral-100 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-1 border-b border-neutral-800">
              <span className="font-mono">Log de Eventos do AccessibilityService</span>
              <span className="text-[10px]">RootInActiveWindow Telemetry</span>
            </div>

            <div className="font-mono text-xs space-y-1.5 min-h-[140px] text-neutral-300">
              {logHistory.length === 0 ? (
                <div className="text-neutral-600 italic">
                  Pronto. Clique em "Iniciar Robô de Limpeza" para ver os nós de tela sendo identificados e clicados.
                </div>
              ) : (
                logHistory.map((log, idx) => (
                  <div key={idx} className={idx === 0 ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
