// =============================================
// [AÇÃO] ui.js
// Funções de renderização — manipulam o DOM
// para exibir dados nas telas do sistema.
// Depende de: dados/* , utils.js, auth.js
// =============================================

// ===== CHECKLIST =====

function renderChecklistForm() {
    const container = document.getElementById("checklistFormContainer");
    const key = `${currentUnidadeCheck}_dia${currentDia}`;

    if (!checklistsData[key]) {
        checklistsData[key] = {};
        topicosFixos.forEach((topico, tIdx) => {
            topico.tarefas.forEach((_, taskIdx) => {
                checklistsData[key][`${tIdx}_${taskIdx}`] = { concluido: false, obs: "" };
            });
        });
    }

    let html = '';
    topicosFixos.forEach((topico, tIdx) => {
        html += `<div class="topic-card p-3 mb-3"><h5><i class="bi bi-check-circle"></i> ${topico.nome}</h5>`;
        topico.tarefas.forEach((tarefa, taskIdx) => {
            const state = checklistsData[key][`${tIdx}_${taskIdx}`] || { concluido: false, obs: "" };
            const uniqueId = `chk_${tIdx}_${taskIdx}`;
            html += `<div class="mb-2 border-bottom pb-2">
                        <div class="d-flex align-items-center gap-2 flex-wrap">
                            <div class="form-check flex-grow-1">
                                <input class="form-check-input task-check" type="checkbox" data-topico="${tIdx}" data-task="${taskIdx}" id="${uniqueId}" ${state.concluido ? 'checked' : ''}>
                                <label class="form-check-label" for="${uniqueId}">${tarefa}</label>
                            </div>
                            <button class="btn btn-sm btn-outline-secondary btn-plus-obs" data-topico="${tIdx}" data-task="${taskIdx}"><i class="bi bi-plus-circle"></i> Obs</button>
                        </div>
                        <div class="extra-obs-area mt-1" id="obsArea_${tIdx}_${taskIdx}" style="display: ${state.obs ? 'block' : 'none'}">
                            <textarea class="form-control form-control-sm obs-textarea" data-topico="${tIdx}" data-task="${taskIdx}" rows="2" placeholder="Observações...">${escapeHtml(state.obs)}</textarea>
                        </div>
                     </div>`;
        });
        html += `</div>`;
    });

    container.innerHTML = html;
    attachChecklistEvents();
    updateProgressoChecklist();
}

function attachChecklistEvents() {
    document.querySelectorAll('.task-check').forEach(cb => {
        cb.addEventListener('change', () => {
            const tIdx    = parseInt(cb.dataset.topico);
            const taskIdx = parseInt(cb.dataset.task);
            const key     = `${currentUnidadeCheck}_dia${currentDia}`;
            if (!checklistsData[key][`${tIdx}_${taskIdx}`])
                checklistsData[key][`${tIdx}_${taskIdx}`] = { concluido: false, obs: "" };
            checklistsData[key][`${tIdx}_${taskIdx}`].concluido = cb.checked;
            updateProgressoChecklist();
        });
    });

    document.querySelectorAll('.btn-plus-obs').forEach(btn => {
        btn.addEventListener('click', () => {
            const area = document.getElementById(`obsArea_${btn.dataset.topico}_${btn.dataset.task}`);
            if (area) area.style.display = area.style.display === 'none' ? 'block' : 'none';
        });
    });

    document.querySelectorAll('.obs-textarea').forEach(ta => {
        ta.addEventListener('blur', () => {
            const tIdx    = parseInt(ta.dataset.topico);
            const taskIdx = parseInt(ta.dataset.task);
            const key     = `${currentUnidadeCheck}_dia${currentDia}`;
            if (!checklistsData[key][`${tIdx}_${taskIdx}`])
                checklistsData[key][`${tIdx}_${taskIdx}`] = { concluido: false, obs: "" };
            checklistsData[key][`${tIdx}_${taskIdx}`].obs = ta.value;
        });
    });
}

