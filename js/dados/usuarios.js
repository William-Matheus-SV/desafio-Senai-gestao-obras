// =============================================
// [DADO] usuarios.js
// Credenciais e perfis de acesso do sistema.
// Substituir por chamada de API no futuro.
// =============================================

const USUARIOS = {
    mestre: {
        nome: "João Silva",
        senha: "123",
        perfil: "MESTRE_OBRAS",
        permissao: ["checklist", "solicitacao", "relatorios", "alocacao"]
    },
    almoxarife: {
        nome: "Carlos Souza",
        senha: "123",
        perfil: "ALMOXARIFE",
        permissao: ["solicitacao", "estoque"]
    }
};
