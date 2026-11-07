import React from 'react';
import { X, CheckCircle2, AlertTriangle, Calculator, Cpu } from 'lucide-react';
import { DeviceProfile } from '../types/cleaner';

interface SystemExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: DeviceProfile;
}

export const SystemExplainerModal: React.FC<SystemExplainerModalProps> = ({
  isOpen,
  onClose,
  device,
}) => {
  if (!isOpen) return null;

  const nominalGB = device.storageCommercialGB; // 128 ou 64
  const totalBytes = nominalGB * 1000 * 1000 * 1000;
  const trueGiB = totalBytes / (1024 * 1024 * 1024);
  const conversionLossGB = nominalGB - trueGiB;
  const firmwarePartitionsGB = nominalGB === 128 ? 9.41 : 6.12;
  const totalSystemReportedGB = conversionLossGB + firmwarePartitionsGB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explainer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 id="explainer-title" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Por que a categoria "Sistema" ocupa tanto espaço?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                A matemática por trás do chip flash UFS/eMMC e das partições Android
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
        <div className="p-6 space-y-5 text-sm text-neutral-700 dark:text-neutral-300">
          
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Mito comum:</strong> Muitos usuários acreditam que a categoria "Sistema" acumulou arquivos inúteis ou vírus. Na verdade, ela é composta por <strong>duas parcelas essenciais e imutáveis</strong> que garantem que seu celular funcione.
            </p>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Parcela 1: Diferença Decimal vs Binária */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Parcela 1</span>
                <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">~{conversionLossGB.toFixed(2)} GB</span>
              </div>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                Diferença Decimal vs. Binário
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Fabricantes de chips de memória vendem {nominalGB} GB em base decimal:
                <br />
                <code className="font-mono text-[11px] bg-neutral-200/60 dark:bg-neutral-700/60 px-1 rounded">
                  {nominalGB} × 10⁹ = {totalBytes.toLocaleString('pt-BR')} bytes
                </code>.
                <br />
                O kernel Linux do Android formata em base binária (1 GiB = 1024³ bytes), resultando em <strong>{trueGiB.toFixed(2)} GiB reais</strong>. A interface do Android agrupa essa "diferença aparente" de <strong>{conversionLossGB.toFixed(2)} GB</strong> dentro de "Sistema".
              </p>
            </div>

            {/* Parcela 2: Partições de Firmware A/B */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Parcela 2</span>
                <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">~{firmwarePartitionsGB.toFixed(2)} GB</span>
              </div>
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                Partições de Firmware A/B
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                O Android moderno utiliza arquitetura <strong>A/B Seamless Updates</strong>. Ele mantém partições espelho de:
                <br />
                <code className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  /system, /vendor, /product, /odm, /boot
                </code>.
                <br />
                Isso permite que seu celular atualize o Android em segundo plano sem risco de travar ou perder dados se a bateria acabar durante o update.
              </p>
            </div>

          </div>

          {/* Sum math bar */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Total Exibido em "Sistema" no {device.brandDisplayName}:</div>
              <div className="text-neutral-500 dark:text-neutral-400">
                {conversionLossGB.toFixed(2)} GB (delta matemático) + {firmwarePartitionsGB.toFixed(2)} GB (firmware)
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-bold text-neutral-900 dark:text-neutral-100">
                = {totalSystemReportedGB.toFixed(2)} GB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>O Otimizador Pro Universal preserva o Sistema 100% íntegro e seguro, focando na recuperação dos 20+ GB de arquivos residuais e mídias descartáveis!</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
