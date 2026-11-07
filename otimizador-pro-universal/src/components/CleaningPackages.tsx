import React, { useState } from 'react';
import { CleanableItem, DeviceProfile } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  ShieldAlert, 
  Trash2, 
  Sparkles, 
  FolderLock, 
  CheckSquare, 
  Square, 
  Filter, 
  AlertCircle,
  FileCheck,
  Zap,
  FolderTree,
  FolderMinus
} from 'lucide-react';

interface CleaningPackagesProps {
  items: CleanableItem[];
  onToggleItem: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onExecuteClean: (selectedItems: CleanableItem[]) => void;
  device: DeviceProfile;
}

export const CleaningPackages: React.FC<CleaningPackagesProps> = ({
  items,
  onToggleItem,
  onSelectAll,
  onExecuteClean,
  device,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const selectedItems = items.filter((i) => i.selected);
  const totalSelectedBytes = selectedItems.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  const totalSelectedCount = selectedItems.reduce((acc, curr) => acc + curr.itemCount, 0);

  const filteredItems = items.filter((item) => {
    if (activeCategoryFilter === 'ALL') return true;
    return item.category === activeCategoryFilter;
  });

  const allSelected = items.length > 0 && items.every((i) => i.selected);

  const getCategoryBadge = (category: CleanableItem['category']) => {
    switch (category) {
      case 'TRASH':
        return { label: 'Lixeira Multi-Marca', color: 'text-red-700 dark:text-red-400 bg-red-100/60 dark:bg-red-950/40' };
      case 'SCENARIO_1':
        return { label: 'Cenário 1 (100% Conservador)', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40' };
      case 'SCENARIO_2':
        return { label: 'Cenário 2 (Grupos Ocultos)', color: 'text-purple-700 dark:text-purple-400 bg-purple-100/60 dark:bg-purple-950/40' };
      case 'ORPHAN_FOLDERS':
        return { label: 'Pastas Órfãs (Desinstalados)', color: 'text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40' };
      case 'ZERO_PASSWORD':
        return { label: 'Zero Senhas (Auto-login)', color: 'text-blue-700 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/40' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Absolute Protection Guarantee Header */}
      <div className="p-4 sm:p-5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
          <FolderLock className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Protocolo com Regra de Proteção Absoluta Ativa
            </h3>
            <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
              ZERO RISCO
            </span>
          </div>
          <p className="leading-relaxed">
            O motor de limpeza possui regras de exclusão estritas em nível de kernel: <strong>NUNCA</strong> toca em fotos da câmera (<code className="font-mono">DCIM/Camera</code>), na pasta <code className="font-mono">Pictures</code>, na pasta <code className="font-mono">Download</code> (exceto instaladores .apk), nem nos bancos de conversas criptografados (<code className="font-mono">msgstore.db.crypt14/15</code>). Arquivos <code className="font-mono">.nomedia</code> são 100% preservados para não quebrar a organização das suas pastas.
          </p>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-xs">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'ALL'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Todos os Pacotes ({items.length})
          </button>

          <button
            onClick={() => setActiveCategoryFilter('TRASH')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'TRASH'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Lixeiras Multi-Marca
          </button>

          <button
            onClick={() => setActiveCategoryFilter('SCENARIO_1')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'SCENARIO_1'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Cenário 1 (100% Conservador)
          </button>

          <button
            onClick={() => setActiveCategoryFilter('SCENARIO_2')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'SCENARIO_2'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Cenário 2 (Grupos Ocultos)
          </button>

          <button
            onClick={() => setActiveCategoryFilter('ORPHAN_FOLDERS')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'ORPHAN_FOLDERS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Pastas Órfãs
          </button>

          <button
            onClick={() => setActiveCategoryFilter('ZERO_PASSWORD')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'ZERO_PASSWORD'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Zero Senhas
          </button>
        </div>

        {/* Global check and Clean button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
          <button
            onClick={() => onSelectAll(!allSelected)}
            className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium cursor-pointer"
          >
            {allSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
            <span>{allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}</span>
          </button>

          <button
            onClick={() => onExecuteClean(selectedItems)}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Liberar {formatBytes(totalSelectedBytes, 1)} ({selectedItems.length} itens)</span>
          </button>
        </div>

      </div>

      {/* Cleaning Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const badge = getCategoryBadge(item.category);
          const isAndroidLegacy = device.isLegacyStorage;
          const displayPath = isAndroidLegacy && item.legacyPath ? item.legacyPath : item.path;

          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`border rounded-xl p-4 transition-all cursor-pointer ${
                item.selected
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-neutral-900 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                
                {/* Custom Checkbox */}
                <div className="mt-1 shrink-0">
                  {item.selected ? (
                    <div className="w-5 h-5 rounded-md bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
                  )}
                </div>

                {/* Main Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${badge.color}`}>
                        {badge.label}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                        {item.itemCount.toLocaleString('pt-BR')} {item.itemCount === 1 ? 'pacote' : 'arquivos'}
                      </span>
                      <span className="text-sm font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {formatBytes(item.sizeBytes, 2)}
                      </span>
                    </div>
                  </div>

                  {/* Target System Path */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono overflow-hidden text-ellipsis">
                    <FolderTree className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                    <span className="truncate">{displayPath}</span>
                    {item.legacyPath && (
                      <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.2 rounded text-neutral-500 shrink-0">
                        {isAndroidLegacy ? 'Caminho Legado Ativo' : 'Caminho Android 11+ Ativo'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Safety Guarantee */}
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <FileCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Garantia: {item.safeGuarantee}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
