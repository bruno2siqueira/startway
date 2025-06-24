// Variáveis globais
let currentSection = 'dashboard';
let progressChart = null;
let categoriesChart = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    checkAuthentication();
    
    // Carregar dados do usuário
    loadUserData();
    
    // Inicializar gráficos
    initializeCharts();
    
    // Configurar eventos
    setupEventListeners();
    
    // Animar estatísticas
    animateStats();
});

// Verificar se o usuário está autenticado
function checkAuthentication() {
    const userData = localStorage.getItem('startway_user') || sessionStorage.getItem('startway_user');
    
    if (!userData) {
        // Redirecionar para página inicial se não estiver logado
        window.location.href = '../index.html';
        return;
    }
    
    return JSON.parse(userData);
}

// Carregar dados do usuário
function loadUserData() {
    const userData = checkAuthentication();
    if (!userData) return;
    
    // Atualizar elementos da interface
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('profileName').textContent = userData.name;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Atualizar avatar se disponível
    if (userData.avatar) {
        document.getElementById('userAvatar').src = userData.avatar;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Listener para redimensionamento da janela
    window.addEventListener('resize', function() {
        if (progressChart) progressChart.resize();
        if (categoriesChart) categoriesChart.resize();
    });
}

// Alternar sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Alternar sidebar mobile
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// Mostrar seção específica
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'meus-dados': 'Meus Dados',
        'problemas': 'Problemas',
        'trilhas': 'Trilhas',
        'mentores': 'Mentores',
        'configuracoes': 'Configurações'
    };
    
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
    
    // Atualizar navegação ativa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Adicionar classe ativa ao link correspondente
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentSection = sectionName;
    
    // Fechar sidebar mobile após seleção
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('show');
    }
}

// Inicializar gráficos
function initializeCharts() {
    initializeProgressChart();
    initializeCategoriesChart();
}

// Gráfico de progresso mensal
function initializeProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                {
                    label: 'Problemas Registrados',
                    data: [2, 4, 3, 5, 4, 6],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Trilhas Concluídas',
                    data: [0, 1, 1, 1, 2, 2],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Mentores Conectados',
                    data: [1, 1, 2, 3, 4, 5],
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

// Gráfico de categorias de problemas
function initializeCategoriesChart() {
    const ctx = document.getElementById('categoriesChart');
    if (!ctx) return;
    
    categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Tecnológico', 'Educacional', 'Saúde', 'Ambiental', 'Social'],
            datasets: [{
                data: [35, 25, 15, 15, 10],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#06b6d4',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Animar estatísticas
function animateStats() {
    const stats = document.querySelectorAll('.stat-value');
    
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        const increment = finalValue / 50;
        let currentValue = 0;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 30);
    });
}

// Função de logout
function logout() {
    // Confirmar logout
    if (confirm('Tem certeza que deseja sair?')) {
        // Limpar dados de autenticação
        localStorage.removeItem('startway_user');
        sessionStorage.removeItem('startway_user');
        
        // Mostrar mensagem de sucesso
        showAlert('Logout realizado com sucesso!', 'success');
        
        // Redirecionar após um breve delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Criar novo alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Simular carregamento de dados
function loadDashboardData() {
    // Simular delay de carregamento
    setTimeout(() => {
        // Atualizar estatísticas com dados "reais"
        updateStats();
        
        // Atualizar gráficos
        if (progressChart) {
            progressChart.update();
        }
        if (categoriesChart) {
            categoriesChart.update();
        }
    }, 500);
}

// Atualizar estatísticas
function updateStats() {
    // Dados simulados baseados no usuário
    const userData = checkAuthentication();
    if (!userData) return;
    
    // Calcular estatísticas baseadas no tempo de registro
    const registrationDate = new Date(userData.registrationDate || userData.loginTime);
    const daysSinceRegistration = Math.floor((new Date() - registrationDate) / (1000 * 60 * 60 * 24));
    
    // Simular crescimento baseado no tempo
    const baseProblemas = Math.min(12, Math.max(1, daysSinceRegistration));
    const baseTrilhas = Math.min(2, Math.floor(daysSinceRegistration / 7));
    const baseMentores = Math.min(5, Math.floor(daysSinceRegistration / 3));
    const baseScore = Math.min(85, 60 + daysSinceRegistration);
    
    // Atualizar elementos
    document.getElementById('problemasCount').textContent = baseProblemas;
    document.getElementById('trilhasCount').textContent = baseTrilhas;
    document.getElementById('mentoresCount').textContent = baseMentores;
    document.getElementById('scoreCount').textContent = baseScore;
}

// Função para exportar dados
function exportData() {
    const userData = checkAuthentication();
    if (!userData) return;
    
    const exportData = {
        usuario: userData,
        problemas: [
            {
                titulo: "Falta de internet em comunidades rurais",
                categoria: "Tecnológico",
                score: 85,
                status: "Aprovado",
                data: "2025-06-20"
            },
            {
                titulo: "Educação digital para idosos",
                categoria: "Educacional",
                score: 72,
                status: "Aprovado",
                data: "2025-06-18"
            }
        ],
        trilhas: [
            {
                nome: "Lean Startup",
                progresso: 50,
                pontos: 280,
                niveisCompletos: 3
            }
        ],
        mentores: [
            {
                nome: "Ana Silva",
                especialidade: "Marketing Digital",
                status: "Ativa"
            },
            {
                nome: "Carlos Santos",
                especialidade: "Desenvolvimento",
                status: "Pendente"
            }
        ],
        dataExportacao: new Date().toISOString()
    };
    
    // Criar e baixar arquivo JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `startway_dados_${userData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showAlert('Dados exportados com sucesso!', 'success');
}

// Carregar dados do dashboard ao inicializar
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

