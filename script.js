/* =======================================================================================
    PHOS 2026 - SPRINT FINAL (SCRIPT.JS)
    Motor JavaScript - Busca Nativa (Com Debug de Erros)
    ====================================================================================== */

const PhosApp = {
    state: {
        biblioteca: JSON.parse(localStorage.getItem('phos_biblioteca')) || [],
        meta: parseInt(localStorage.getItem('phos_meta')) || 12,
        filtroAtivo: 'todos',
        resultadosBusca: [],
        livroEmFoco: null,
        notaAtual: 0,
        graficoAtivo: null
    },

    init() {
        if (document.getElementById('formulario-login')) {
            this.setupLogin();
        } else if (document.body.classList.contains('corpo-dashboard')) {
            this.verificarSessao();
            this.setupDashboard();
        }
    },

    verificarSessao() {
        if (!localStorage.getItem('phos_sessao')) window.location.href = "index.html";
    },

    setupLogin() {
        const form = document.getElementById('formulario-login');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                localStorage.setItem('phos_sessao', 'token_valido');
                window.location.href = "dashboard.html";
            });
        }
    },

    setupDashboard() {
        this.renderizarEstante();
        this.atualizarMetricas();
        this.bindEventos();
    },

    bindEventos() {
        const btnBuscar = document.getElementById('botao-buscar');
        const inputBusca = document.getElementById('entrada-busca');

        if (btnBuscar && inputBusca) {
            btnBuscar.addEventListener('click', async () => {
                const termo = inputBusca.value.trim();
                if (termo !== "") await this.buscarNaAPI(termo);
            });

            inputBusca.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); 
                    const termo = inputBusca.value.trim();
                    if (termo !== "") await this.buscarNaAPI(termo);
                }
            });
        }

        document.querySelectorAll('#rating-input button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                this.setarEstrelas(e.target.dataset.v);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-sobreposicao').forEach(m => m.style.display = 'none');
            }
        });
    },

