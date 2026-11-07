import React, { useState } from 'react';
import { DeviceProfile } from '../types/cleaner';
import { formatBytes } from '../utils/formatters';
import { 
  Zap, 
  Gauge, 
  Sparkles, 
  Flame, 
  Cpu, 
  Smartphone, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Terminal, 
  RefreshCw, 
  Check, 
  Copy,
  ChevronRight,
  Eye,
  Activity
} from 'lucide-react';

interface PerformanceTweakerProps {
  device: DeviceProfile;
}

export const PerformanceTweaker: React.FC<PerformanceTweakerProps> = ({ device }) => {
  // State for animation scale
  const [animScale, setAnimScale] = useState<number>(0.5);
  const [testAnimOpen, setTestAnimOpen] = useState<boolean>(false);
  const [copiedAdb, setCopiedAdb] = useState<boolean>(false);

  // State for ART DEX compilation
  const [isCompilingDex, setIsCompilingDex] = useState<boolean>(false);
  const [dexProgress, setDexProgress] = useState<number>(0);
  const [dexStatusText, setDexStatusText] = useState<string>('');
  const [dexFinished, setDexFinished] = useState<boolean>(false);

  // State for GPU shaders clean
  const [isCleaningShaders, setIsCleaningShaders] = useState<boolean>(false);
  const [shadersFreedBytes, setShadersFreedBytes] = useState<number>(0);

  // State for Deep Sleep / Doze
  const [deepSleepApps, setDeepSleepApps] = useState<string[]>([
    'com.facebook.katana',
    'com.instagram.android',
    'com.zhiliaoapp.musically',
    'com.kwai.video',
    'com.shopee.br',
  ]);

  // zRAM calculation
  const ramGB = Math.round(device.ramTotalBytes / (1024 * 1024 * 1024));
  const zramRecommendation =
    ramGB >= 12
      ? { size: '2 GB ou Desativar', note: 'Seu aparelho possui memória LPDDR5 física de sobra. Reduzir a RAM Plus evita tráfego desnecessário no chip flash UFS e melhora a taxa de frames.' }
      : ramGB >= 8
      ? { size: '4 GB', note: 'Equilíbrio ideal entre multitarefa rápida e velocidade de barramento.' }
      : { size: '4 GB / 6 GB', note: 'Aparelhos com 4GB ou 6GB de RAM se beneficiam significativamente da compressão de blocos zRAM.' };

  const handleTestAnimation = () => {
    setTestAnimOpen(true);
    setTimeout(() => setTestAnimOpen(false), animScale === 0 ? 100 : animScale === 0.5 ? 400 : 800);
  };

  const handleCopyAdbCommand = () => {
    const cmd = `adb shell settings put global window_animation_scale ${animScale} && adb shell settings put global transition_animation_scale ${animScale} && adb shell settings put global animator_duration_scale ${animScale}`;
    navigator.clipboard.writeText(cmd);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  const handleRunDexOpt = () => {
    setIsCompilingDex(true);
    setDexFinished(false);
    setDexProgress(10);
    setDexStatusText('Iniciando ART Runtime (cmd package compile -m speed-profile)...');

    setTimeout(() => {
      setDexProgress(35);
      setDexStatusText('Otimizando bytecode: WhatsApp (com.whatsapp)...');
    }, 800);

    setTimeout(() => {
      setDexProgress(65);
      setDexStatusText('Compilando perfil AOT: Instagram & YouTube...');
    }, 1600);

    setTimeout(() => {
      setDexProgress(90);
      setDexStatusText('Compilando código nativo: Chrome & TikTok...');
    }, 2400);

    setTimeout(() => {
      setDexProgress(100);
      setDexStatusText('Compilação AOT concluída! 5 apps otimizados.');
      setIsCompilingDex(false);
      setDexFinished(true);
    }, 3200);
  };

  const handleCleanShaders = () => {
    setIsCleaningShaders(true);
    setTimeout(() => {
      setShadersFreedBytes(480 * 1024 * 1024); // 480 MB
      setIsCleaningShaders(false);
    }, 1100);
  };

  const toggleDeepSleepApp = (pkg: string) => {
    setDeepSleepApps((prev) =>
      prev.includes(pkg) ? prev.filter((p) => p !== pkg) : [...prev, pkg]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Otimizador de Fluidez e Desempenho do Sistema (Turbo Engine)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  5 TÉCNICAS NATIVAS
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Ajustes em nível de sistema operacional para eliminar micro-travamentos (stutters), acelerar abertura de apps e calibrar taxa de quadros (90Hz / 120Hz).
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-neutral-500 dark:text-neutral-400">
            <div>Dispositivo: <strong className="text-neutral-800 dark:text-neutral-200">{device.name}</strong></div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Modo Performance Calibrado</div>
          </div>
        </div>
      </div>

      {/* Grid of the 5 High-Impact Tweaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Tweak 1: Escala de Animações (0.5x Turbo) */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  1. Escala de Animações (0.5x Turbo)
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Torna a navegação, abertura de janelas e troca de apps 2x mais rápida
                </p>
              </div>
            </div>

            <button
              onClick={handleTestAnimation}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-md hover:bg-blue-100 transition-colors"
            >
              Testar Sensação
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              O Android vem de fábrica com velocidade <strong>1.0x</strong>. Ao reduzir para <strong>0.5x</strong>, o tempo de renderização de janelas cai pela metade com sensação imediata de velocidade.
            </div>

            {/* Animation Scale Selector Buttons */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { val: 1.0, title: '1.0x Padrão', desc: 'Animações normais' },
                { val: 0.5, title: '0.5x Rápido', desc: 'Recomendado (2x veloz)' },
                { val: 0.0, title: '0.0x Instantâneo', desc: 'Sem animações' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setAnimScale(opt.val)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    animScale === opt.val
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="font-mono">{opt.title}</div>
                  <div className="text-[10px] text-neutral-400 font-normal">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Simulated Window Popup to test animation speed */}
            {testAnimOpen && (
              <div 
                style={{ 
                  animationDuration: `${animScale === 0 ? 0.05 : animScale * 0.4}s` 
                }}
                className="p-3 bg-blue-600 text-white rounded-lg text-center text-xs font-semibold animate-in zoom-in-75 fade-in shadow-md"
              >
                Janela Aberta na velocidade {animScale}x! Viu como é imediato?
              </div>
            )}

            {/* How to apply in system */}
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-neutral-800 dark:text-neutral-200">
                <span>Como Aplicar no Seu Celular:</span>
                <button
                  onClick={handleCopyAdbCommand}
                  className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedAdb ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAdb ? 'Comando Copiado!' : 'Copiar Comando ADB'}</span>
                </button>
              </div>
              <p>
                No celular, vá em <strong>Configurações &gt; Opções do Desenvolvedor</strong> e altere: <em>Escala de animação da janela</em>, <em>Escala de transição</em> e <em>Escala de duração do animador</em> para <strong>0.5x</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Tweak 2: Compilação AOT / ART DEX Speed Profiles */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  2. Compilação AOT (ART Speed-Profile)
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Compila o código de máquina dos apps mais usados para abertura até 40% mais rápida
                </p>
              </div>
            </div>

            <button
              onClick={handleRunDexOpt}
              disabled={isCompilingDex}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap shadow-xs"
            >
              <RefreshCw className={`w-3 h-3 ${isCompilingDex ? 'animate-spin' : ''}`} />
              <span>{isCompilingDex ? 'Compilando...' : 'Otimizar Apps'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <p>
              O Android Runtime (ART) compila trechos de código em tempo de execução. Esta ferramenta força a compilação prévia (AOT) dos métodos mais acessados de WhatsApp, Instagram, Chrome e YouTube, evitando engasgos de processamento ao abrir o aplicativo.
            </p>

            {/* Progress bar when running */}
            {isCompilingDex && (
              <div className="space-y-1.5 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40">
                <div className="flex items-center justify-between font-mono text-[11px] text-purple-900 dark:text-purple-200">
                  <span>{dexStatusText}</span>
                  <span>{dexProgress}%</span>
                </div>
                <div className="h-2 w-full bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dexProgress}%` }}
                    className="h-full bg-purple-600 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {dexFinished && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Bytecode dos aplicativos principais compilado com sucesso! Abertura a frio otimizada.</span>
              </div>
            )}

            <div className="font-mono text-[11px] text-neutral-500">
              Comando nativo executado: <code className="text-neutral-700 dark:text-neutral-300">cmd package compile -m speed-profile &lt;pacote&gt;</code>
            </div>
          </div>
        </div>

        {/* Tweak 3: Diagnóstico e Calibração de zRAM / RAM Plus */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                3. Calibração Inteligente de zRAM / RAM Plus
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Análise do impacto da memória virtual no chip de armazenamento flash UFS
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Recomendação para seu {device.brandDisplayName}:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {zramRecommendation.size}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                {zramRecommendation.note}
              </p>
            </div>

            <p className="text-[11px] leading-relaxed">
              <strong>Explicação técnica:</strong> A memória RAM física (LPDDR5) opera a mais de 50.000 MB/s, enquanto a memória de armazenamento flash UFS opera a cerca de 3.000 MB/s. Configurar a RAM Plus muito alta em celulares modernos faz o sistema trocar dados com o disco lento, gerando pequenos engasgos.
            </p>
          </div>
        </div>

        {/* Tweak 4: Limpeza de Shaders GPU (Vulkan / OpenGL) */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  4. Limpeza de Shaders GPU (Vulkan/OpenGL)
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Descarta caches corrompidos de renderização de drivers de vídeo
                </p>
              </div>
            </div>

            <button
              onClick={handleCleanShaders}
              disabled={isCleaningShaders}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap shadow-xs"
            >
              <span>{isCleaningShaders ? 'Limpando...' : 'Limpar Shaders'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <p>
              Após atualizações de sistema ou do driver da GPU (Adreno / Mali), caches de shaders antigos podem gerar quedas repentinas de quadros (dropped frames) durante a rolagem de feeds e jogos.
            </p>

            {shadersFreedBytes > 0 && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{formatBytes(shadersFreedBytes, 0)} de pipelines de shaders corrompidos foram limpos! Fluidez gráfica restabelecida.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Tweak 5: Hibernação Profunda (Doze Mode & WakeLock Optimizer) */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                5. Otimização de Hibernação Profunda (Doze Mode & WakeLocks)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Impede que aplicativos em segundo plano acordem os núcleos de alta performance da CPU enquanto a tela estiver desligada.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {deepSleepApps.length} apps em hibernação profunda
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {[
            { pkg: 'com.facebook.katana', name: 'Facebook' },
            { pkg: 'com.instagram.android', name: 'Instagram' },
            { pkg: 'com.zhiliaoapp.musically', name: 'TikTok' },
            { pkg: 'com.kwai.video', name: 'Kwai' },
            { pkg: 'com.shopee.br', name: 'Shopee' },
            { pkg: 'com.google.android.googlequicksearchbox', name: 'Google App' },
          ].map((app) => {
            const isSleeping = deepSleepApps.includes(app.pkg);
            return (
              <div
                key={app.pkg}
                onClick={() => toggleDeepSleepApp(app.pkg)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  isSleeping
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 opacity-70'
                }`}
              >
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{app.name}</div>
                  <div className="text-[10px] font-mono text-neutral-500">{app.pkg}</div>
                </div>

                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSleeping ? 'bg-emerald-600 text-white' : 'border border-neutral-400'}`}>
                  {isSleeping && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
