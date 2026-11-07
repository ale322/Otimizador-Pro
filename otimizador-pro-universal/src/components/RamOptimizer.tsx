import React, { useState } from 'react';
import { DeviceProfile, ProcessItem, BiometricDiagnosticResult } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  Cpu, 
  Zap, 
  RotateCcw, 
  Fingerprint, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface RamOptimizerProps {
  device: DeviceProfile;
  processes: ProcessItem[];
  onKillProcess: (packageName: string) => void;
  onKillAllProcesses: () => void;
  biometricStatus: BiometricDiagnosticResult;
  onTestBiometrics: () => void;
}

export const RamOptimizer: React.FC<RamOptimizerProps> = ({
  device,
  processes,
  onKillProcess,
  onKillAllProcesses,
  biometricStatus,
  onTestBiometrics,
}) => {
  const [isKilling, setIsKilling] = useState(false);
  const [isTestingSensor, setIsTestingSensor] = useState(false);

  // Calculate active RAM stats
  const activeProcesses = processes.filter((p) => !p.isKilled);
  const drainingBytes = activeProcesses.reduce((acc, p) => acc + p.ramUsageBytes, 0);

  const ramTotal = device.ramTotalBytes;
  // If killed, used decreases
  const killedSavings = processes.filter((p) => p.isKilled).reduce((acc, p) => acc + p.ramUsageBytes, 0);
  const baseUsedBytes = ramTotal * 0.72; // ~72% used before optimization
  const currentUsedBytes = Math.max(ramTotal * 0.40, baseUsedBytes - killedSavings);
  const currentFreeBytes = ramTotal - currentUsedBytes;
  const usedPercent = (currentUsedBytes / ramTotal) * 100;

  const handleKillAll = () => {
    setIsKilling(true);
    setTimeout(() => {
      onKillAllProcesses();
      setIsKilling(false);
    }, 700);
  };

  const handleRunBiometricCheck = () => {
    setIsTestingSensor(true);
    setTimeout(() => {
      onTestBiometrics();
      setIsTestingSensor(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Top RAM & zRAM Meters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Physical RAM Card */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Memória RAM Física (/proc/meminfo)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Leitura em tempo real via ActivityManager
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {formatBytes(currentUsedBytes, 1)} / {formatBytes(ramTotal, 0)}
              </div>
              <div className="text-xs text-neutral-500 font-mono">
                {usedPercent.toFixed(1)}% em uso
              </div>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${usedPercent}%` }}
              className={`h-full transition-all duration-500 ${
                usedPercent > 80 ? 'bg-amber-500' : 'bg-blue-600 dark:bg-blue-500'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <div>Livre: <strong className="text-emerald-600 dark:text-emerald-400">{formatBytes(currentFreeBytes, 1)}</strong></div>
            <div>Drenagem por apps em 2º plano: <strong className="text-neutral-700 dark:text-neutral-300">{formatBytes(drainingBytes, 1)}</strong></div>
          </div>
        </div>

        {/* Swap / zRAM Card (RAM Plus / Expansão Virtual) */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Swap / zRAM (RAM Plus / Expansão Virtual)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Compressão em bloco LZO/LZ4 no chip de armazenamento
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {formatBytes(device.zramBytes * 0.42, 1)} / {formatBytes(device.zramBytes, 0)}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Ativo e Otimizado
              </div>
            </div>
          </div>

          <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              style={{ width: '42%' }}
              className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Algoritmo: <strong className="font-mono text-neutral-700 dark:text-neutral-300">zram0 (Comp: lz4)</strong></span>
            <span>Prioridade no Kernel: <strong className="font-mono text-neutral-700 dark:text-neutral-300">swappiness=60</strong></span>
          </div>
        </div>

      </div>

      {/* Background Memory Drainers (Task Killer Engine) */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Aplicativos que Drenam RAM em Segundo Plano</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Detectados via ActivityManager. Encerrá-los (<code className="font-mono text-[11px]">killBackgroundProcesses</code>) não desloga nem corrompe contas.
            </p>
          </div>

          <button
            onClick={handleKillAll}
            disabled={isKilling || activeProcesses.length === 0}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {isKilling ? 'Encerrando...' : activeProcesses.length === 0 ? 'Processos Otimizados' : `Encerrar Todos (${formatBytes(drainingBytes, 1)})`}
            </span>
          </button>
        </div>

        {/* Process List */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80 border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
          {processes.map((proc) => (
            <div
              key={proc.packageName}
              className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                proc.isKilled
                  ? 'bg-neutral-50/60 dark:bg-neutral-800/20 opacity-60'
                  : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${proc.isKilled ? 'bg-neutral-400' : 'bg-amber-500'}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {proc.appName}
                    </span>
                    {proc.isKilled && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                        LIBERADO
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                    {proc.packageName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {formatBytes(proc.ramUsageBytes, 0)} RAM
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500">
                    {proc.isKilled ? '0.0% CPU' : `~${proc.cpuPercent}% CPU`}
                  </div>
                </div>

                {!proc.isKilled ? (
                  <button
                    onClick={() => onKillProcess(proc.packageName)}
                    className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                  >
                    Encerrar
                  </button>
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Hardware & Biometrics Diagnostics */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Diagnóstico de Sensores e Biometria
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Verificação de BiometricManager e checagem de nós de hardware (/sys/class/fingerprint/...)
              </p>
            </div>
          </div>

          <button
            onClick={handleRunBiometricCheck}
            disabled={isTestingSensor}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isTestingSensor ? 'animate-spin' : ''}`} />
            <span>Testar Integridade Física</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Sensor Detectado</div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              {device.sensorModel}
            </div>
            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
              Tipo: {device.biometricType}
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Status BiometricManager</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>BIOMETRIC_SUCCESS (Code 0)</span>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
              {biometricStatus.enrollmentCount} digitais cadastradas · Latência {biometricStatus.latencyMs}ms
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Nó de Hardware no Kernel</div>
            <div className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-1 truncate">
              {device.hardwareNode}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {biometricStatus.nodeReadValue}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
