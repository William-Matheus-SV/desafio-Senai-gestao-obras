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

// Mapa: id da unidade → array de IDs de funcionários alocados
let alocacoes = {
    1: [7, 8, 9, 10], // Unidade 1 (Residencial Jardins)
    2: []              // Unidade 2 (Comercial Centro) — sem alocações
};
