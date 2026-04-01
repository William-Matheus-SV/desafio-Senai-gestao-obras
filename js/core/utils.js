// =============================================
// [AÇÃO] utils.js
// Funções utilitárias globais reutilizáveis.
// Não dependem de estado de negócio.
// =============================================

function formatarData(dataStr) {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
