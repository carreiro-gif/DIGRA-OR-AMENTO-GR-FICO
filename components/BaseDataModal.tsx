import React, { useState, useRef } from 'react';
import { BaseData } from '../types';

interface BaseDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseData: BaseData;
  onSave: (newData: BaseData) => void;
}

type Tab = 'papeis' | 'materiais' | 'impressao' | 'maoobra';

export const BaseDataModal: React.FC<BaseDataModalProps> = ({ isOpen, onClose, baseData, onSave }) => {
  const [data, setData] = useState<BaseData>(JSON.parse(JSON.stringify(baseData))); // Deep copy for editing
  const [activeTab, setActiveTab] = useState<Tab>('papeis');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setData(JSON.parse(JSON.stringify(baseData)));
    }
  }, [isOpen, baseData]);

  if (!isOpen) return null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valores-base.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        if (imported && (imported.papeis || imported.materiais)) {
          setData(imported);
        } else {
          alert('Formato de JSON inválido.');
        }
      } catch (error) {
        alert('Erro ao ler o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm font-sans transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/20">
        
        {/* UNIFIED HEADER (Deep Blue Block) */}
        <div className="bg-digra-blue text-white shrink-0 shadow-md z-10">
          {/* Title Row */}
          <div className="px-8 py-5 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                <span className="bg-white/20 p-1.5 rounded-lg text-xl">⚙️</span> Valores Base
              </h2>
              <p className="text-blue-200 text-sm mt-1 font-medium opacity-90">Configure os preços e itens do sistema.</p>
            </div>
            <button 
              onClick={onClose} 
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
              title="Fechar"
            >
              <span className="text-xl leading-none pb-1">&times;</span>
            </button>
          </div>

          {/* Tabs & Actions Row */}
          <div className="px-8 pb-6 pt-2 flex flex-wrap gap-4 justify-between items-end">
            
            {/* Modern Pills Tabs */}
            <div className="flex p-1.5 bg-black/20 backdrop-blur-sm rounded-xl gap-1 shadow-inner">
              {(['papeis', 'materiais', 'impressao', 'maoobra'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab 
                      ? 'bg-white text-digra-blue shadow-lg scale-100 ring-1 ring-black/5' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>
                    {tab === 'papeis' && '📄'}
                    {tab === 'materiais' && '🔧'}
                    {tab === 'impressao' && '🖨️'}
                    {tab === 'maoobra' && '👷'}
                  </span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('maoobra', 'Mão de Obra').replace('impressao', 'Impressão')}
                </button>
              ))}
            </div>

            {/* Actions (Ghost Buttons) */}
            <div className="flex gap-3">
              <button onClick={handleExport} className="px-4 py-2 border border-white/30 text-white rounded-lg text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                <span>⬇</span> Exportar
              </button>
              <div className="relative">
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-white/30 text-white rounded-lg text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                   <span>⬆</span> Importar
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="application/json" 
                  className="hidden" 
                  onChange={handleImport}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Clean White */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 scroll-smooth">
          
          {activeTab === 'papeis' && (
            <div className="animate-fadeIn space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 text-sm flex items-start gap-3 shadow-sm">
                <span className="text-2xl">ℹ️</span>
                <div className="pt-1">
                  <p className="font-bold">Instruções de Preenchimento</p>
                  <p className="opacity-80">A ordem das colunas é fixa: <b>A4, A3, Folha, Pacote</b>. Altere os valores para atualizar automaticamente os orçamentos em aberto.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Nome do Papel</th>
                      <th className="p-4 w-28">R$ A4</th>
                      <th className="p-4 w-28">R$ A3</th>
                      <th className="p-4 w-28">R$ Folha</th>
                      <th className="p-4 w-32">R$ Pacote</th>
                      <th className="p-4 w-16 text-center">Excluir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.papeis.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-3"><input className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded font-semibold text-slate-700 focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all" value={p.nome} onChange={(e) => { const n = [...data.papeis]; n[idx].nome = e.target.value; setData({...data, papeis: n}); }} /></td>
                        <td className="p-3"><input type="number" step="0.01" className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-mono text-slate-600" value={p.a4} onChange={(e) => { const n = [...data.papeis]; n[idx].a4 = parseFloat(e.target.value); setData({...data, papeis: n}); }} /></td>
                        <td className="p-3"><input type="number" step="0.01" className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-mono text-slate-600" value={p.a3} onChange={(e) => { const n = [...data.papeis]; n[idx].a3 = parseFloat(e.target.value); setData({...data, papeis: n}); }} /></td>
                        <td className="p-3"><input type="number" step="0.01" className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-mono text-slate-600" value={p.folha} onChange={(e) => { const n = [...data.papeis]; n[idx].folha = parseFloat(e.target.value); setData({...data, papeis: n}); }} /></td>
                        <td className="p-3"><input type="number" step="0.01" className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-mono text-slate-600" value={p.pacote} onChange={(e) => { const n = [...data.papeis]; n[idx].pacote = parseFloat(e.target.value); setData({...data, papeis: n}); }} /></td>
                        <td className="p-3 text-center">
                          <button onClick={() => { const n = [...data.papeis]; n.splice(idx, 1); setData({...data, papeis: n}); }} className="h-8 w-8 inline-flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setData({...data, papeis: [...data.papeis, { nome: 'Novo Papel', a4: 0, a3: 0, folha: 0, pacote: 0, folhasPacote: null }]})} className="px-5 py-2.5 bg-digra-blue text-white rounded-lg text-sm font-bold hover:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <span>+</span> Adicionar Papel
              </button>
            </div>
          )}

          {activeTab === 'materiais' && (
            <div className="animate-fadeIn space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Nome do Material</th>
                      <th className="p-4">Variações (Nome e Valor)</th>
                      <th className="p-4 w-16 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.materiais.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 align-top transition-colors">
                        <td className="p-3 w-1/3">
                          <input className="w-full p-3 font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-digra-blue focus:ring-1 focus:ring-digra-blue outline-none transition-all text-slate-800" value={m.nome} onChange={(e) => { const n = [...data.materiais]; n[idx].nome = e.target.value; setData({...data, materiais: n}); }} />
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-2">
                            {m.tipos.map((t, tIdx) => (
                              <div key={tIdx} className="flex gap-2 items-center group/type">
                                <input className="flex-1 p-2 border border-slate-200 rounded text-xs font-medium focus:border-digra-blue focus:ring-1 focus:ring-digra-blue outline-none" placeholder="Nome do tipo/tamanho" value={t.nome} onChange={(e) => { const n = [...data.materiais]; n[idx].tipos[tIdx].nome = e.target.value; setData({...data, materiais: n}); }} />
                                <input className="w-28 p-2 border border-slate-200 rounded text-xs font-mono focus:border-digra-blue focus:ring-1 focus:ring-digra-blue outline-none" type="number" step="0.01" placeholder="R$ 0,00" value={t.valor} onChange={(e) => { const n = [...data.materiais]; n[idx].tipos[tIdx].valor = parseFloat(e.target.value); setData({...data, materiais: n}); }} />
                                <button onClick={() => { const n = [...data.materiais]; n[idx].tipos.splice(tIdx, 1); setData({...data, materiais: n}); }} className="text-red-300 hover:text-red-500 px-2 opacity-0 group-hover/type:opacity-100 transition-opacity">✕</button>
                              </div>
                            ))}
                            <button onClick={() => { const n = [...data.materiais]; n[idx].tipos.push({ nome: '', valor: 0 }); setData({...data, materiais: n}); }} className="text-digra-blue text-xs font-bold self-start hover:underline mt-1 flex items-center gap-1">
                              <span>+</span> Adicionar Variação
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center align-middle">
                           <button onClick={() => { const n = [...data.materiais]; n.splice(idx, 1); setData({...data, materiais: n}); }} className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Excluir Material">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
               <button onClick={() => setData({...data, materiais: [...data.materiais, { nome: 'Novo Material', tipos: [] }]})} className="px-5 py-2.5 bg-digra-blue text-white rounded-lg text-sm font-bold hover:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <span>+</span> Adicionar Material
              </button>
            </div>
          )}

          {activeTab === 'impressao' && (
             <div className="animate-fadeIn space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Tipo de Impressão</th>
                      <th className="p-4">Formato</th>
                      <th className="p-4 w-32">R$ Unitário</th>
                      <th className="p-4 w-16 text-center">Excluir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.impressoes.map((i, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-3"><input className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all" value={i.tipo} onChange={(e) => { const n = [...data.impressoes]; n[idx].tipo = e.target.value; setData({...data, impressoes: n}); }} /></td>
                        <td className="p-3"><input className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all" value={i.formato} onChange={(e) => { const n = [...data.impressoes]; n[idx].formato = e.target.value; setData({...data, impressoes: n}); }} /></td>
                        <td className="p-3"><input type="number" step="0.01" className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-mono" value={i.valor} onChange={(e) => { const n = [...data.impressoes]; n[idx].valor = parseFloat(e.target.value); setData({...data, impressoes: n}); }} /></td>
                        <td className="p-3 text-center"><button onClick={() => { const n = [...data.impressoes]; n.splice(idx, 1); setData({...data, impressoes: n}); }} className="h-8 w-8 inline-flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setData({...data, impressoes: [...data.impressoes, { tipo: 'NOVO', formato: 'A4', valor: 0 }]})} className="px-5 py-2.5 bg-digra-blue text-white rounded-lg text-sm font-bold hover:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <span>+</span> Adicionar Impressão
              </button>
            </div>
          )}

          {activeTab === 'maoobra' && (
            <div className="animate-fadeIn space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Profissional</th>
                      <th className="p-4 w-40">R$ por Hora</th>
                      <th className="p-4 w-16 text-center">Excluir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.maoObra.map((o, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-3"><input className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-semibold text-slate-700" value={o.profissional} onChange={(e) => { const n = [...data.maoObra]; n[idx].profissional = e.target.value; setData({...data, maoObra: n}); }} /></td>
                        <td className="p-3"><input type="number" step="0.01" className="w-full p-2 bg-transparent border border-transparent hover:border-slate-300 rounded focus:border-digra-blue focus:bg-white focus:ring-1 focus:ring-digra-blue outline-none transition-all font-mono" value={o.hora} onChange={(e) => { const n = [...data.maoObra]; n[idx].hora = parseFloat(e.target.value); setData({...data, maoObra: n}); }} /></td>
                        <td className="p-3 text-center"><button onClick={() => { const n = [...data.maoObra]; n.splice(idx, 1); setData({...data, maoObra: n}); }} className="h-8 w-8 inline-flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setData({...data, maoObra: [...data.maoObra, { profissional: 'NOVO PROFISSIONAL', hora: 0 }]})} className="px-5 py-2.5 bg-digra-blue text-white rounded-lg text-sm font-bold hover:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <span>+</span> Adicionar Mão de Obra
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-4 shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
          <button onClick={() => onSave(data)} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
            <span>💾</span> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};