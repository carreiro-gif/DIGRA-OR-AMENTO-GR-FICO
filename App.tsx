import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_BASE_DATA } from './constants';
import { AppState, ItemPapel, ItemMaterial, ItemImpressao, ItemMaoObra } from './types';
import { calculateTotals, formatCurrency, generateId } from './services/utils';
import { BaseDataModal } from './components/BaseDataModal';

// --- Sub-Components Definition (Inline for single-file structure preference as requested, but organized) ---

const SectionCard = ({ title, icon, children, className = '' }: { title: string, icon: string, children: React.ReactNode, className?: string }) => (
  <section className={`mb-6 bg-white/95 backdrop-blur rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.12)] border border-white/40 page-break-avoid ${className}`}>
    <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 text-digra-blue font-extrabold text-lg">
      <span className="text-xl">{icon}</span>
      {title}
    </div>
    <div className="p-5">
      {children}
    </div>
  </section>
);

const InputGroup = ({ label, children, widthClass }: { label: string, children: React.ReactNode, widthClass: string }) => (
  <div className={`${widthClass} flex flex-col gap-1`}>
    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const DeleteBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="h-11 w-11 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors no-print" title="Remover">
    🗑️
  </button>
);

// --- MAIN COMPONENT ---

function App() {
  // -- STATE --
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('digra_orcamento_v2_react');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return {
      info: { qtTotal: 1, tamanhoFinal: '', tec: 'DIGITAL', descricao: '', dadosTecnicos: '' },
      itens: { papeis: [], materiais: [], impressoes: [], maoObra: [] },
      imagens: [],
      base: INITIAL_BASE_DATA
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totals, setTotals] = useState(calculateTotals(state));
  const [logoError, setLogoError] = useState(false);

  // -- EFFECTS --
  useEffect(() => {
    localStorage.setItem('digra_orcamento_v2_react', JSON.stringify(state));
    setTotals(calculateTotals(state));
  }, [state]);

  // -- HANDLERS --

  const updateInfo = (field: keyof AppState['info'], value: any) => {
    setState(prev => ({ ...prev, info: { ...prev.info, [field]: value } }));
  };

  // Generic Item handlers
  const addItem = (type: keyof AppState['itens'], item: any) => {
    setState(prev => ({ ...prev, itens: { ...prev.itens, [type]: [...prev.itens[type], item] } }));
  };

  const removeItem = (type: keyof AppState['itens'], id: string) => {
    setState(prev => ({ ...prev, itens: { ...prev.itens, [type]: prev.itens[type].filter((i: any) => i.id !== id) } }));
  };

  const updateItem = (type: keyof AppState['itens'], id: string, field: string, value: any) => {
    setState(prev => {
      const list = prev.itens[type].map((item: any) => {
        if (item.id !== id) return item;
        return { ...item, [field]: value };
      });
      
      // Recalculate Unit Prices based on Base Data selection
      const updatedList = list.map((item: any) => {
        if (item.id !== id) return item; // Only process the changed item deeply if needed

        let unit = item.unit;
        if (type === 'papeis') {
           const pItem = item as ItemPapel;
           if (pItem.papelIndex !== "" && pItem.tamanho) {
             const baseP = prev.base.papeis[pItem.papelIndex as number];
             if (baseP) {
                if (pItem.tamanho === 'A4') unit = baseP.a4;
                else if (pItem.tamanho === 'A3') unit = baseP.a3;
                else if (pItem.tamanho === 'Folha') unit = baseP.folha;
                else if (pItem.tamanho === 'Pacote') unit = baseP.pacote;
             }
           }
        } else if (type === 'materiais') {
            const mItem = item as ItemMaterial;
            if (mItem.materialIndex !== "" && mItem.tipoIndex !== "") {
              const baseM = prev.base.materiais[mItem.materialIndex as number];
              const baseT = baseM?.tipos[mItem.tipoIndex as number];
              if (baseT) unit = baseT.valor;
            }
        } else if (type === 'impressoes') {
           const iItem = item as ItemImpressao;
           const baseImp = prev.base.impressoes.find(b => b.tipo === iItem.tipo && b.formato === iItem.formato);
           if (baseImp) unit = baseImp.valor;
        } else if (type === 'maoObra') {
           const moItem = item as ItemMaoObra;
           if (moItem.profIndex !== "") {
             const baseMo = prev.base.maoObra[moItem.profIndex as number];
             if (baseMo) unit = baseMo.hora / 60;
             return { ...item, minutoValor: unit }; // Special case for maoObra field name
           }
        }
        return { ...item, unit };
      });

      return { ...prev, itens: { ...prev.itens, [type]: updatedList } };
    });
  };

  // Image Handlers
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) processFile(blob);
      }
    }
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setState(prev => ({ ...prev, imagens: [...prev.imagens, event.target!.result as string] }));
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // -- RENDER --

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-12">
      
      {/* Header */}
      <header className="bg-digra-blue sticky top-0 z-40 shadow-xl print:static print:shadow-none print:bg-transparent">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-4">
             {/* Logo Logic: Tries to load image, falls back to CSS styled logo if missing */}
             {!logoError ? (
               <img 
                src="logo-digra.png" 
                onError={() => setLogoError(true)} 
                alt="Logo DIGRA" 
                className="h-16 w-16 object-contain pointer-events-none"
               />
             ) : (
               <div className="h-16 w-16 rounded-full border-[3px] border-white flex items-center justify-center bg-digra-blue shadow-sm shrink-0">
                 <span className="text-white font-bold text-[14px] tracking-tighter">DIGRA</span>
               </div>
             )}
             
             {/* Modified Title Style */}
             <h1 className="text-3xl font-extrabold text-white tracking-wide print:text-black">
               Orçamento Gráfico
             </h1>
           </div>
           <div className="flex gap-3 no-print">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-white text-digra-blue font-bold rounded-lg shadow hover:bg-blue-50 transition-colors"
              >
                ⚙️ Valores Base
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                🖨️ Imprimir
              </button>
           </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 mt-6 print:mt-0 print:w-full print:max-w-none">
        
        {/* Info Card */}
        <SectionCard title="Informações Iniciais" icon="📑">
          <div className="grid grid-cols-12 gap-4">
            <InputGroup label="Quantidade Total *" widthClass="col-span-3">
              <input 
                type="number" min="1" 
                value={state.info.qtTotal} 
                onChange={e => updateInfo('qtTotal', parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-digra-blue outline-none" 
              />
            </InputGroup>
            <InputGroup label="Tamanho Final *" widthClass="col-span-4">
              <input 
                type="text" placeholder="Ex.: 210 × 297 mm (A4)"
                value={state.info.tamanhoFinal}
                onChange={e => updateInfo('tamanhoFinal', e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-digra-blue outline-none" 
              />
            </InputGroup>
            <InputGroup label="Tecnologia de Impressão *" widthClass="col-span-5">
              <div className="flex gap-3 mb-2">
                <button 
                  onClick={() => updateInfo('tec', 'OFFSET')}
                  className={`flex-1 py-3 rounded-xl border-2 font-extrabold transition-all ${
                    state.info.tec === 'OFFSET' 
                    ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-[0_0_0_3px_rgba(245,158,11,0.2)]' 
                    : 'border-slate-200 bg-white text-slate-700 hover:shadow-md'
                  }`}
                >
                  ⚙️ OFFSET
                </button>
                <button 
                  onClick={() => updateInfo('tec', 'DIGITAL')}
                  className={`flex-1 py-3 rounded-xl border-2 font-extrabold transition-all ${
                    state.info.tec === 'DIGITAL' 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]' 
                    : 'border-slate-200 bg-white text-slate-700 hover:shadow-md'
                  }`}
                >
                  🖨️ DIGITAL
                </button>
              </div>
              {state.info.tec === 'OFFSET' && (
                <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg text-center">
                  Tecnologia Offset — acréscimo de 10% aplicado
                </div>
              )}
              {state.info.tec === 'DIGITAL' && (
                <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-lg text-center">
                  Tecnologia Digital — isento dos 10%
                </div>
              )}
            </InputGroup>

            {/* Adjusted Widths: Reduced to col-span-6 to fit perfectly side-by-side */}
            <InputGroup label="Descrição do Serviço" widthClass="col-span-6">
              <textarea 
                rows={3}
                value={state.info.descricao}
                onChange={e => updateInfo('descricao', e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-digra-blue outline-none"
              ></textarea>
            </InputGroup>
            <InputGroup label="Dados Técnicos" widthClass="col-span-6">
              <textarea 
                 rows={3}
                 value={state.info.dadosTecnicos}
                 onChange={e => updateInfo('dadosTecnicos', e.target.value)}
                 className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-digra-blue outline-none"
              ></textarea>
            </InputGroup>
          </div>
        </SectionCard>

        {/* Images Card */}
        <SectionCard title="Imagens do Projeto" icon="🖼️">
          <div 
            className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 min-h-[420px] relative group cursor-pointer flex flex-wrap content-start p-4 gap-4 outline-none focus:border-digra-blue transition-colors"
            onClick={() => document.getElementById('fileInput')?.click()}
            tabIndex={0}
          >
            <input 
              id="fileInput"
              type="file" multiple accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) Array.from(e.target.files).forEach(processFile);
                e.target.value = '';
              }}
            />
            
            {state.imagens.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <p className="text-slate-400 font-bold text-lg text-center px-4 opacity-60 select-none">
                   📷 Clique aqui e cole suas imagens (Ctrl+V) • Você pode enviar múltiplas imagens
                 </p>
              </div>
            )}

            {state.imagens.map((img, idx) => (
               <div key={idx} className="relative w-[calc(50%-8px)] h-[380px] bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm overflow-hidden group/thumb">
                 <img src={img} alt={`Upload ${idx}`} className="max-w-full max-h-full object-contain" />
                 <button 
                  onClick={(e) => { e.stopPropagation(); setState(prev => ({...prev, imagens: prev.imagens.filter((_, i) => i !== idx)})); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-md no-print"
                  title="Excluir Imagem"
                 >
                   🗑️
                 </button>
               </div>
            ))}
          </div>
        </SectionCard>

        {/* Papeis */}
        <SectionCard title="Papéis Utilizados" icon="📄">
           <div className="mb-4 no-print">
             <button onClick={() => addItem('papeis', { id: generateId(), papelIndex: "", tamanho: "", qtd: 0, unit: 0 })} className="px-4 py-2 bg-digra-blue text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition-colors">
               + Adicionar Papel
             </button>
           </div>
           <div className="space-y-3">
             {state.itens.papeis.map((item, idx) => (
               <div key={item.id} className="grid grid-cols-[2fr_1.2fr_0.8fr_1fr_0.8fr_48px] gap-3 items-center">
                  <select 
                    className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                    value={item.papelIndex} 
                    onChange={e => updateItem('papeis', item.id, 'papelIndex', e.target.value === "" ? "" : parseInt(e.target.value))}
                  >
                    <option value="">Selecione o tipo...</option>
                    {state.base.papeis.map((p, i) => <option key={i} value={i}>{p.nome}</option>)}
                  </select>
                  <select 
                    className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                    value={item.tamanho}
                    onChange={e => updateItem('papeis', item.id, 'tamanho', e.target.value)}
                  >
                    <option value="">Tamanho...</option>
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Folha">Folha</option>
                    <option value="Pacote">Pacote</option>
                  </select>
                  <input type="number" placeholder="Qtd" className="h-11 px-3 border border-slate-200 rounded-lg" value={item.qtd || ''} onChange={e => updateItem('papeis', item.id, 'qtd', parseFloat(e.target.value))} />
                  <div className="h-11 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 select-none">{formatCurrency(item.unit)}</div>
                  <div className="h-11 px-3 flex items-center bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 select-none">{formatCurrency(item.qtd * item.unit)}</div>
                  <DeleteBtn onClick={() => removeItem('papeis', item.id)} />
               </div>
             ))}
           </div>
        </SectionCard>

        {/* Materiais */}
        <SectionCard title="Materiais Utilizados" icon="🔧">
          <div className="mb-4 no-print">
             <button onClick={() => addItem('materiais', { id: generateId(), materialIndex: "", tipoIndex: "", qtd: 0, unit: 0 })} className="px-4 py-2 bg-digra-blue text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition-colors">
               + Adicionar Material
             </button>
           </div>
           <div className="space-y-3">
             {state.itens.materiais.map((item) => {
                const material = typeof item.materialIndex === 'number' ? state.base.materiais[item.materialIndex] : null;
                return (
                  <div key={item.id} className="grid grid-cols-[2fr_1.2fr_0.8fr_1fr_0.8fr_48px] gap-3 items-center">
                      <select 
                        className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                        value={item.materialIndex}
                        onChange={e => {
                          // Reset sub-selection when main changes
                          const val = e.target.value;
                          const newIndex: number | "" = val === "" ? "" : parseInt(val);
                          setState(prev => {
                            const list = prev.itens.materiais.map(m => {
                                if (m.id !== item.id) return m;
                                const updated: ItemMaterial = { ...m, materialIndex: newIndex, tipoIndex: "" as const, unit: 0 };
                                return updated;
                            });
                            return { ...prev, itens: { ...prev.itens, materiais: list } };
                          });
                        }}
                      >
                        <option value="">Selecione material...</option>
                        {state.base.materiais.map((m, i) => <option key={i} value={i}>{m.nome}</option>)}
                      </select>
                      <select 
                        className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                        value={item.tipoIndex}
                        onChange={e => updateItem('materiais', item.id, 'tipoIndex', e.target.value === "" ? "" : parseInt(e.target.value))}
                        disabled={!material}
                      >
                        <option value="">Selecione o tipo...</option>
                        {material?.tipos.map((t, i) => <option key={i} value={i}>{t.nome}</option>)}
                      </select>
                      <input type="number" placeholder="Qtd" className="h-11 px-3 border border-slate-200 rounded-lg" value={item.qtd || ''} onChange={e => updateItem('materiais', item.id, 'qtd', parseFloat(e.target.value))} />
                      <div className="h-11 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 select-none">{formatCurrency(item.unit)}</div>
                      <div className="h-11 px-3 flex items-center bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 select-none">{formatCurrency(item.qtd * item.unit)}</div>
                      <DeleteBtn onClick={() => removeItem('materiais', item.id)} />
                  </div>
                );
             })}
           </div>
        </SectionCard>

        {/* Impressao Digital */}
        <SectionCard title="Impressão Digital" icon="🖨️">
           <div className="mb-4 no-print">
             <button onClick={() => addItem('impressoes', { id: generateId(), tipo: "", formato: "", qtd: 0, unit: 0 })} className="px-4 py-2 bg-digra-blue text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition-colors">
               + Adicionar Impressão
             </button>
           </div>
           <div className="space-y-3">
             {state.itens.impressoes.map((item) => {
               const uniqueTypes = Array.from(new Set(state.base.impressoes.map(i => i.tipo)));
               const availableFormats = state.base.impressoes.filter(i => i.tipo === item.tipo).map(i => i.formato);
               
               return (
                 <div key={item.id} className="grid grid-cols-[2fr_1.2fr_0.8fr_1fr_0.8fr_48px] gap-3 items-center">
                    <select 
                      className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                      value={item.tipo}
                      onChange={e => updateItem('impressoes', item.id, 'tipo', e.target.value)}
                    >
                      <option value="">Selecione o tipo...</option>
                      {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select 
                      className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                      value={item.formato}
                      onChange={e => updateItem('impressoes', item.id, 'formato', e.target.value)}
                      disabled={!item.tipo}
                    >
                      <option value="">Formato...</option>
                      {Array.from(new Set(availableFormats)).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <input type="number" placeholder="Qtd" className="h-11 px-3 border border-slate-200 rounded-lg" value={item.qtd || ''} onChange={e => updateItem('impressoes', item.id, 'qtd', parseFloat(e.target.value))} />
                    <div className="h-11 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 select-none">{formatCurrency(item.unit)}</div>
                    <div className="h-11 px-3 flex items-center bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 select-none">{formatCurrency(item.qtd * item.unit)}</div>
                    <DeleteBtn onClick={() => removeItem('impressoes', item.id)} />
                 </div>
               );
             })}
           </div>
        </SectionCard>

        {/* Mao de Obra */}
        <SectionCard title="Mão de Obra" icon="👷">
           <div className="mb-4 no-print">
             <button onClick={() => addItem('maoObra', { id: generateId(), profIndex: "", minutes: 0, minutoValor: 0 })} className="px-4 py-2 bg-digra-blue text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition-colors">
               + Adicionar Profissional
             </button>
           </div>
           <div className="space-y-3">
             {state.itens.maoObra.map(item => (
               <div key={item.id} className="grid grid-cols-[2fr_1.2fr_0.8fr_1fr_0.8fr_48px] gap-3 items-center">
                  <select 
                    className="h-11 px-3 border border-slate-200 rounded-lg bg-white"
                    value={item.profIndex}
                    onChange={e => updateItem('maoObra', item.id, 'profIndex', e.target.value === "" ? "" : parseInt(e.target.value))}
                  >
                    <option value="">Profissional...</option>
                    {state.base.maoObra.map((o, i) => <option key={i} value={i}>{o.profissional}</option>)}
                  </select>
                  <div className="invisible">—</div>
                  <input type="number" placeholder="Minutos" className="h-11 px-3 border border-slate-200 rounded-lg" value={item.minutos || ''} onChange={e => updateItem('maoObra', item.id, 'minutos', parseFloat(e.target.value))} />
                  <div className="h-11 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 select-none">{formatCurrency(item.minutoValor)} / min</div>
                  <div className="h-11 px-3 flex items-center bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 select-none">{formatCurrency(item.minutos * item.minutoValor)}</div>
                  <DeleteBtn onClick={() => removeItem('maoObra', item.id)} />
               </div>
             ))}
           </div>
        </SectionCard>

        {/* Financial Summary - Match background with Add Buttons (Blue-900/Digra Blue) */}
        <section className="mb-8 bg-digra-blue text-white rounded-xl shadow-2xl border border-white/20 overflow-hidden page-break-avoid">
          <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2 font-extrabold text-lg">
            <span className="text-xl">💡</span> Resumo Financeiro
          </div>
          <div className="p-6">
            <div className="grid grid-cols-12 gap-4 mb-6">
              {[
                { l: 'Papéis', v: totals.totalPapeis },
                { l: 'Materiais', v: totals.totalMateriais },
                { l: 'Impressão', v: totals.totalImpressoes },
                { l: 'Mão de Obra', v: totals.totalMaoObra },
                { l: 'Acréscimo 10%', v: totals.acrescimo },
                { l: 'TOTAL GERAL', v: totals.totalGeral, highlight: true },
                { l: 'Valor Unitário', v: totals.valorUnitario, highlight: true },
                { l: 'Tecnologia', v: state.info.tec, text: true }
              ].map((k, i) => (
                 <div key={i} className="col-span-3 bg-white/10 border border-white/10 rounded-lg p-3">
                   <div className="text-blue-100 font-bold text-sm mb-1">{k.l}</div>
                   <div className={`text-lg ${k.highlight ? 'font-extrabold text-white' : 'font-semibold text-blue-50'}`}>
                     {k.text ? k.v : formatCurrency(k.v as number)}
                   </div>
                 </div>
              ))}
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
               <span className="block font-bold text-blue-100 mb-1">Valor Unitário Final</span>
               <div className="font-extrabold text-3xl">{formatCurrency(totals.valorUnitario)}</div>
            </div>
          </div>
          
          {/* Sticky Bottom Bar for Totals */}
          <div className="bg-white/10 border-t border-white/10 px-6 py-4 flex justify-between items-center print:bg-transparent print:border-black print:text-black">
             <div className="text-lg">
               <strong>Total:</strong> <span className="text-xl font-bold mx-1">{formatCurrency(totals.totalGeral)}</span>
               <span className="mx-2 opacity-50">•</span>
               Unitário: <b className="text-xl mx-1">{formatCurrency(totals.valorUnitario)}</b>
             </div>
             <div className="flex gap-2 no-print">
               <button onClick={() => window.print()} className="px-4 py-2 border border-white/40 hover:bg-white/10 rounded-lg font-bold transition-colors">🖨️ PDF</button>
               <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white text-digra-blue hover:bg-blue-50 rounded-lg font-bold transition-colors">⚙️ Editar Base</button>
             </div>
          </div>
        </section>

        <footer className="text-center text-slate-500 font-medium py-6">
           ⚡ Alexandre | DIGRA Apps
        </footer>

      </main>

      <BaseDataModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        baseData={state.base}
        onSave={(newData) => {
          setState(prev => ({ ...prev, base: newData }));
          setIsModalOpen(false);
        }}
      />

    </div>
  );
}

export default App;