import React, { useState } from 'react';
import { AppStorageWeight } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  BarChart3, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Filter,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface AppWeightRankProps {
  apps: AppStorageWeight[];
  onCleanAppCache: (packageName: string) => void;
}

export const AppWeightRank: React.FC<AppWeightRankProps> = ({ apps, onCleanAppCache }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZeroPasswordOnly, setFilterZeroPasswordOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'TOTAL' | 'CACHE' | 'DATA'>('TOTAL');

  const filteredApps = apps
    .filter((app) => {
      const matchSearch =
        app.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.packageName.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
      if (filterZeroPasswordOnly && !app.isZeroPasswordEligible) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'TOTAL') return b.totalBytes - a.totalBytes;
      if (sortBy === 'CACHE') return b.cacheBytes - a.cacheBytes;
      if (sortBy === 'DATA') return b.userDataBytes - a.userDataBytes;
      return 0;
    });

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-5">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ranking dos Aplicativos Mais Pesados (App + Dados + Cache)</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Medido diretamente via StorageStatsManager com decomposição em binários APK, banco de dados privado e arquivos de cache.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar pacote ou app..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
            />
          </div>

          {/* Zero Password Toggle */}
          <button
            onClick={() => setFilterZeroPasswordOnly(!filterZeroPasswordOnly)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterZeroPasswordOnly
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Apenas "Zero Senhas"</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center text-xs bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg">
            <button
              onClick={() => setSortBy('TOTAL')}
              className={`px-2 py-1 rounded-md transition-colors ${sortBy === 'TOTAL' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs' : 'text-neutral-500'}`}
            >
              Total
            </button>
            <button
              onClick={() => setSortBy('CACHE')}
              className={`px-2 py-1 rounded-md transition-colors ${sortBy === 'CACHE' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs' : 'text-neutral-500'}`}
            >
              Cache
            </button>
            <button
              onClick={() => setSortBy('DATA')}
              className={`px-2 py-1 rounded-md transition-colors ${sortBy === 'DATA' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs' : 'text-neutral-500'}`}
            >
              Dados
            </button>
          </div>
        </div>
      </div>

      {/* Apps Table */}
      <div className="border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800">
        {filteredApps.map((app, index) => {
          const totalWeightPct = (app.totalBytes / (12 * 1024 * 1024 * 1024)) * 100; // max scale ~12GB

          return (
            <div
              key={app.packageName}
              className="p-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-6 text-center font-mono font-bold text-xs text-neutral-400 mt-1">
                  #{index + 1}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {app.appName}
                    </span>
                    {app.isZeroPasswordEligible && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        Zero Senhas
                      </span>
                    )}
                  </div>
                  
                  <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                    {app.packageName} · Visto: {app.lastUsed}
                  </div>

                  {/* Decomposed Storage Pill Breakdown */}
                  <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 pt-1 font-mono">
                    <span>APK: {formatBytes(app.appCodeBytes, 0)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Dados: {formatBytes(app.userDataBytes, 1)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Cache: {formatBytes(app.cacheBytes, 1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action and Total */}
              <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {formatBytes(app.totalBytes, 2)}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Espaço total ocupado
                  </div>
                </div>

                <button
                  onClick={() => onCleanAppCache(app.packageName)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Limpar Cache
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
