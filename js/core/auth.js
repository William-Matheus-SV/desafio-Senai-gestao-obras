// =============================================
// [AÇÃO] auth.js
// Lógica exclusiva de login e controle de sessão.
// Depende de: USUARIOS (usuarios.js)
// =============================================

let usuarioLogado = null;

function fazerLogin(username, password) {
    const user = USUARIOS[username];
    if (user && user.senha === password) {
        usuarioLogado = { ...user, username: username };
        mostrarSistema();
        return true;
    }
    alert("Usuário ou senha inválidos!");
    return false;
}

function loginDemo(tipo) {
    if (tipo === 'mestre') {
        fazerLogin('mestre', '123');
    } else if (tipo === 'almoxarife') {
        fazerLogin('almoxarife', '123');
    }
}

function mostrarSistema() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('systemScreen').style.display = 'block';

    document.getElementById('userNameDisplay').innerText = usuarioLogado.nome;
    const perfilTexto = usuarioLogado.perfil === 'MESTRE_OBRAS' ? '👷 Mestre de Obras' : '📦 Almoxarife';
    document.getElementById('userRoleDisplay').innerHTML = perfilTexto;

    carregarMenuPorPerfil();
    carregarDadosIniciais();
}

function logout() {
    usuarioLogado = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('systemScreen').style.display = 'none';
}

function carregarMenuPorPerfil() {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = '';

    const itensPorPerfil = {
        MESTRE_OBRAS: [
            { id: 'checklist',  nome: 'Checklist Obra',          icone: 'bi-clipboard-check'    },
            { id: 'solicitacao',nome: 'Solicitar Material',       icone: 'bi-cart-plus'          },
            { id: 'relatorios', nome: 'Relatórios Enviados',      icone: 'bi-file-text'          },
            { id: 'alocacao',   nome: 'Alocação de Funcionários', icone: 'bi-people'             }
        ],
        ALMOXARIFE: [
            { id: 'solicitacao',nome: 'Solicitar Material',       icone: 'bi-cart-plus'          },
            { id: 'armazem',    nome: 'Armazém Central',          icone: 'bi-building-warehouse' },
            { id: 'estoque',    nome: 'Controle Estoque',         icone: 'bi-box-seam'           }
        ]
    };

    const itens = itensPorPerfil[usuarioLogado.perfil] || [];

    itens.forEach((item, index) => {
        const link = document.createElement('a');
        link.className = 'nav-link';
        if (index === 0) link.classList.add('active');
        link.setAttribute('data-tab', item.id);
        link.innerHTML = `<i class="bi ${item.icone}"></i> ${item.nome}`;
        link.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            mudarAba(item.id);
        };
        navMenu.appendChild(link);
    });

    if (itens.length > 0) {
        mudarAba(itens[0].id);
    }
}

function mudarAba(aba) {
    const permissoesPermitidas = {
        MESTRE_OBRAS: ['checklist', 'solicitacao', 'relatorios', 'alocacao'],
        ALMOXARIFE:   ['solicitacao', 'estoque', 'armazem']
    };

    const abasPermitidas = permissoesPermitidas[usuarioLogado.perfil] || [];

    if (!abasPermitidas.includes(aba)) {
        console.warn(`Acesso negado: ${usuarioLogado.perfil} não pode acessar ${aba}`);
        return;
    }

    // Esconder todos os panels
    ['checklistPanel','solicitacaoPanel','estoquePanel',
     'relatoriosPanel','alocacaoPanel','armazemPanel'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    // Mostrar o panel selecionado e inicializar renderização
    if (aba === 'checklist') {
        document.getElementById('checklistPanel').style.display = 'block';
        renderChecklistForm();
        criarBotoesDias();
    } else if (aba === 'solicitacao') {
        document.getElementById('solicitacaoPanel').style.display = 'block';
        renderSolicitacoes();
    } else if (aba === 'estoque') {
        document.getElementById('estoquePanel').style.display = 'block';
        renderEstoque();
    } else if (aba === 'relatorios') {
        document.getElementById('relatoriosPanel').style.display = 'block';
        renderizarRelatorios();
    } else if (aba === 'alocacao') {
        document.getElementById('alocacaoPanel').style.display = 'block';
        if (typeof initNovaGestaoEquipe === 'function'){
            initNovaGestaoEquipe();
        }else {
        renderizarFuncionarios();
        }
    } else if (aba === 'armazem') {
        document.getElementById('armazemPanel').style.display = 'block';
        renderizarArmazem();
    }
}
