import { BaseData } from './types';

export const INITIAL_BASE_DATA: BaseData = {
  "papeis": [
    { "nome": "Adesivo Fosco - 180g", "a4": 0.33, "a3": 0.74, "folha": 2.97, "pacote": 296.64, "folhasPacote": null },
    { "nome": "Cartão Triplex - 250g", "a4": 0.35, "a3": 0.79, "folha": 3.17, "pacote": 475.0, "folhasPacote": null },
    { "nome": "Cartolina Branca - 180g", "a4": 0.29, "a3": 0.57, "folha": 1.14, "pacote": 114.0, "folhasPacote": null },
    { "nome": "Cartolina Branca - 240g", "a4": 0.24, "a3": 0.48, "folha": 0.95, "pacote": 95.0, "folhasPacote": null },
    { "nome": "Couché 115g", "a4": 0.09, "a3": 0.19, "folha": 0.77, "pacote": 192.0, "folhasPacote": null },
    { "nome": "Couché 150g", "a4": 0.08, "a3": 0.17, "folha": 0.68, "pacote": 169.45, "folhasPacote": null },
    { "nome": "Couché 210g", "a4": 0.19, "a3": 0.43, "folha": 1.71, "pacote": 256.69, "folhasPacote": null },
    { "nome": "Kraft 110g", "a4": 0.11, "a3": 0.24, "folha": 0.97, "pacote": 241.84, "folhasPacote": null },
    { "nome": "Opaline 180g", "a4": 0.19, "a3": 0.42, "folha": 1.68, "pacote": 114.0, "folhasPacote": null },
    { "nome": "Offset 75g", "a4": 0.06, "a3": 0.13, "folha": 0.53, "pacote": 132.0, "folhasPacote": null },
    { "nome": "Offset 90g", "a4": 0.05, "a3": 0.12, "folha": 0.47, "pacote": 236.71, "folhasPacote": null },
    { "nome": "Offset 120g", "a4": 0.09, "a3": 0.2, "folha": 0.8, "pacote": 200.01, "folhasPacote": null },
    { "nome": "Vergê 80g", "a4": 0.04, "a3": 0.1, "folha": 0.39, "pacote": 98.64, "folhasPacote": null },
    { "nome": "Vergê 180g", "a4": 0.12, "a3": 0.28, "folha": 1.12, "pacote": 139.49, "folhasPacote": null }
  ],
  "materiais": [
    { "nome": "Laser Filme", "tipos": [{ "nome": "A3 (por folha)", "valor": 3.57 }, { "nome": "Ofício II (por folha)", "valor": 1.9 }] },
    { "nome": "Chapa Offset Positiva", "tipos": [{ "nome": "SAKURAI", "valor": 7.58 }, { "nome": "HEIDELBERG", "valor": 14.0 }] },
    { "nome": "Chapa Offset Térmica Digital (CTP)", "tipos": [{ "nome": "SAKURAI", "valor": 57.0 }, { "nome": "HEIDELBERG", "valor": 54.5 }] },
    { "nome": "Espiral", "tipos": [{ "nome": "7 MM", "valor": 0.11 }, { "nome": "9 MM", "valor": 0.13 }, { "nome": "12 MM", "valor": 0.28 }, { "nome": "14 MM", "valor": 0.36 }, { "nome": "17 MM", "valor": 0.44 }, { "nome": "20 MM", "valor": 0.64 }, { "nome": "23 MM", "valor": 0.75 }, { "nome": "25 MM", "valor": 0.98 }, { "nome": "29 MM", "valor": 1.25 }, { "nome": "33 MM", "valor": 1.52 }, { "nome": "40 MM", "valor": 1.7 }, { "nome": "45 MM", "valor": 2.37 }, { "nome": "50 MM", "valor": 3.16 }] },
    { "nome": "Capa para Encadernação PP", "tipos": [{ "nome": "Transparente", "valor": 0.4 }, { "nome": "Preta", "valor": 0.3 }] },
    { "nome": "Fita Dupla Face", "tipos": [{ "nome": "19 MM (por cm)", "valor": 0.005 }, { "nome": "25 MM (por cm)", "valor": 0.0043 }, { "nome": "50 MM (por cm)", "valor": 0.0086 }] },
    { "nome": "Bobina Polietileno (Plastificação)", "tipos": [{ "nome": "34CM×0,05MM×60M (por cm)", "valor": 0.0342 }] },
    { "nome": "Adesivo Vinil", "tipos": [{ "nome": "Preto (por metro)", "valor": 14.4 }, { "nome": "Azul Médio (por metro)", "valor": 15.86 }, { "nome": "Vermelho Médio (por metro)", "valor": 18.31 }, { "nome": "Transparente (por metro)", "valor": 9.9 }] },
    { "nome": "Máscara de Transferência", "tipos": [{ "nome": "Máscara (por metro)", "valor": 17.11 }] },
    { "nome": "Bolsa para Pastas", "tipos": [{ "nome": "25×11", "valor": 0.27 }] }
  ],
  "impressoes": [
    { "tipo": "PRETO (1 lado)", "formato": "A4", "valor": 0.03 },
    { "tipo": "PRETO (1 lado)", "formato": "A3", "valor": 0.06 },
    { "tipo": "PRETO (FRENTE E VERSO)", "formato": "A4", "valor": 0.06 },
    { "tipo": "PRETO (FRENTE E VERSO)", "formato": "A3", "valor": 0.12 },
    { "tipo": "COLORIDO (1 lado)", "formato": "A4", "valor": 0.25 },
    { "tipo": "COLORIDO (1 lado)", "formato": "A3", "valor": 0.46 },
    { "tipo": "COLORIDO (FRENTE E VERSO)", "formato": "A4", "valor": 0.5 },
    { "tipo": "COLORIDO (FRENTE E VERSO)", "formato": "A3", "valor": 0.92 }
  ],
  "maoObra": [
    { "profissional": "COORDENADOR DE ARTES GRÁFICAS", "hora": 85.67 },
    { "profissional": "DESIGNER GRÁFICO", "hora": 65.0 },
    { "profissional": "ORÇAMENTISTA GRÁFICO", "hora": 41.37 },
    { "profissional": "MESTRE IMPRESSOR", "hora": 53.84 },
    { "profissional": "IMPRESSOR DIGITAL", "hora": 36.0 },
    { "profissional": "MESTRE IMPRESSOR OFFSET", "hora": 53.84 },
    { "profissional": "IMPRESSOR OFFSET", "hora": 36.0 },
    { "profissional": "OPERADOR DE GUILHOTINA", "hora": 36.0 },
    { "profissional": "MESTRE DE SERVIÇOS GRÁFICOS", "hora": 53.84 },
    { "profissional": "OPERADOR DE ACABAMENTO GRÁFICO", "hora": 36.0 },
    { "profissional": "ENCARREGADO", "hora": 53.84 }
  ]
};