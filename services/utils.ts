import { AppState } from "../types";

export const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatCurrency = (value: number) => BRL.format(value);

export const calculateTotals = (state: AppState) => {
  const totalPapeis = state.itens.papeis.reduce((acc, item) => acc + (item.qtd * item.unit), 0);
  const totalMateriais = state.itens.materiais.reduce((acc, item) => acc + (item.qtd * item.unit), 0);
  const totalImpressoes = state.itens.impressoes.reduce((acc, item) => acc + (item.qtd * item.unit), 0);
  const totalMaoObra = state.itens.maoObra.reduce((acc, item) => acc + (item.minutos * item.minutoValor), 0);

  const subtotal = totalPapeis + totalMateriais + totalImpressoes + totalMaoObra;
  
  // 10% Markup for OFFSET
  const acrescimo = state.info.tec === 'OFFSET' ? subtotal * 0.10 : 0;
  
  const totalGeral = subtotal + acrescimo;
  
  const qtTotal = Math.max(1, state.info.qtTotal || 1);
  const valorUnitario = totalGeral / qtTotal;

  return {
    totalPapeis,
    totalMateriais,
    totalImpressoes,
    totalMaoObra,
    acrescimo,
    totalGeral,
    valorUnitario
  };
};

export const generateId = () => Math.random().toString(36).substr(2, 9);