function updateProgressoChecklist() {
    const key = `${currentUnidadeCheck}_dia${currentDia}`;
    let total = 0, concluidas = 0;
    topicosFixos.forEach((t, tIdx) => {
        t.tarefas.forEach((_, taskIdx) => {
            total++;
            if (checklistsData[key] && checklistsData[key][`${tIdx}_${taskIdx}`]?.concluido) concluidas++;
        });
    });
    const percent = total === 0 ? 0 : Math.round((concluidas / total) * 100);
    document.getElementById("progressoPercentualCheck").innerText = percent + "%";
    document.getElementById("progressBarCheck").style.width = percent + "%";
}

function criarBotoesDias() {
    const container = document.getElementById("diasBotoes");
    container.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const btn = document.createElement('button');
        btn.innerText = `Dia ${i}`;
        btn.className = `btn btn-outline-secondary rounded-pill ${currentDia === i ? 'btn-primary-custom text-white' : ''}`;
        btn.onclick = () => {
            currentDia = i;
            document.querySelectorAll('#diasBotoes button').forEach(b => b.classList.remove('btn-primary-custom', 'text-white'));
            btn.classList.add('btn-primary-custom', 'text-white');
            renderChecklistForm();
        };
        container.appendChild(btn);
    }
}

// ===== SOLICITAÇÕES =====

function renderSolicitacoes() {
    const filtroStatus  = document.getElementById("filtroStatusSolicitacao").value;
    const filtroUnidade = document.getElementById("filtroUnidadeSolicitacao").value;
    let filtered = solicitacoes.filter(s =>
        (filtroStatus === 'todas' || s.status === filtroStatus) &&
        (filtroUnidade === 'todas' || s.id_unidade == filtroUnidade)
    );
    const container = document.getElementById("listaSolicitacoes");

    if (filtered.length === 0) {
        container.innerHTML = '<div class="alert alert-secondary">Nenhuma solicitação encontrada</div>';
        return;
    }

    let html = '';
    filtered.forEach(sol => {
        const unidade  = unidades.find(u => u.id == sol.id_unidade)?.nome;
        const material = materiais.find(m => m.id == sol.id_material)?.nome;
        let badge = '';
        if (sol.status === 'PENDENTE') badge = '<span class="badge-status status-pendente">Pendente</span>';
        else if (sol.status === 'APROVADA') badge = '<span class="badge-status status-aprovada">Aprovada</span>';
        else badge = '<span class="badge-status status-entregue">Entregue</span>';

        html += `<div class="solicitacao-item p-3">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${material}</strong> (${unidade})<br>
                            <small>Qtde: ${sol.quantidade} | Justificativa: ${sol.justificativa || '-'}</small>
                        </div>
                        <div>${badge}</div>
                    </div>`;

        if (sol.status === 'PENDENTE' && usuarioLogado.perfil === 'ALMOXARIFE') {
            html += `<div class="mt-2"><button class="btn btn-sm btn-success aprovar-solic" data-id="${sol.id}">Aprovar e Dar Entrada</button></div>`;
        }
        html += `</div>`;
    });

    container.innerHTML = html;

    document.querySelectorAll('.aprovar-solic').forEach(btn => {
        btn.addEventListener('click', () => {
            const id  = parseInt(btn.dataset.id);
            const sol = solicitacoes.find(s => s.id === id);
            if (!sol) return;

            const materialArmazem = armazemCentral.find(m => m.id_material === sol.id_material);
            if (!materialArmazem || materialArmazem.saldo_atual < sol.quantidade) {
                alert(`❌ Estoque insuficiente no Armazém Central!\n\nMaterial: ${materialArmazem?.nome || 'Desconhecido'}\nSaldo disponível: ${materialArmazem?.saldo_atual || 0}\nSolicitado: ${sol.quantidade}`);
                return;
            }

            const sucesso = registrarMovimentacaoArmazem(
                'SAIDA',
                sol.id_material,
                sol.quantidade,
                `SOL-${sol.id}`,
                `Obra ${unidades.find(u => u.id === sol.id_unidade)?.nome}`,
                `Solicitação aprovada: ${sol.justificativa}`
            );

            if (sucesso) {
                sol.status = 'APROVADA';
                atualizarEstoque(sol.id_unidade, sol.id_material, sol.quantidade, 'ENTRADA');
                renderSolicitacoes();
                renderEstoque();
                renderizarArmazem();
                alert(`✅ Solicitação aprovada!\n\nMaterial retirado do Armazém Central.\nSaldo restante: ${materialArmazem.saldo_atual}`);
            }
        });
    });
}