/* =======================================================================================
    INTEGRAÇÃO API (Com Tratamento Defensivo)
    ====================================================================================== */

    async buscarNaAPI(termo) {
        const modal = document.getElementById('modal-busca');
        const container = document.getElementById('container-resultados-modal');
        
        modal.style.display = "flex";
        document.getElementById('entrada-busca').value = ''; 
        
        container.innerHTML = `
            <div style="width:100%; text-align:center; grid-column:1/-1; padding:40px;">
                <p style="color:var(--nitidez);">Iluminando estantes em busca de "${termo}"...</p>
            </div>
        `;

        try {
            const endpoint = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termo)}&maxResults=12&langRestrict=pt`;
            
            const resposta = await fetch(endpoint);
            
            // 1. Verifica se o Google barrou a gente (Erro 403, 429, etc)
            if (!resposta.ok) {
                throw new Error(`O servidor recusou a conexão (Erro ${resposta.status}). Tente aguardar 1 minuto.`);
            }
            
            const dados = await resposta.json();

            // 2. Proteção extrema contra livros que vêm "quebrados" da API
            this.state.resultadosBusca = dados.items ? dados.items.map(item => {
                const info = item.volumeInfo || {}; 
                const imagens = info.imageLinks || {};
                
                let urlCapa = "https://via.placeholder.com/150x220/fdfaf1/161144.png?text=Sem+Capa";
                if (imagens.thumbnail) {
                    urlCapa = imagens.thumbnail.replace("http:", "https:");
                }

                return {
                    id: item.id || Math.random().toString(),
                    titulo: info.title || "Obra sem título",
                    capa: urlCapa,
                    categoria: info.categories ? info.categories[0] : "Geral"
                };
            }) : [];

            this.renderizarResultadosBusca();

        } catch (erro) {
            console.error("ERRO DETALHADO DA API:", erro);
            
            // 3. Imprime o erro real na interface para sabermos o que fazer
            let mensagemAmigavel = erro.message;
            if (erro.message.includes("Failed to fetch")) {
                mensagemAmigavel = "Conexão bloqueada. Verifique se você está usando AdBlocker ou se a internet oscilou.";
            }

            container.innerHTML = `
                <div style="width:100%; text-align:center; grid-column:1/-1; padding:40px;">
                    <p style="color:#ff6b6b; font-weight: 800; font-size: 1.2rem;">Oops! A busca falhou.</p>
                    <p style="color:var(--retina); margin-top: 10px; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 8px;">
                        <strong>Motivo:</strong> ${mensagemAmigavel}
                    </p>
                </div>
            `;
        }
    },

    renderizarResultadosBusca() {
        const container = document.getElementById('container-resultados-modal');
        if (this.state.resultadosBusca.length === 0) {
            container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhuma obra encontrada. Tente outro termo.</p>";
            return;
        }

        container.innerHTML = this.state.resultadosBusca.map(l => `
            <article style="background: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: var(--sombra);">
                <img src="${l.capa}" alt="Capa" style="width: 100px; height: 150px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">
                <h3 style="font-size: 0.85rem; margin-bottom: 15px; color: var(--retina); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${l.titulo}">${l.titulo}</h3>
                <button type="button" onclick="PhosApp.adicionarLivro('${l.id}')" class="btn-ghost btn-pequeno" style="width: 100%;">Adicionar</button>
            </article>
        `).join('');
    },

    /* =======================================================================================
    CRUD E ESTANTE
    ====================================================================================== */

    adicionarLivro(id) {
        const livro = this.state.resultadosBusca.find(l => l.id === id);
        if (livro && !this.state.biblioteca.some(b => b.id === id)) {
            this.state.biblioteca.push({ ...livro, status: 'na-lista', nota: 0, resenha: '' });
            this.sincronizarDados();
            this.fecharModal('modal-busca');
        } else {
            alert("Esta obra já está na sua estante!");
        }
    },

    sincronizarDados() {
        localStorage.setItem('phos_biblioteca', JSON.stringify(this.state.biblioteca));
        this.renderizarEstante();
        this.atualizarMetricas();
    },

    filtrar(status) {
        this.state.filtroAtivo = status;
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('ativo', btn.dataset.filter === status);
        });
        this.renderizarEstante();
    },

    renderizarEstante() {
        const container = document.getElementById('container-resultados');
        const livrosFiltrados = this.state.biblioteca.filter(l => 
            this.state.filtroAtivo === 'todos' || l.status === this.state.filtroAtivo
        );

        document.getElementById('contador').innerText = `${livrosFiltrados.length} obras catalogadas`;

        if (livrosFiltrados.length === 0) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--nitidez); padding: 40px;">Nenhum livro por aqui ainda.</p>`;
            return;
        }

        const coresStatus = {
            'lido': { bg: '#28a745', text: '#ffffff' },
            'lendo': { bg: '#90abce', text: '#ffffff' },
            'na-lista': { bg: '#eabf42', text: '#161144' }
        };

        container.innerHTML = livrosFiltrados.map(l => {
            const cor = coresStatus[l.status] || { bg: '#ccc', text: '#000' };
            return `
            <article class="cartao-livro" onclick="PhosApp.abrirCritica('${l.id}')">
                <div class="badge-status" style="background-color: ${cor.bg}; color: ${cor.text}; border: none;">
                    ${l.status.replace('-', ' ')}
                </div>
                <img src="${l.capa}" alt="Capa" loading="lazy">
                <div class="info-livro">
                    <span class="tag-categoria">${l.categoria}</span>
                    <h3>${l.titulo}</h3>
                    <div style="color: var(--enfoque); font-size: 1.2rem; letter-spacing: 2px;">
                        ${'★'.repeat(l.nota || 0)}${'☆'.repeat(5 - (l.nota || 0))}
                    </div>
                </div>
            </article>
            `;
        }).join('');
    },

