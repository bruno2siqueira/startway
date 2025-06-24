// Animação dos números das estatísticas
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString();
        }, 20);
    });
}

// Observador para animar estatísticas quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Observar seção de estatísticas
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
});

// Função para lidar com login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validação básica
    if (!email || !password) {
        showAlert('Por favor, preencha todos os campos.', 'warning');
        return;
    }
    
    // Simular autenticação (em produção, seria uma chamada para API)
    showLoading('Entrando...');
    
    setTimeout(() => {
        // Simular login bem-sucedido
        const userData = {
            id: 1,
            name: 'Usuário Demo',
            email: email,
            avatar: 'https://via.placeholder.com/150',
            loginTime: new Date().toISOString()
        };
        
        // Salvar dados do usuário
        if (rememberMe) {
            localStorage.setItem('startway_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('startway_user', JSON.stringify(userData));
        }
        
        hideLoading();
        showAlert('Login realizado com sucesso!', 'success');
        
        // Redirecionar para dashboard após 1 segundo
        setTimeout(() => {
            window.location.href = 'dashboard/index.html';
        }, 1000);
        
    }, 1500);
}

// Função para lidar com registro
function handleRegister() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validações
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAlert('Por favor, preencha todos os campos.', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('As senhas não coincidem.', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showAlert('A senha deve ter pelo menos 6 caracteres.', 'warning');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('Você deve concordar com os Termos de Uso.', 'warning');
        return;
    }
    
    // Simular registro
    showLoading('Criando conta...');
    
    setTimeout(() => {
        const userData = {
            id: Date.now(),
            name: `${firstName} ${lastName}`,
            email: email,
            avatar: 'https://via.placeholder.com/150',
            registrationDate: new Date().toISOString()
        };
        
        // Salvar dados do usuário
        localStorage.setItem('startway_user', JSON.stringify(userData));
        
        hideLoading();
        showAlert('Conta criada com sucesso!', 'success');
        
        // Redirecionar para dashboard após 1 segundo
        setTimeout(() => {
            window.location.href = 'dashboard/index.html';
        }, 1000);
        
    }, 2000);
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

// Função para mostrar loading
function showLoading(message = 'Carregando...') {
    // Remover loading existente
    const existingLoading = document.querySelector('.custom-loading');
    if (existingLoading) {
        existingLoading.remove();
    }
    
    // Criar overlay de loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'custom-loading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    loadingDiv.innerHTML = `
        <div class="text-center text-white">
            <div class="spinner-border mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

// Função para esconder loading
function hideLoading() {
    const loadingDiv = document.querySelector('.custom-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Verificar se usuário já está logado
function checkAuthStatus() {
    const userData = localStorage.getItem('startway_user') || sessionStorage.getItem('startway_user');
    if (userData) {
        // Usuário já está logado, mostrar opção de dashboard
        updateNavbarForLoggedUser(JSON.parse(userData));
    }
}

// Atualizar navbar para usuário logado
function updateNavbarForLoggedUser(userData) {
    const navbarButtons = document.querySelector('.navbar .d-flex');
    if (navbarButtons) {
        navbarButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-1"></i>${userData.name}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="dashboard/index.html">
                        <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Sair
                    </a></li>
                </ul>
            </div>
        `;
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('startway_user');
    sessionStorage.removeItem('startway_user');
    showAlert('Logout realizado com sucesso!', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Verificar status de autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', checkAuthStatus);

