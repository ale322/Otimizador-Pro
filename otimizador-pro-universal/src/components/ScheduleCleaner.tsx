import React, { useState } from 'react';
import { ScheduleConfig, ScheduleExecutionLog, DeviceProfile } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  CalendarClock, 
  Clock, 
  Moon, 
  BatteryCharging, 
  Wifi, 
  CheckCircle2, 
  Play, 
  Bell, 
  ShieldCheck, 
  Layers, 
  AlertCircle,
  Sparkles,
  Smartphone,
  ChevronRight,
  Battery
} from 'lucide-react';

interface ScheduleCleanerProps {
  device: DeviceProfile;
  config: ScheduleConfig;
  onUpdateConfig: (newConfig: ScheduleConfig) => void;
  logs: ScheduleExecutionLog[];
  onTriggerTestRun: () => void;
  isSimulating: boolean;
}

export const ScheduleCleaner: React.FC<ScheduleCleanerProps> = ({
  device,
  config,
  onUpdateConfig,
  logs,
  onTriggerTestRun,
  isSimulating,
}) => {
  const [notificationPreview, setNotificationPreview] = useState<boolean>(false);

  const handleToggleEnable = () => {
    onUpdateConfig({ ...config, isEnabled: !config.isEnabled });
  };

  const handleTimeChange = (newTime: string) => {
    onUpdateConfig({ ...config, targetTime: newTime });
  };

  const handleFrequencyChange = (freq: ScheduleConfig['frequency']) => {
    onUpdateConfig({ ...config, frequency: freq });
  };

  const handleModeChange = (mode: ScheduleConfig['scheduleMode']) => {
    onUpdateConfig({ ...config, scheduleMode: mode });
  };

  return (
    <div className="space-y-6">
      
      {/* Master Switch Banner */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              config.isEnabled
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
            }`}>
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Agendamento de Limpeza Automática (WorkManager)
                </h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  config.isEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {config.isEnabled ? 'ATIVO' : 'DESATIVADO'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Roda de madrugada ou quando o aparelho estiver ocioso no carregador sem incomodar seu uso diário.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleEnable}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-2 ${
                config.isEnabled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800'
              }`}
            >
              <span>{config.isEnabled ? 'Agendamento Ligado' : 'Ativar Agendamento'}</span>
            </button>

            <button
              onClick={onTriggerTestRun}
              disabled={isSimulating}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Executa imediatamente a rotina do WorkManager simulando condições ideais"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulando Worker...' : 'Simular Disparo'}</span>
            </button>
          </div>
        </div>

        {/* Current status detail */}
        {config.isEnabled && (
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            <div>
              <span className="text-neutral-400">Próxima Execução: </span>
              <strong className="text-emerald-600 dark:text-emerald-400">
                {config.scheduleMode === 'IDLE' ? 'Assim que o celular repousar no carregador' : `Hoje às ${config.targetTime} da manhã`}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">Frequência: </span>
              <span className="text-neutral-800 dark:text-neutral-200">
                {config.frequency === 'DAILY' ? 'Diário (24h)' : config.frequency === 'EVERY_2_DAYS' ? 'A cada 2 dias' : 'Semanal (Domingos)'}
              </span>
            </div>
            <div>
              <span className="text-neutral-400">Restrições Ativas: </span>
              <span className="text-neutral-800 dark:text-neutral-200">
                {[
                  config.requireIdle && 'Ocioso',
                  config.requireCharging && 'Carregando',
                  config.requireBatteryNotLow && 'Bateria > 20%',
                ].filter(Boolean).join(' + ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Timing & Conditions + Clean Scope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Horários e Gatilhos do WorkManager */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-5">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                1. Gatilhos de Disparo do Sistema
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Defina o momento ideal para a limpeza rodar em segundo plano
              </p>
            </div>
          </div>

          {/* Trigger Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Modo de Disparo do Worker
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'BOTH', title: 'Horário + Ocioso', desc: 'Recomendado' },
                { id: 'TIME', title: 'Horário Fixo', desc: 'Ex: 03:00' },
                { id: 'IDLE', title: 'Aparelho Ocioso', desc: 'A qualquer hora' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id as ScheduleConfig['scheduleMode'])}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    config.scheduleMode === m.id
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-xs">{m.title}</div>
                  <div className="text-[10px] text-neutral-400 font-normal">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker & Frequency */}
          {config.scheduleMode !== 'IDLE' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Horário Noturno</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={config.targetTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex gap-1 shrink-0">
                    {['02:00', '03:00', '04:00'].map((h) => (
                      <button
                        key={h}
                        onClick={() => handleTimeChange(h)}
                        className={`px-2 py-1 text-[11px] font-mono rounded ${
                          config.targetTime === h
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Periodicidade
                </label>
                <select
                  value={config.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value as ScheduleConfig['frequency'])}
                  className="w-full px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="DAILY">Todos os dias (Diário)</option>
                  <option value="EVERY_2_DAYS">A cada 2 dias</option>
                  <option value="WEEKLY">Semanalmente (Domingos)</option>
                </select>
              </div>
            </div>
          )}

          {/* Android WorkManager System Constraints (Toggles) */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Restrições do WorkManager (Constraints.Builder)
            </div>

            <label className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    Apenas com o Aparelho Ocioso (Device Idle)
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Aguarda tela apagada e sem uso por 15+ min para zero impacto visual
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.requireIdle}
                onChange={(e) => onUpdateConfig({ ...config, requireIdle: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <BatteryCharging className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    Apenas Conectado ao Carregador
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Garante zero consumo da sua bateria durante a noite
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.requireCharging}
                onChange={(e) => onUpdateConfig({ ...config, requireCharging: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Battery className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    Bateria Não Baixa (Battery Not Low &gt; 20%)
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Não executa se o aparelho estiver com menos de 20%
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.requireBatteryNotLow}
                onChange={(e) => onUpdateConfig({ ...config, requireBatteryNotLow: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>

        </div>

        {/* Card 2: Escopo da Limpeza Noturna e Notificações */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  2. Escopo da Limpeza Noturna
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Selecione os módulos incluídos na execução automática
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Lixeiras Ocultas Multi-Marca
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Samsung .Trash, Xiaomi .trashBin, Motorola .trashed-*, WhatsApp .trash
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanTrash}
                  onChange={(e) => onUpdateConfig({ ...config, cleanTrash: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Cenário 1: WhatsApp Temporários & Sent
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Pasta .Shared, figurinhas descartáveis e duplicados enviados
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanScenario1}
                  onChange={(e) => onUpdateConfig({ ...config, cleanScenario1: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Detector de Pastas Órfãs
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Elimina restos em Android/data de aplicativos já desinstalados
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanOrphanFolders}
                  onChange={(e) => onUpdateConfig({ ...config, cleanOrphanFolders: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Pacote Zero Senhas & Caches
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    YouTube cache, Google TTS vozes antigas e thumbnails locais
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanZeroPasswordCache}
                  onChange={(e) => onUpdateConfig({ ...config, cleanZeroPasswordCache: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Encerramento Noturno de Processos de RAM
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Executa killBackgroundProcesses em drenadores em segundo plano
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.killRamProcesses}
                  onChange={(e) => onUpdateConfig({ ...config, killRamProcesses: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Morning Notification Notification Settings */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Notificação Silenciosa Matinal
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.showMorningNotification}
                onChange={(e) => onUpdateConfig({ ...config, showMorningNotification: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {config.showMorningNotification && (
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span>Otimizador Pro Universal · Agora</span>
                </div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  Espaço Liberado Automaticamente: +2.1 GB!
                </div>
                <div className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                  Enquanto seu {device.brandDisplayName} estava no carregador, limpamos lixeiras ocultas e fragmentos temporários com segurança.
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Historical Execution Log */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Histórico de Execuções Automáticas do Worker
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Registro de ativações do WorkManager com verificação de constraints
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-500">
            {logs.length} execuções registradas
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-500">{log.timestamp}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {log.triggerReason}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                    SUCESSO
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                  <span>Critérios: </span>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {log.criteriaMet.idle ? '✓ Aparelho Ocioso' : ''} · {log.criteriaMet.charging ? '✓ No Carregador' : ''} · {log.criteriaMet.batteryOk ? '✓ Bateria OK' : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 font-mono">
                <div className="text-left sm:text-right">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatBytes(log.bytesFreed, 1)}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {log.itemsRemoved} arquivos ({log.durationMs}ms)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
