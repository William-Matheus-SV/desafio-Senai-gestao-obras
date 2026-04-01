// =============================================
// [AÇÃO] eventos.js
// Todos os event listeners do sistema.
// Este arquivo não contém lógica de negócio —
// apenas conecta ações do usuário às funções
// definidas em ui.js e auth.js.
// =============================================

function carregarDadosIniciais() {

    // ===== SELECTS DE MATERIAIS =====
    preencherSelectMateriais("solicMaterial");
    preencherSelectMateriais("movMaterial");

    // ===== RENDERIZAÇÕES INICIAIS =====
    renderSolicitacoes();
    renderEstoque();
    renderChecklistForm();
    criarBotoesDias();

    // ===== FILTROS DE SOLICITAÇÃO =====
    document.getElementById("filtroStatusSolicitacao").addEventListener("change", renderSolicitacoes);
    document.getElementById("filtroUnidadeSolicitacao").addEventListener("change", renderSolicitacoes);

    // ===== FILTROS DE ESTOQUE =====
    document.getElementById("filtroUnidadeEstoque").addEventListener("change", renderEstoque);
    document.getElementById("buscaEstoque").addEventListener("input", renderEstoque);

    // ===== ENVIO DE RELATÓRIO =====
    document.getElementById("btnEnviarRelatorio").addEventListener("click", () => {
        const key           = `${currentUnidadeCheck}_dia${currentDia}`;
        const checklistAtual = checklistsData[key];

        if (!checklistAtual || Object.keys(checklistAtual).length === 0) {
            alert("Nenhum item de checklist foi preenchido ainda!");
            return;
        }

        let total = 0, concluidos = 0;
        Object.keys(checklistAtual).forEach(k => {
            total++;
            if (checklistAtual[k].concluido) concluidos++;
        });
        const percentual  = total === 0 ? 0 : Math.round((concluidos / total) * 100);
        const unidadeNome = unidades.find(u => u.id === currentUnidadeCheck)?.nome || '';

        salvarRelatorio(currentUnidadeCheck, unidadeNome, currentDia, new Date().toISOString(), checklistAtual, percentual);
        alert(`✅ Relatório do Dia ${currentDia} enviado com sucesso!\n\nProgresso: ${percentual}% concluído\nUnidade: ${unidadeNome}`);

        if (document.getElementById('relatoriosPanel').style.display !== 'none') {
            renderizarRelatorios();
        }
    });

    // ===== SELETOR DE UNIDADE — CHECKLIST =====
    document.querySelectorAll("#unidadeSelectChecklist .dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
            currentUnidadeCheck = parseInt(item.dataset.unidadeId);
            document.getElementById("unidadeChecklistLabel").innerText = item.innerText;
            renderChecklistForm();
        });
    });

    // ===== RELATÓRIOS =====
    carregarRelatoriosSalvos();

    const exportarBtn = document.getElementById('exportarRelatoriosBtn');
    if (exportarBtn) exportarBtn.addEventListener('click', exportarRelatoriosCSV);

    const buscarBtn = document.getElementById('buscarRelatoriosBtn');
    if (buscarBtn) buscarBtn.addEventListener('click', renderizarRelatorios);

    ['filtroUnidadeRelatorio', 'filtroDiaRelatorio', 'filtroDataRelatorio'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', renderizarRelatorios);
    });

    // ===== ALOCAÇÃO DE FUNCIONÁRIOS =====
    carregarAlocacoesSalvas();

    const filtroArea = document.getElementById('filtroAreaAlocacao');
    if (filtroArea) filtroArea.addEventListener('change', renderizarFuncionarios);

    const buscaFunc = document.getElementById('buscaFuncionario');
    if (buscaFunc) buscaFunc.addEventListener('input', renderizarFuncionarios);

    const confirmarAloc = document.getElementById('confirmarAlocacaoBtn');
    if (confirmarAloc) confirmarAloc.addEventListener('click', confirmarAlocacao);

    document.querySelectorAll("#unidadeSelectAlocacao .dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
            currentUnidadeAlocacao = parseInt(item.dataset.unidadeId);
            document.getElementById("unidadeAlocacaoLabel").innerText = item.innerText;
            renderizarFuncionarios();
        });
    });

    // ===== ARMAZÉM CENTRAL =====
    carregarDadosArmazemSalvos();
    renderizarArmazem();

    const movArmazemMaterial = document.getElementById('movArmazemMaterial');
    if (movArmazemMaterial) {
        movArmazemMaterial.innerHTML = '';
        armazemCentral.forEach(mat => {
            movArmazemMaterial.innerHTML += `<option value="${mat.id_material}">${mat.codigo} - ${mat.nome} (Saldo: ${mat.saldo_atual} ${mat.unidade_medida})</option>`;
        });
    }

    const confirmarMovArmazemBtn = document.getElementById('confirmarMovimentacaoArmazemBtn');
    if (confirmarMovArmazemBtn) {
        confirmarMovArmazemBtn.addEventListener('click', () => {
            const tipo       = document.getElementById('movArmazemTipo').value;
            const idMaterial = parseInt(document.getElementById('movArmazemMaterial').value);
            const quantidade = parseInt(document.getElementById('movArmazemQuantidade').value);
            const documento  = document.getElementById('movArmazemDocumento').value;
            const fornecedor = document.getElementById('movArmazemFornecedor').value;
            const observacao = document.getElementById('movArmazemObs').value;

            if (quantidade > 0 && idMaterial) {
                const sucesso = registrarMovimentacaoArmazem(tipo, idMaterial, quantidade, documento, fornecedor, observacao);
                if (sucesso) {
                    bootstrap.Modal.getInstance(document.getElementById('movimentacaoArmazemModal')).hide();
                    renderizarArmazem();
                    document.getElementById('movArmazemQuantidade').value  = '';
                    document.getElementById('movArmazemDocumento').value   = '';
                    document.getElementById('movArmazemFornecedor').value  = '';
                    document.getElementById('movArmazemObs').value         = '';
                    alert('Movimentação registrada com sucesso!');
                }
            } else {
                alert('Preencha todos os campos corretamente!');
            }
        });
    }

    // ===== RELATÓRIO DO ARMAZÉM =====
    const gerarRelatorioBtn = document.getElementById('gerarRelatorioArmazemBtn');
    if (gerarRelatorioBtn) {
        gerarRelatorioBtn.addEventListener('click', () => {
            const dataInicio = document.getElementById('relatorioDataInicio').value;
            const dataFim    = document.getElementById('relatorioDataFim').value;

            let movFiltradas = [...movimentacoesArmazem];
            if (dataInicio) movFiltradas = movFiltradas.filter(m => m.data >= dataInicio);
            if (dataFim)    movFiltradas = movFiltradas.filter(m => m.data <= dataFim);

            const totalEntradas = movFiltradas.filter(m => m.tipo === 'ENTRADA').reduce((sum, m) => sum + m.quantidade, 0);
            const totalSaidas   = movFiltradas.filter(m => m.tipo === 'SAIDA').reduce((sum, m) => sum + m.quantidade, 0);

            const resultadoDiv = document.getElementById('relatorioResultado');
            const conteudoDiv  = document.getElementById('conteudoRelatorio');

            conteudoDiv.innerHTML = `
                <div class="row">
                    <div class="col-6">
                        <div class="alert alert-success">
                            <strong>📥 Total de Entradas:</strong><br>${totalEntradas} unidades
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="alert alert-danger">
                            <strong>📤 Total de Saídas:</strong><br>${totalSaidas} unidades
                        </div>
                    </div>
                </div>
                <div class="alert alert-info">
                    <strong>📊 Saldo Final do Período:</strong><br>Variação: ${totalEntradas - totalSaidas} unidades
                </div>
                <hr>
                <strong>📋 Movimentações no período (${movFiltradas.length} registros):</strong>
                <ul class="mt-2" style="max-height: 300px; overflow-y: auto;">
                    ${movFiltradas.slice(0, 20).map(m => {
                        const material = armazemCentral.find(a => a.id_material === m.id_material);
                        return `<li>${formatarData(m.data)} - ${m.tipo}: ${material?.nome || 'Material'} - ${m.quantidade} ${material?.unidade_medida || 'un'}</li>`;
                    }).join('')}
                    ${movFiltradas.length > 20 ? `<li class="text-muted">... e mais ${movFiltradas.length - 20} registros</li>` : ''}
                </ul>`;
            resultadoDiv.style.display = 'block';
        });
    }

    // ===== INTERVAL — ATUALIZAÇÃO DO SELECT DO ARMAZÉM =====
    setInterval(() => {
        const select = document.getElementById('movArmazemMaterial');
        if (select && document.getElementById('armazemPanel').style.display !== 'none') {
            const valorAtual = select.value;
            select.innerHTML = '';
            armazemCentral.forEach(mat => {
                select.innerHTML += `<option value="${mat.id_material}">${mat.codigo} - ${mat.nome} (Saldo: ${mat.saldo_atual} ${mat.unidade_medida})</option>`;
            });
            if (valorAtual) select.value = valorAtual;
        }
    }, 2000);

    // ===== MODAIS — SOLICITAÇÃO E MOVIMENTAÇÃO =====
    document.getElementById("confirmarSolicitacaoBtn").addEventListener("click", () => {
        const unidade  = parseInt(document.getElementById("solicUnidade").value);
        const material = parseInt(document.getElementById("solicMaterial").value);
        const qtd      = parseInt(document.getElementById("solicQuantidade").value);
        const justif   = document.getElementById("solicJustificativa").value;
        if (qtd > 0) {
            solicitacoes.push({
                id: Date.now(), id_unidade: unidade, id_material: material,
                quantidade: qtd, status: "PENDENTE", justificativa: justif,
                data: new Date().toISOString().slice(0, 10)
            });
            renderSolicitacoes();
            bootstrap.Modal.getInstance(document.getElementById('novaSolicitacaoModal')).hide();
        }
    });

    document.getElementById("confirmarMovimentacaoBtn").addEventListener("click", () => {
        const unidade  = parseInt(document.getElementById("movUnidade").value);
        const material = parseInt(document.getElementById("movMaterial").value);
        const tipo     = document.getElementById("movTipo").value;
        const qtd      = parseInt(document.getElementById("movQuantidade").value);
        if (qtd > 0) {
            atualizarEstoque(unidade, material, qtd, tipo);
            bootstrap.Modal.getInstance(document.getElementById('movimentacaoModal')).hide();
            renderEstoque();
        }
    });

    // ===== LOGOUT =====
    document.getElementById("logoutBtn").addEventListener("click", logout);
}

// ===== LOGIN — executado ao carregar a página =====
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fazerLogin(username, password);
});
