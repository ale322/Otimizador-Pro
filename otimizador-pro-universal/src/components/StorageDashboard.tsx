import React, { useState } from 'react';
import { DeviceProfile, StorageCategoryBreakdown } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  HardDrive, 
  Info, 
  ShieldCheck, 
  Cpu, 
  HelpCircle,
  Video,
  Grid,
  Image as ImageIcon,
  FolderArchive,
  Trash2,
  Music,
  FileText,
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';

import { DeviceInspectionModal } from './DeviceInspectionModal';
import { Smartphone } from 'lucide-react';

interface StorageDashboardProps {
  device: DeviceProfile;
  categories: StorageCategoryBreakdown[];
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  recoverableBytes: number;
  onOpenCleaningPackages: () => void;
  onOpenSystemExplainer: () => void;
}

export const StorageDashboard: React.FC<StorageDashboardProps> = ({
  device,
  categories,
  totalBytes,
  usedBytes,
  freeBytes,
  recoverableBytes,
  onOpenCleaningPackages,
  onOpenSystemExplainer,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<StorageCategoryBreakdown | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState<boolean>(false);

  const usedPercentage = Math.min(100, (usedBytes / totalBytes) * 100);
  const freePercentage = Math.max(0, 100 - usedPercentage);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Grid': return <Grid className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Image': return <ImageIcon className="w-4 h-4" />;
      case 'FolderArchive': return <FolderArchive className="w-4 h-4" />;
      case 'Trash2': return <Trash2 className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Device Architecture & Compatibility Banner */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">{device.manufacturer}</span>
              <span aria-hidden="true">·</span>
              <span>{device.model}</span>
              <span aria-hidden="true">·</span>
              <span>{device.uiName}</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>{device.name}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                API {device.apiLevel} ({device.androidName.split(' ')[0]} {device.androidVersion})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Método de Acesso ao Armazenamento</div>
              <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {device.isLegacyStorage ? (
                  <span>READ/WRITE_EXTERNAL_STORAGE (Legacy)</span>
                ) : (
                  <span>MANAGE_EXTERNAL_STORAGE + SAF (Scoped)</span>
                )}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Compatibility Details Strip */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div>
            <span className="font-medium text-neutral-800 dark:text-neutral-300">Raiz WhatsApp: </span>
            <code className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
              {device.isLegacyStorage ? '/storage/emulated/0/WhatsApp' : '/storage/emulated/0/Android/media/com.whatsapp'}
            </code>
          </div>
          <div>
            <span className="font-medium text-neutral-800 dark:text-neutral-300">SELinux Sandbox: </span>
            <span className="text-neutral-700 dark:text-neutral-300">{device.apiLevel >= 30 ? 'Restrito em Android/data (Usa SAF / Accessibility)' : 'Livre leitura em /sdcard'}</span>
          </div>
          <div>
            <span className="font-medium text-neutral-800 dark:text-neutral-300">Sensor Biométrico: </span>
            <span className="text-neutral-700 dark:text-neutral-300">{device.sensorModel}</span>
          </div>

          <button
            onClick={() => setIsInspectionOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors ml-auto"
            title="Ver como o app identifica automaticamente o fabricante e hardware"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Como o App Detecta Seu Celular?</span>
          </button>
        </div>
      </div>

      {/* Main Storage Breakdown ("Analisar Armazenamento") */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Análise de Armazenamento Interno (StatFs)</div>
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-baseline gap-2">
              <span className="font-mono tabular-nums">{formatBytes(usedBytes, 1)}</span>
              <span className="text-sm font-normal text-neutral-500">usados de {formatBytes(totalBytes, 0)} ({usedPercentage.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Espaço Livre Disponível</div>
              <div className="text-lg font-bold font-mono tabular-nums text-neutral-800 dark:text-neutral-200">
                {formatBytes(freeBytes, 1)}
              </div>
            </div>
            
            <button
              onClick={onOpenSystemExplainer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Entenda a diferença matemática entre GB decimal e GiB binário"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Por que o Sistema ocupa tanto?</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar like Samsung One UI / Files by Google */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex shadow-inner">
            {categories.map((cat) => {
              const widthPct = (cat.bytes / totalBytes) * 100;
              return (
                <div
                  key={cat.id}
                  style={{ width: `${widthPct}%`, backgroundColor: cat.color }}
                  className="h-full transition-all duration-300 hover:opacity-85 cursor-pointer relative"
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  title={`${cat.name}: ${formatBytes(cat.bytes, 1)}`}
                />
              );
            })}
            {/* Free space segment */}
            <div
              style={{ width: `${freePercentage}%` }}
              className="h-full bg-neutral-200 dark:bg-neutral-700/60 transition-all duration-300"
              title={`Espaço Livre: ${formatBytes(freeBytes, 1)}`}
            />
          </div>

          {/* Hover category tooltip readout */}
          <div className="h-5 flex items-center justify-between text-xs">
            {hoveredCategory ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: hoveredCategory.color }} />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{hoveredCategory.name}:</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">{formatBytes(hoveredCategory.bytes, 2)}</span>
                <span className="text-neutral-500">({((hoveredCategory.bytes / totalBytes) * 100).toFixed(1)}%)</span>
                <span className="text-neutral-400">— {hoveredCategory.description}</span>
              </div>
            ) : (
              <div className="text-neutral-500 dark:text-neutral-400">
                Passe o mouse sobre as faixas para inspecionar cada partição e categoria.
              </div>
            )}
            <div className="text-neutral-500 dark:text-neutral-400 font-mono">
              Livre: {freePercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Category Grid Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-start justify-between gap-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: cat.color }}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                    {cat.description}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {formatBytes(cat.bytes, 1)}
                </div>
                {cat.cleanableBytes > 0 && (
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    -{formatBytes(cat.cleanableBytes, 1)} limpável
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action bar for Recovering 20+ GB */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                Protocolo de Recuperação Profunda Detectou {formatBytes(recoverableBytes, 1)} Limpáveis
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300">
                Lixeiras ocultas, WhatsApp .Shared, figurinhas, duplicados em /Sent, pastas órfãs e dados em cache.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCleaningPackages}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg transition-colors whitespace-nowrap shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Ver Pacotes de Limpeza</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Device Hardware Auto-Detection Inspection Modal */}
      <DeviceInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        device={device}
      />

    </div>
  );
};