/* =======================================================================================
    DIÁRIO DE CRÍTICA E ESTRELAS
    ====================================================================================== */

    abrirCritica(id) {
        const livro = this.state.biblioteca.find(l => l.id === id);
        this.state.livroEmFoco = id;
        
        document.getElementById('modal-critica').style.display = 'flex';
        document.getElementById('critica-titulo').innerText = livro.titulo;
        document.getElementById('critica-img').src = livro.capa;
        document.getElementById('critica-texto').value = livro.resenha || "";
        
        const selectStatus = document.getElementById('critica-status');
        if(selectStatus) selectStatus.value = livro.status;
        
        this.setarEstrelas(livro.nota || 0);
    },

    setarEstrelas(valor) {
        let notaClicada = parseInt(valor);
        if(this.state.notaAtual === notaClicada) {
            this.state.notaAtual = 0;
        } else {
            this.state.notaAtual = notaClicada;
        }

        document.querySelectorAll('#rating-input button').forEach(btn => {
            const isActive = parseInt(btn.dataset.v) <= this.state.notaAtual;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-checked', isActive);
        });
    },

    salvarCritica() {
        const texto = document.getElementById('critica-texto').value;
        const statusEscolhido = document.getElementById('critica-status').value;
        
        this.state.biblioteca = this.state.biblioteca.map(l => {
            if (l.id === this.state.livroEmFoco) {
                return { 
                    ...l, 
                    resenha: texto, 
                    nota: this.state.notaAtual, 
                    status: statusEscolhido
                };
            }
            return l;
        });
        
        this.sincronizarDados();
        this.fecharModal('modal-critica');
    },


/* =======================================================================================
    DASHBOARD & META DE 2026
    ====================================================================================== */

    mudarMeta() {
        const novaMeta = prompt("Atualize sua meta literária para este ano:", this.state.meta);
        if (novaMeta && !isNaN(novaMeta) && parseInt(novaMeta) > 0) {
            this.state.meta = parseInt(novaMeta);
            localStorage.setItem('phos_meta', this.state.meta);
            
            const elementoMeta = document.getElementById('total-meta');
            if(elementoMeta) elementoMeta.innerText = this.state.meta;
            
            this.atualizarMetricas();
        }
    },

    atualizarMetricas() {
        const lidos = this.state.biblioteca.filter(l => l.status === 'lido').length;
        const porcentagem = Math.min(Math.round((lidos / this.state.meta) * 100), 100);
        
        document.getElementById('lidos-atual').innerText = lidos;
        document.getElementById('porcentagem-meta').innerText = porcentagem + "%";

        const circulo = document.getElementById('progresso-circulo');
        if (circulo) {
            const offset = 389.55 - (porcentagem / 100) * 389.55;
            circulo.style.strokeDasharray = "389.55";
            circulo.style.strokeDashoffset = offset;
        }

        this.desenharGrafico();
    },

    desenharGrafico() {
        const ctx = document.getElementById('graficoGeneros');
        if (!ctx) return;
        
        const contagem = {};
        this.state.biblioteca.forEach(l => {
            contagem[l.categoria] = (contagem[l.categoria] || 0) + 1;
        });

        if (this.state.graficoAtivo) this.state.graficoAtivo.destroy();
        
        this.state.graficoAtivo = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(contagem),
                datasets: [{
                    data: Object.values(contagem),
                    backgroundColor: ['#eabf42', '#90abce', '#161144', '#28a745', '#ff6b6b'],
                    borderWidth: 2,
                    borderColor: '#fdfaf1'
                }]
            },
            options: { plugins: { legend: { position: 'bottom' } }, cutout: '75%' }
        });
    },

    fecharModal(id) { document.getElementById(id).style.display = 'none'; },
    logout() { localStorage.removeItem('phos_sessao'); window.location.href = "index.html"; }
};

window.PhosApp = PhosApp;
PhosApp.init();