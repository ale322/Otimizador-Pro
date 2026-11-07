import React, { useState } from 'react';
import { ANDROID_SOURCE_FILES, AndroidSourceFile } from '../data/androidSourceCode';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ShieldCheck, 
  FolderTree,
  ExternalLink
} from 'lucide-react';

export const SourceCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile: AndroidSourceFile = ANDROID_SOURCE_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    ANDROID_SOURCE_FILES.forEach((file, index) => {
      setTimeout(() => {
        const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 250);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Código-Fonte Completo e Modularizado para Android Studio
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Arquitetura nativa em Kotlin com Jetpack Compose, StorageCleanerEngine e AutoCacheAccessibilityService pronta para compilar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Todos ({ANDROID_SOURCE_FILES.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
          {ANDROID_SOURCE_FILES.map((file, idx) => (
            <button
              key={file.fileName}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedFileIndex === idx
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.fileName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-950 rounded-xl overflow-hidden shadow-lg">
        
        {/* Editor Title Bar */}
        <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 text-neutral-300 font-semibold">{currentFile.filePath}</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-500">
            {currentFile.language.toUpperCase()} · UTF-8
          </div>
        </div>

        {/* File Description Header */}
        <div className="px-5 py-3 bg-neutral-900/40 border-b border-neutral-800/80 text-xs text-neutral-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{currentFile.description}</span>
        </div>

        {/* Code Content */}
        <pre className="p-5 font-mono text-xs text-neutral-200 leading-relaxed overflow-x-auto max-h-[640px] select-text">
          <code>{currentFile.code}</code>
        </pre>

      </div>

      {/* Guide: How to compile Native APK in Android Studio */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Guia de Compilação: Como Gerar o APK Nativo (.apk) no Android Studio
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1">
            <div className="font-bold text-neutral-800 dark:text-neutral-200">1. Criar Projeto no Android Studio</div>
            <p className="leading-relaxed">
              Abra o Android Studio, escolha <strong>New Project &gt; Empty Activity (Compose)</strong> com linguagem <strong>Kotlin</strong> e Minimum SDK 26 (Android 8.0).
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1">
            <div className="font-bold text-neutral-800 dark:text-neutral-200">2. Copiar os 7 Arquivos Nativos</div>
            <p className="leading-relaxed">
              Clique em <strong>"Baixar Arquivo"</strong> ou <strong>"Copiar Código"</strong> nas abas acima e cole nas respectivas pastas do projeto (<code className="font-mono text-[10px]">app/src/main/...</code>).
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1">
            <div className="font-bold text-neutral-800 dark:text-neutral-200">3. Gerar e Instalar o APK</div>
            <p className="leading-relaxed">
              No menu superior, vá em <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. Conecte seu celular via USB com a Depuração USB ativada e clique em <strong>Run 'app'</strong> (Shift + F10).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

