// =============================================
// [DADO] obras.js
// Dados de Obras e Checklist:
//   - unidades: lista de unidades de obra
//   - topicosFixos: estrutura estática do checklist
//   - checklistsData: estado dinâmico dos checkboxes (em memória)
//   - relatoriosEnviados: histórico de relatórios (persistido no localStorage)
//   - currentUnidadeCheck / currentDia: estado de navegação do checklist
//   - currentUnidadeAlocacao: estado de navegação da alocação
// =============================================

const unidades = [
    { id: 1, nome: "Residencial Jardins" },
    { id: 2, nome: "Comercial Centro"    }
];

const topicosFixos = [
    {
        nome: "Segurança do Trabalho",
        tarefas: [
            "EPI's (capacete, luva, óculos)",
            "Botas de segurança",
            "Uniforme padronizado",
            "Cinto de segurança",
            "Proteções coletivas"
        ]
    },
    {
        nome: "Materiais",
        tarefas: [
            "Blocos de concreto (principais para as paredes)",
            "Argamassa (assentamento dos blocos)",
            "Concreto (base/laje)",
            "Vergalhões (armação estrutural)",
            "Formas metálicas e madeira (para moldagem)",
            "Telhas cerâmicas"
        ]
    },
    {
        nome: "Equipamentos",
        tarefas: [
            "Betoneira (preparo de argamassa/concreto)",
            "Carrinho de mão (transporte de material)",
            "Andaimes metálicos (trabalho em altura)",
            "Ferramentas elétricas (serra circular, furadeira) revisadas",
            "Bancadas de apoio (corte/preparo)",
            "Ferramentas operacionais (Baldes, Régua, Colher de Pedreiro)"
        ]
    },
    {
        nome: "Ações do dia",
        tarefas: [
            "Conferência do escopo de trabalho conforme planejado",
            "Reunião de alinhamento da equipe (briefing)",
            "Levantamento de paredes (alvenaria estrutural)",
            "Assentamento de blocos com argamassa",
            "Alinhamento e nivelamento das paredes",
            "Limpeza do canteiro após cada etapa",
            "Registro fotográfico do avanço físico",
            "Cumprimento do cronograma do dia (meta batida)"
        ]
    }
];

// Estado dinâmico dos checkboxes — chave: "{unidadeId}_dia{N}"
let checklistsData = {};

// Relatórios finalizados — persistido no localStorage
let relatoriosEnviados = [];

// Estado de navegação
let currentUnidadeCheck    = 1;
let currentDia             = 1;
let currentUnidadeAlocacao = 1;
