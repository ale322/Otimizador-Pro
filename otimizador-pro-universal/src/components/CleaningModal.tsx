import React, { useState, useEffect } from 'react';
import { CleanableItem, DeviceProfile } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  X, 
  ArrowRight,
  FolderLock
} from 'lucide-react';

interface CleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: CleanableItem[];
  device: DeviceProfile;
  initialUsedBytes: number;
  initialFreeBytes: number;
  onCleaningFinished: (freedBytes: number) => void;
}

export const CleaningModal: React.FC<CleaningModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  device,
  initialUsedBytes,
  initialFreeBytes,
  onCleaningFinished,
}) => {
  const [stage, setStage] = useState<'SCANNING' | 'CLEANING' | 'DONE'>('SCANNING');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentFileLabel, setCurrentFileLabel] = useState<string>('Iniciando verificação do sistema de arquivos...');
  const [logs, setLogs] = useState<string[]>([]);

  const totalBytesToClean = selectedItems.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  const totalFilesToClean = selectedItems.reduce((acc, curr) => acc + curr.itemCount, 0);

  useEffect(() => {
    if (!isOpen) {
      setStage('SCANNING');
      setProgressPercent(0);
      setLogs([]);
      return;
    }

    // Step 1: Scanning phase
    setStage('SCANNING');
    setProgressPercent(10);
    setLogs([
      `[${new Date().toLocaleTimeString()}] Inicializando StorageCleanerEngine no ${device.name}`,
      `[${new Date().toLocaleTimeString()}] SELinux: Verificando permissão ${device.isLegacyStorage ? 'READ_EXTERNAL_STORAGE' : 'MANAGE_EXTERNAL_STORAGE'}`,
      `[${new Date().toLocaleTimeString()}] Varrendo /storage/emulated/0 (API Level ${device.apiLevel})`,
    ]);

    const timer1 = setTimeout(() => {
      setProgressPercent(35);
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Localizadas ${selectedItems.length} categorias candidatas (${formatBytes(totalBytesToClean, 1)})`,
        `[${new Date().toLocaleTimeString()}] Proteção de fotos Câmera (DCIM/Camera) e msgstore.db validada!`,
        ...prev,
      ]);
      setStage('CLEANING');
    }, 1200);

    const timer2 = setTimeout(() => {
      setProgressPercent(70);
      setCurrentFileLabel('Excluindo pastas temporárias .Shared e subpastas /Sent duplicadas...');
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Limpeza de lixeiras ocultas e .trashed-* concluída`,
        `[${new Date().toLocaleTimeString()}] Pastas órfãs de apps desinstalados removidas`,
        ...prev,
      ]);
    }, 2400);

    const timer3 = setTimeout(() => {
      setProgressPercent(100);
      setCurrentFileLabel('Otimização concluída!');
      setStage('DONE');
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] PROTOCOLO FINALIZADO: ${formatBytes(totalBytesToClean, 2)} recuperados com sucesso!`,
        ...prev,
      ]);
      onCleaningFinished(totalBytesToClean);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const newFreeBytes = initialFreeBytes + totalBytesToClean;
  const newUsedBytes = Math.max(0, initialUsedBytes - totalBytesToClean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {stage === 'DONE' ? 'Limpeza Concluída com Sucesso!' : 'Executando Limpeza Profunda...'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {device.brandDisplayName} · API {device.apiLevel}
              </p>
            </div>
          </div>

          {stage === 'DONE' && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Progress Bar & Status Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate pr-2">
                {currentFileLabel}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {progressPercent}%
              </span>
            </div>

            <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Before vs After Space Comparison (When finished or during) */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Espaço Livre Anterior</div>
              <div className="text-lg font-mono font-bold text-neutral-700 dark:text-neutral-300">
                {formatBytes(initialFreeBytes, 1)}
              </div>
            </div>

            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Novo Espaço Livre</div>
              <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>{formatBytes(newFreeBytes, 1)}</span>
                <span className="text-xs font-sans font-medium text-emerald-700 dark:text-emerald-300">
                  (+{formatBytes(totalBytesToClean, 1)})
                </span>
              </div>
            </div>
          </div>

          {/* Live Engine Log */}
          <div className="p-3.5 rounded-xl bg-neutral-950 text-neutral-300 font-mono text-[11px] space-y-1 max-h-[140px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className={index === 0 ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
                {log}
              </div>
            ))}
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nenhum chat, foto da Câmera (DCIM) ou backup de conversas foi tocado.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          {stage === 'DONE' ? (
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
            >
              Concluir e Voltar ao Painel
            </button>
          ) : (
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Processando com exclusão atômica segura...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