// ===== ESTOQUE POR UNIDADE =====

function renderEstoque() {
    if (usuarioLogado.perfil !== 'ALMOXARIFE') {
        console.warn('Acesso negado: apenas Almoxarife pode ver estoque');
        return;
    }
    const filtroUnidade = document.getElementById("filtroUnidadeEstoque").value;
    const busca         = document.getElementById("buscaEstoque").value.toLowerCase();
    const filtered      = estoque.filter(e => filtroUnidade === 'todas' || e.id_unidade == filtroUnidade);
    const corpo         = document.getElementById("tabelaEstoqueBody");
    corpo.innerHTML     = '';

    filtered.forEach(est => {
        const material = materiais.find(m => m.id === est.id_material);
        if (!material) return;
        if (busca && !material.nome.toLowerCase().includes(busca) && !material.codigo?.toLowerCase().includes(busca)) return;
        const unidadeNome   = unidades.find(u => u.id === est.id_unidade)?.nome;
        const statusEstoque = est.saldo_atual <= est.estoque_minimo
            ? '<span class="badge bg-warning text-dark">⚠️ Estoque baixo</span>'
            : '<span class="badge bg-success">✓ Ok</span>';
        corpo.innerHTML += `<tr>
            <td>${material.codigo}</td>
            <td>${material.nome}</td>
            <td>${material.marca}</td>
            <td>${unidadeNome}</td>
            <td class="fw-bold">${est.saldo_atual}</td>
            <td>${est.estoque_minimo}</td>
            <td>${statusEstoque}</td>
        </tr>`;
    });
}

function getEstoquePorUnidadeMaterial(unidadeId, materialId) {
    return estoque.find(e => e.id_unidade == unidadeId && e.id_material == materialId);
}

function atualizarEstoque(unidadeId, materialId, quantidade, tipo) {
    let item = getEstoquePorUnidadeMaterial(unidadeId, materialId);
    if (!item) {
        const mat = materiais.find(m => m.id == materialId);
        item = { id_estoque: Date.now(), id_material: materialId, id_unidade: unidadeId, saldo_atual: 0, estoque_minimo: mat?.estoque_minimo || 0 };
        estoque.push(item);
    }
    if (tipo === 'ENTRADA') item.saldo_atual += quantidade;
    else if (tipo === 'SAIDA') item.saldo_atual = Math.max(0, item.saldo_atual - quantidade);
    renderEstoque();
}

function preencherSelectMateriais(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    materiais.forEach(mat => {
        select.innerHTML += `<option value="${mat.id}">${mat.nome} (${mat.marca})</option>`;
    });
}

// ===== ARMAZÉM CENTRAL =====

