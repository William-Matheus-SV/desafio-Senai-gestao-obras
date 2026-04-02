// =============================================
// [DADO] rh.js
// Dados de Recursos Humanos:
//   - funcionarios: lista completa de colaboradores
//   - alocacoes: mapa de unidade → IDs alocados
// =============================================

const funcionarios = [
    { id: 1,  codigo: "FUN-001", nome: "João Silva",      funcao: "Pedreiro",    area: "Fundação",   status: "disponivel" },
    { id: 2,  codigo: "FUN-002", nome: "Maria Santos",    funcao: "Pintora",     area: "Pintura",    status: "disponivel" },
    { id: 3,  codigo: "FUN-003", nome: "Pedro Oliveira",  funcao: "Servente",    area: "Reboço",     status: "disponivel" },
    { id: 4,  codigo: "FUN-004", nome: "Ana Costa",       funcao: "Eletricista", area: "Elétrica",   status: "disponivel" },
    { id: 5,  codigo: "FUN-005", nome: "Carlos Ferreira", funcao: "Encanador",   area: "Hidráulica", status: "disponivel" },
    { id: 6,  codigo: "FUN-006", nome: "Juliana Lima",    funcao: "Pedreiro",    area: "Fundação",   status: "disponivel" },
    { id: 7,  codigo: "FUN-007", nome: "Roberto Alves",   funcao: "Carpinteiro", area: "Estrutura",  status: "alocado"    },
    { id: 8,  codigo: "FUN-008", nome: "Fernanda Souza",  funcao: "Pintora",     area: "Pintura",    status: "alocado"    },
    { id: 9,  codigo: "FUN-009", nome: "Lucas Martins",   funcao: "Servente",    area: "Reboço",     status: "alocado"    },
    { id: 10, codigo: "FUN-010", nome: "Beatriz Rocha",   funcao: "Pedreiro",    area: "Fundação",   status: "alocado"    },
    { id: 11, codigo: "FUN-011", nome: "Ricardo Nunes",   funcao: "Azulejista",  area: "Acabamento", status: "disponivel" },
    { id: 12, codigo: "FUN-012", nome: "Patricia Dias",   funcao: "Gesseiro",    area: "Acabamento", status: "disponivel" }
];
// ======================= DADOS PARA GESTÃO DA EQUIPE =======================

// Funcionários com status expandido
const funcionariosEquipe = [
    { id: 1002, matricula: "MAT-1002", nome: "Carlos Eduardo", funcao: "Pedreiro", frenteServico: "Alvenaria - Torre A", status: "TRABALHANDO", ultimaTarefa: "Levantamento de paredes" },
    { id: 1008, matricula: "MAT-1008", nome: "João Batista", funcao: "Armador", frenteServico: "Fundação - Setor Sul", status: "TRABALHANDO", ultimaTarefa: "Montagem de armação" },
    { id: 1015, matricula: "MAT-1015", nome: "Sérgio Ramos", funcao: "Servente", frenteServico: null, status: "AGUARDANDO", ultimaTarefa: "Descarga de Cimento (Ontem)" },
    { id: 1022, matricula: "MAT-1022", nome: "Roberto Nunes", funcao: "Eletricista", frenteServico: null, status: "AUSENTE", ultimaTarefa: null },
    { id: 1028, matricula: "MAT-1028", nome: "Marcos Felipe", funcao: "Ajudante Geral", frenteServico: null, status: "AGUARDANDO", ultimaTarefa: "Recém chegado da Base" },
    { id: 1035, matricula: "MAT-1035", nome: "José Aldo", funcao: "Pedreiro", frenteServico: "Alvenaria - Torre B", status: "TRABALHANDO", ultimaTarefa: "Assentamento de blocos" },
    { id: 1042, matricula: "MAT-1042", nome: "Anderson Silva", funcao: "Servente", frenteServico: "Pátio Central", status: "TRABALHANDO", ultimaTarefa: "Transporte de material" },
];

// Funções disponíveis para filtro
const funcoesDisponiveis = ["Pedreiro", "Servente", "Armador", "Eletricista", "Ajudante Geral"];

// Frontes de serviço disponíveis
const frontesServico = [
    "Alvenaria - Torre A",
    "Alvenaria - Torre B",
    "Fundação - Setor Norte",
    "Fundação - Setor Sul",
    "Acabamento e Limpeza",
    "Pátio Central"
];

// Mapa: id da unidade → array de IDs de funcionários alocados
let alocacoes = {
    1: [7, 8, 9, 10], // Unidade 1 (Residencial Jardins)
    2: []              // Unidade 2 (Comercial Centro) — sem alocações
};
