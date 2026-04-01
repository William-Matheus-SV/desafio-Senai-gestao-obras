// =============================================
// [DADO] suprimentos.js
// Dados de Suprimentos e Estoques:
//   - materiais: catálogo geral de materiais
//   - armazemCentral: estoque do armazém principal
//   - movimentacoesArmazem: histórico de entradas/saídas
//   - estoque: saldo por material por unidade de obra
//   - solicitacoes: pedidos de material entre unidades
// =============================================

const materiais = [
    { id: 1, codigo: "MAT-001", nome: "Cimento Portland",    marca: "Votorantim",       estoque_minimo: 50  },
    { id: 2, codigo: "MAT-003", nome: "Tijolo Cerâmico",     marca: "Cerâmica São João", estoque_minimo: 500 },
    { id: 3, codigo: "MAT-007", nome: "Telha Cerâmica",      marca: "Cerâmica Martins",  estoque_minimo: 200 },
    { id: 4, codigo: "MAT-011", nome: "Tinta Acrílica",      marca: "Suvinil",           estoque_minimo: 30  },
    { id: 5, codigo: "MAT-015", nome: "Impermeabilizante",   marca: "Vedacit",           estoque_minimo: 20  }
];

let armazemCentral = [
    { id_material: 1, codigo: "MAT-001", nome: "Cimento Portland",  marca: "Votorantim",        saldo_atual: 2500, estoque_minimo: 500,  unidade_medida: "SC", ultima_entrada: "2025-03-28", ultima_saida: null },
    { id_material: 2, codigo: "MAT-003", nome: "Tijolo Cerâmico",   marca: "Cerâmica São João",  saldo_atual: 8000, estoque_minimo: 2000, unidade_medida: "UN", ultima_entrada: "2025-03-25", ultima_saida: null },
    { id_material: 3, codigo: "MAT-007", nome: "Telha Cerâmica",    marca: "Cerâmica Martins",   saldo_atual: 3500, estoque_minimo: 800,  unidade_medida: "UN", ultima_entrada: "2025-03-20", ultima_saida: null },
    { id_material: 4, codigo: "MAT-011", nome: "Tinta Acrílica",    marca: "Suvinil",            saldo_atual: 450,  estoque_minimo: 100,  unidade_medida: "L",  ultima_entrada: "2025-03-15", ultima_saida: null },
    { id_material: 5, codigo: "MAT-015", nome: "Impermeabilizante", marca: "Vedacit",            saldo_atual: 80,  estoque_minimo: 80,   unidade_medida: "L",  ultima_entrada: "2025-03-18", ultima_saida: null }
];

let movimentacoesArmazem = [
    { id: 1, tipo: "ENTRADA", id_material: 1, quantidade: 500,  data: "2025-03-28", documento: "NF-12345", fornecedor: "Cimenteira Nacional", observacao: "Compra mensal"    },
    { id: 2, tipo: "ENTRADA", id_material: 2, quantidade: 2000, data: "2025-03-25", documento: "NF-12340", fornecedor: "Cerâmica São João",   observacao: "Reposição estoque" }
];

let estoque = [
    { id_estoque: 1, id_material: 1, id_unidade: 1, saldo_atual: 450,  estoque_minimo: 50  },
    { id_estoque: 2, id_material: 2, id_unidade: 1, saldo_atual: 1200, estoque_minimo: 500 },
    { id_estoque: 3, id_material: 3, id_unidade: 1, saldo_atual: 540,  estoque_minimo: 200 },
    { id_estoque: 4, id_material: 4, id_unidade: 1, saldo_atual: 125,  estoque_minimo: 30  },
    { id_estoque: 5, id_material: 5, id_unidade: 1, saldo_atual: 142,  estoque_minimo: 20  },
    { id_estoque: 6, id_material: 1, id_unidade: 2, saldo_atual: 220,  estoque_minimo: 50  },
    { id_estoque: 7, id_material: 2, id_unidade: 2, saldo_atual: 800,  estoque_minimo: 500 },
    { id_estoque: 8, id_material: 3, id_unidade: 2, saldo_atual: 300,  estoque_minimo: 200 }
];

let solicitacoes = [
    { id: 1, id_unidade: 1, id_material: 1, quantidade: 100, status: "PENDENTE", justificativa: "Acabou o cimento",  data: "2025-03-20" },
    { id: 2, id_unidade: 1, id_material: 4, quantidade: 20,  status: "APROVADA", justificativa: "Pintura fachada",   data: "2025-03-22" }
];