function renderizarArmazem() {
    const tbody = document.getElementById('tabelaArmazemBody');
    if (!tbody) { console.warn('Elemento tabelaArmazemBody não encontrado'); return; }

    // Cards de resumo
    const totalEl   = document.getElementById('totalMateriaisArmazem');
    const baixoEl   = document.getElementById('itensEstoqueBaixo');
    const entradaEl = document.getElementById('ultimaEntrada');
    const saidaEl   = document.getElementById('ultimaSaida');

    if (totalEl) totalEl.innerText = armazemCentral.length;
    if (baixoEl) baixoEl.innerText = armazemCentral.filter(item => item.saldo_atual <= item.estoque_minimo).length;

    const ultimaEntrada = armazemCentral.filter(m => m.ultima_entrada).sort((a, b) => new Date(b.ultima_entrada) - new Date(a.ultima_entrada))[0];
    const ultimaSaida   = armazemCentral.filter(m => m.ultima_saida).sort((a, b) => new Date(b.ultima_saida) - new Date(a.ultima_saida))[0];

    if (entradaEl) entradaEl.innerHTML = ultimaEntrada ? `${ultimaEntrada.nome}<br><small>${formatarData(ultimaEntrada.ultima_entrada)}</small>` : '-';
    if (saidaEl)   saidaEl.innerHTML   = ultimaSaida   ? `${ultimaSaida.nome}<br><small>${formatarData(ultimaSaida.ultima_saida)}</small>`     : '-';

    // Tabela de materiais
    if (armazemCentral.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-5">Nenhum material cadastrado</td></tr>';
        return;
    }

    let html = '';
    armazemCentral.forEach(material => {
        const statusClass = material.saldo_atual <= material.estoque_minimo ? 'danger' : 'success';
        const statusText  = material.saldo_atual <= material.estoque_minimo ? '⚠️ Estoque Baixo' : '✓ Disponível';
        html += `<tr>
            <td><code>${material.codigo}</code></td>
            <td class="fw-semibold">${material.nome}</td>
            <td>${material.marca}</td>
            <td>${material.unidade_medida}</td>
            <td class="fw-bold">${material.saldo_atual.toLocaleString()}</td>
            <td>${material.estoque_minimo.toLocaleString()}</td>
            <td><span class="badge bg-${statusClass}">${statusText}</span></td>
            <td><small>${material.ultima_saida ? 'Saída: ' + formatarData(material.ultima_saida) : (material.ultima_entrada ? 'Entrada: ' + formatarData(material.ultima_entrada) : '-')}</small></td>
        </tr>`;
    });
    tbody.innerHTML = html;

    renderizarMovimentacoesArmazem();
}

