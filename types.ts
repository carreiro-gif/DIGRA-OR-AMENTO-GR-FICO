export interface PapelBase {
  nome: string;
  a4: number;
  a3: number;
  folha: number;
  pacote: number;
  folhasPacote: number | null;
}

export interface MaterialTipo {
  nome: string;
  valor: number;
}

export interface MaterialBase {
  nome: string;
  tipos: MaterialTipo[];
}

export interface ImpressaoBase {
  tipo: string;
  formato: string;
  valor: number;
}

export interface MaoObraBase {
  profissional: string;
  hora: number;
}

export interface BaseData {
  papeis: PapelBase[];
  materiais: MaterialBase[];
  impressoes: ImpressaoBase[];
  maoObra: MaoObraBase[];
}

// --- Item Instances ---

export interface ItemPapel {
  id: string;
  papelIndex: number | "";
  tamanho: "A4" | "A3" | "Folha" | "Pacote" | "";
  qtd: number;
  unit: number;
}

export interface ItemMaterial {
  id: string;
  materialIndex: number | "";
  tipoIndex: number | "";
  qtd: number;
  unit: number;
}

export interface ItemImpressao {
  id: string;
  tipo: string;
  formato: string;
  qtd: number;
  unit: number;
}

export interface ItemMaoObra {
  id: string;
  profIndex: number | "";
  minutos: number;
  minutoValor: number;
}

export interface AppInfo {
  qtTotal: number;
  tamanhoFinal: string;
  tec: 'OFFSET' | 'DIGITAL';
  descricao: string;
  dadosTecnicos: string;
}

export interface AppState {
  info: AppInfo;
  itens: {
    papeis: ItemPapel[];
    materiais: ItemMaterial[];
    impressoes: ItemImpressao[];
    maoObra: ItemMaoObra[];
  };
  imagens: string[]; // Base64 strings
  base: BaseData;
}
