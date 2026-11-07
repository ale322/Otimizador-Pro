import React from 'react';
import { DeviceProfile } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { X, Cpu, CheckCircle2, ShieldCheck, Terminal, Smartphone, HardDrive, Fingerprint } from 'lucide-react';

interface DeviceInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: DeviceProfile;
}

export const DeviceInspectionModal: React.FC<DeviceInspectionModalProps> = ({
  isOpen,
  onClose,
  device,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inspection-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 id="inspection-title" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Auto-Detecção do Aparelho (DeviceHardwareDetector.kt)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Propriedades lidas automaticamente pelo aplicativo no primeiro milissegundo de execução
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-neutral-700 dark:text-neutral-300">
          
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3 text-blue-900 dark:text-blue-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p>
              <strong>Sim, 100% automático!</strong> Logo após a instalação, ao ser aberto pela primeira vez, o aplicativo chama <code className="font-mono bg-blue-200/50 dark:bg-blue-900/50 px-1 py-0.2 rounded">DeviceHardwareDetector.detectAllCharacteristics()</code>. O app lê os nós do sistema Android e ajusta todas as rotinas para a marca e versão específica do seu aparelho.
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Fabricante (Build.MANUFACTURER)</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{device.manufacturer} ({device.brandDisplayName})</div>
              <div className="text-[10px] text-neutral-500 font-sans">Ajusta o dicionário de lixeiras e o robô de acessibilidade</div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Modelo (Build.MODEL)</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{device.model} ({device.name})</div>
              <div className="text-[10px] text-neutral-500 font-sans">Identifica chip flash e partição física</div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Versão Android (Build.VERSION.SDK_INT)</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">API {device.apiLevel} ({device.androidName})</div>
              <div className="text-[10px] text-neutral-500 font-sans">
                {device.isLegacyStorage ? 'Aplica protocolo Android 8-10 (Legacy Storage)' : 'Aplica protocolo Android 11-15 (Scoped Storage)'}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Caminho do WhatsApp Resolvido</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {device.isLegacyStorage ? '/storage/emulated/0/WhatsApp' : '/storage/emulated/0/Android/media/com.whatsapp'}
              </div>
              <div className="text-[10px] text-neutral-500 font-sans">Comuta dinamicamente sem erro de arquivo não encontrado</div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Lixeira Oculta do Fabricante</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {device.manufacturer === 'SAMSUNG'
                  ? 'Android/data/com.sec.android.gallery3d/files/.Trash'
                  : device.manufacturer === 'XIAOMI'
                  ? 'MIUI/Gallery/cloud/.trashBin'
                  : '.Trash e .trashed-*'}
              </div>
              <div className="text-[10px] text-neutral-500 font-sans">Lixeira do app de Galeria nativa da marca</div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Sensor Biométrico & Nó Kernel</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{device.sensorModel}</div>
              <div className="text-[10px] text-neutral-500 font-sans">Nó verificado: <code className="text-emerald-600">{device.hardwareNode}</code></div>
            </div>

          </div>

          {/* Code snippet showing how Android reads it */}
          <div className="p-3.5 rounded-xl bg-neutral-950 text-neutral-300 font-mono text-[11px] space-y-1">
            <div className="text-neutral-500">// Executado automaticamente no MainActivity.onCreate():</div>
            <div className="text-purple-400">val profile = DeviceHardwareDetector(this).detectAllCharacteristics()</div>
            <div className="text-neutral-400">if (profile.isLegacyStorage) &#123; useLegacyStorageEngine() &#125; else &#123; useScopedStorageEngine() &#125;</div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