function renderizarMovimentacoesArmazem() {
    const tbody = document.getElementById('tabelaMovimentacoesBody');
    const movs  = [...movimentacoesArmazem].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 10);

    if (movs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-3 text-muted">Nenhuma movimentação registrada</td></tr>';
        return;
    }

    let html = '';
    movs.forEach(mov => {
        const material  = armazemCentral.find(m => m.id_material === mov.id_material);
        const tipoIcon  = mov.tipo === 'ENTRADA' ? '📥' : '📤';
        const tipoClass = mov.tipo === 'ENTRADA' ? 'text-success' : 'text-danger';
        html += `<tr>
            <td><small>${formatarData(mov.data)}</small></td>
            <td><span class="${tipoClass}">${tipoIcon} ${mov.tipo}</span></td>
            <td>${material?.nome || 'Material não encontrado'}</td>
            <td class="fw-bold">${mov.quantidade}</td>
            <td><code>${mov.documento || '-'}</code></td>
            <td>${mov.fornecedor || '-'}</td>
            <td><small>${mov.observacao || '-'}</small></td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function registrarMovimentacaoArmazem(tipo, idMaterial, quantidade, documento, fornecedor, observacao) {
    const material = armazemCentral.find(m => m.id_material === idMaterial);
    if (!material) { alert('Material não encontrado!'); return false; }
    if (tipo === 'SAIDA' && material.saldo_atual < quantidade) {
        alert(`Saldo insuficiente! Saldo atual: ${material.saldo_atual} ${material.unidade_medida}`);
        return false;
    }

    const novaMov = {
        id: Date.now(), tipo, id_material: idMaterial, quantidade,
        data: new Date().toISOString().slice(0, 10),
        documento, fornecedor, observacao
    };
    movimentacoesArmazem.push(novaMov);

    if (tipo === 'ENTRADA') { material.saldo_atual += quantidade; material.ultima_entrada = novaMov.data; }
    else                    { material.saldo_atual -= quantidade; material.ultima_saida   = novaMov.data; }

    localStorage.setItem('armazemCentral',       JSON.stringify(armazemCentral));
    localStorage.setItem('movimentacoesArmazem', JSON.stringify(movimentacoesArmazem));
    return true;
}

function carregarDadosArmazemSalvos() {
    const salvos    = localStorage.getItem('armazemCentral');
    const movSalvos = localStorage.getItem('movimentacoesArmazem');
    if (salvos)    armazemCentral       = JSON.parse(salvos);
    if (movSalvos) movimentacoesArmazem = JSON.parse(movSalvos);
}

// ===== RELATÓRIOS =====

function salvarRelatorio(unidadeId, unidadeNome, diaNumero, dataEnvio, checklistData, percentual) {
    const relatorio = {
        id: Date.now(), unidadeId, unidadeNome, diaNumero, dataEnvio,
        dataFormatada: new Date(dataEnvio).toLocaleString('pt-BR'),
        percentualConclusao: percentual,
        itens: checklistData,
        resumo: gerarResumoChecklist(checklistData)
    };
    relatoriosEnviados.unshift(relatorio);
    localStorage.setItem('relatoriosEnviados', JSON.stringify(relatoriosEnviados));
    return relatorio;
}

function gerarResumoChecklist(checklistData) {
    let total = 0, concluidos = 0;
    Object.keys(checklistData).forEach(key => {
        total++;
        if (checklistData[key]?.concluido) concluidos++;
    });
    return `${concluidos} de ${total} tarefas concluídas (${Math.round((concluidos / total) * 100)}%)`;
}

function carregarRelatoriosSalvos() {
    const salvos = localStorage.getItem('relatoriosEnviados');
    if (salvos) relatoriosEnviados = JSON.parse(salvos);
}

function renderizarRelatorios() {
    if (usuarioLogado.perfil !== 'MESTRE_OBRAS') {
        console.warn('Acesso negado: apenas Mestre de Obras pode ver relatórios');
        return;
    }

    const unidadeFiltro = document.getElementById('filtroUnidadeRelatorio').value;
    const diaFiltro     = document.getElementById('filtroDiaRelatorio').value;
    const dataFiltro    = document.getElementById('filtroDataRelatorio').value;

    let filtered = [...relatoriosEnviados];
    if (unidadeFiltro !== 'todas') filtered = filtered.filter(r => r.unidadeId == unidadeFiltro);
    if (diaFiltro !== 'todos')     filtered = filtered.filter(r => r.diaNumero == diaFiltro);
    if (dataFiltro) {
        const dataFiltroStr = new Date(dataFiltro).toLocaleDateString('pt-BR');
        filtered = filtered.filter(r => r.dataFormatada.includes(dataFiltroStr));
    }

    const container = document.getElementById('listaRelatorios');

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1"></i>
            <p class="mt-2">Nenhum relatório encontrado com os filtros selecionados</p>
        </div>`;
        return;
    }

    let html = '';
    filtered.forEach(rel => {
        const badgeColor = rel.percentualConclusao === 100 ? 'success' : rel.percentualConclusao >= 70 ? 'warning' : 'danger';
        html += `<div class="card card-dashboard mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                        <h5 class="fw-bold mb-1">
                            <i class="bi bi-building"></i> ${rel.unidadeNome}
                            <span class="badge bg-secondary ms-2">Dia ${rel.diaNumero}</span>
                        </h5>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-calendar3"></i> Enviado em: ${rel.dataFormatada}
                        </p>
                        <div class="mt-2">
                            <span class="badge bg-${badgeColor}">${rel.percentualConclusao}% concluído</span>
                            <span class="badge bg-info">${rel.resumo}</span>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary ver-detalhes" data-id="${rel.id}">
                            <i class="bi bi-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn btn-sm btn-outline-danger excluir-relatorio" data-id="${rel.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;

    document.querySelectorAll('.ver-detalhes').forEach(btn => {
        btn.addEventListener('click', () => {
            const rel = relatoriosEnviados.find(r => r.id === parseInt(btn.dataset.id));
            if (rel) mostrarModalDetalhes(rel);
        });
    });

    document.querySelectorAll('.excluir-relatorio').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir este relatório?')) {
                relatoriosEnviados = relatoriosEnviados.filter(r => r.id !== parseInt(btn.dataset.id));
                localStorage.setItem('relatoriosEnviados', JSON.stringify(relatoriosEnviados));
                renderizarRelatorios();
            }
        });
    });
}

function mostrarModalDetalhes(relatorio) {
    const modalHtml = `
        <div class="modal fade" id="detalhesRelatorioModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title"><i class="bi bi-file-text"></i> Detalhes do Relatório</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <h6><i class="bi bi-building"></i> Unidade: ${relatorio.unidadeNome}</h6>
                            <h6><i class="bi bi-calendar"></i> Dia: ${relatorio.diaNumero}</h6>
                            <h6><i class="bi bi-clock"></i> Enviado em: ${relatorio.dataFormatada}</h6>
                            <div class="progress mt-2" style="height: 8px;">
                                <div class="progress-bar progress-bar-custom" style="width: ${relatorio.percentualConclusao}%"></div>
                            </div>
                            <p class="mt-2">${relatorio.resumo}</p>
                        </div>
                        <hr>
                        <h6 class="fw-bold">Itens do Checklist:</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead><tr><th>Tópico</th><th>Tarefa</th><th>Status</th><th>Observação</th></tr></thead>
                                <tbody>${gerarTabelaItens(relatorio.itens)}</tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button class="btn btn-primary-custom" id="imprimirRelatorioBtn"><i class="bi bi-printer"></i> Imprimir</button>
                    </div>
                </div>
            </div>
        </div>`;

    const existingModal = document.getElementById('detalhesRelatorioModal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = new bootstrap.Modal(document.getElementById('detalhesRelatorioModal'));
    modal.show();
    document.getElementById('imprimirRelatorioBtn').addEventListener('click', () => window.print());
}

function gerarTabelaItens(itens) {
    const topicosMap = { 0: 'Segurança do Trabalho', 1: 'Materiais', 2: 'Equipamentos', 3: 'Ações do dia' };
    let html = '';
    Object.keys(itens).forEach(key => {
        const [topicoIdx, tarefaIdx] = key.split('_').map(Number);
        const topicoNome = topicosMap[topicoIdx] || 'Tópico';
        const tarefaDesc = topicosFixos[topicoIdx]?.tarefas[tarefaIdx] || 'Tarefa';
        const item       = itens[key];
        html += `<tr>
            <td class="small">${topicoNome}</td>
            <td>${tarefaDesc}</td>
            <td>${item.concluido ? '✅ Concluído' : '❌ Pendente'}</td>
            <td class="small">${item.obs || '-'}</td>
        </tr>`;
    });
    return html;
}

function exportarRelatoriosCSV() {
    if (relatoriosEnviados.length === 0) { alert('Não há relatórios para exportar'); return; }
    let csvContent = "ID,Unidade,Dia,Data Envio,Percentual Conclusão,Resumo\n";
    relatoriosEnviados.forEach(rel => {
        csvContent += `${rel.id},${rel.unidadeNome},${rel.diaNumero},${rel.dataFormatada},${rel.percentualConclusao}%,${rel.resumo}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url  = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorios_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== ALOCAÇÃO DE FUNCIONÁRIOS =====

function renderizarFuncionarios() {
    if (usuarioLogado.perfil !== 'MESTRE_OBRAS') {
        console.warn('Acesso negado: apenas Mestre de Obras pode alocar funcionários');
        return;
    }

    const filtroArea         = document.getElementById('filtroAreaAlocacao').value;
    const busca              = document.getElementById('buscaFuncionario').value.toLowerCase();
    const funcionariosAlocados = alocacoes[currentUnidadeAlocacao] || [];

    let filtered = funcionarios.filter(f => {
        if (filtroArea !== 'todas' && f.area !== filtroArea) return false;
        if (busca && !f.nome.toLowerCase().includes(busca) && !f.funcao.toLowerCase().includes(busca)) return false;
        return true;
    });

    const tbody = document.getElementById('tabelaFuncionariosBody');

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted">
            <i class="bi bi-people fs-1"></i>
            <p class="mt-2">Nenhum funcionário encontrado</p>
        </td></tr>`;
        return;
    }

    let html = '';
    filtered.forEach(func => {
        const isAlocado       = funcionariosAlocados.includes(func.id);
        const statusIcon      = isAlocado ? '🔵 Alocado' : '🟢 Disponível';
        const statusClass     = isAlocado ? 'text-secondary' : 'text-success';
        const checkboxDisabled = isAlocado ? 'disabled' : '';
        const checked         = isAlocado ? 'checked' : '';
        html += `<tr class="${isAlocado ? 'table-secondary' : ''}">
            <td><div class="form-check">
                <input class="form-check-input funcionario-checkbox" type="checkbox"
                       data-id="${func.id}" ${checkboxDisabled} ${checked}>
            </div></td>
            <td><code>${func.codigo}</code></td>
            <td class="fw-semibold">${func.nome}</td>
            <td>${func.funcao}</td>
            <td><span class="badge bg-light text-dark">${func.area}</span></td>
            <td><span class="${statusClass}">${statusIcon}</span></td>
        </tr>`;
    });
    tbody.innerHTML = html;

    document.querySelectorAll('.funcionario-checkbox:not(:disabled)').forEach(cb => {
        cb.addEventListener('change', atualizarContadorSelecionados);
    });

    const selecionarTodos = document.getElementById('selecionarTodos');
    if (selecionarTodos) selecionarTodos.addEventListener('change', selecionarTodosFuncionarios);

    atualizarContadorSelecionados();
}

function atualizarContadorSelecionados() {
    const checkboxes      = document.querySelectorAll('.funcionario-checkbox:not(:disabled)');
    const selecionados    = Array.from(checkboxes).filter(cb => cb.checked);
    const totalSelecionados = selecionados.length;

    const contadorSpan = document.getElementById('contadorSelecionados');
    const btnContador  = document.getElementById('btnContadorSelecionados');
    if (contadorSpan) contadorSpan.innerText = totalSelecionados;
    if (btnContador)  btnContador.innerText  = totalSelecionados;

    const btnConfirmar = document.getElementById('confirmarAlocacaoBtn');
    const alerta       = document.getElementById('alertaSelecao');

    if (btnConfirmar && alerta) {
        if (totalSelecionados < 2 || totalSelecionados > 5) {
            btnConfirmar.disabled = true;
            alerta.className = 'alert alert-danger py-2 mb-0';
            alerta.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Permitido: <strong>2 a 5</strong> funcionários. Você selecionou ${totalSelecionados}.`;
        } else {
            btnConfirmar.disabled = false;
            alerta.className = 'alert alert-warning py-2 mb-0';
            alerta.innerHTML = `<i class="bi bi-info-circle"></i> Permitido: <strong>2 a 5</strong> funcionários. Selecionados: ${totalSelecionados}.`;
        }
    }
}

function selecionarTodosFuncionarios(e) {
    document.querySelectorAll('.funcionario-checkbox:not(:disabled)').forEach(cb => {
        cb.checked = e.target.checked;
    });
    atualizarContadorSelecionados();
}

function confirmarAlocacao() {
    const checkboxes      = document.querySelectorAll('.funcionario-checkbox:not(:disabled)');
    const selecionados    = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.dataset.id));
    const totalSelecionados = selecionados.length;

    if (totalSelecionados < 2 || totalSelecionados > 5) {
        alert(`❌ A seleção deve ter entre 2 e 5 funcionários. Você selecionou ${totalSelecionados}.`);
        return;
    }

    const jaAlocados = alocacoes[currentUnidadeAlocacao] || [];
    alocacoes[currentUnidadeAlocacao] = [...selecionados];

    funcionarios.forEach(f => {
        if (jaAlocados.includes(f.id) && !selecionados.includes(f.id)) f.status = 'disponivel';
        else if (selecionados.includes(f.id) && !jaAlocados.includes(f.id)) f.status = 'alocado';
    });

    localStorage.setItem('alocacoes', JSON.stringify(alocacoes));

    const nomesSelecionados = selecionados.map(id => {
        const func = funcionarios.find(f => f.id === id);
        return `${func.nome} (${func.funcao})`;
    });
    const unidadeNome = unidades.find(u => u.id === currentUnidadeAlocacao)?.nome || '';
    alert(`✅ Alocação confirmada para ${unidadeNome}!\n\nFuncionários alocados (${totalSelecionados}):\n- ${nomesSelecionados.join('\n- ')}`);
    renderizarFuncionarios();
}

function carregarAlocacoesSalvas() {
    const salvos = localStorage.getItem('alocacoes');
    if (salvos) {
        alocacoes = JSON.parse(salvos);
        funcionarios.forEach(f => { f.status = 'disponivel'; });
        Object.keys(alocacoes).forEach(unidadeId => {
            alocacoes[unidadeId].forEach(id => {
                const func = funcionarios.find(f => f.id === id);
                if (func) func.status = 'alocado';
            });
        });
    }
}
