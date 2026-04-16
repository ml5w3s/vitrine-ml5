export class AuthService {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.user = null;
        this.clientId = '970476992223-3nvjlih9tpjvjp6l5cfo3er62h35il9g.apps.googleusercontent.com';
        
        // --- CONFIGURAÇÃO DE DESENVOLVIMENTO ---
        // Defina como true para forçar o login simulado (útil quando localhost falha no Google)
        this.useMock = true; 
    }

    init() {
        console.log('AuthService: Inicializando...');
        if (this.useMock) {
            console.warn('AuthService: MODO MOCK ATIVADO. O login será simulado.');
        }

        this.loadUserFromStorage();

        // Tenta carregar o Google mesmo com Mock, para quando quisermos desligar o mock
        if (window.google) {
            this.initializeGoogleAuth();
        } else {
            window.onload = () => {
                if (window.google) {
                    this.initializeGoogleAuth();
                }
            };
        }
    }

    initializeGoogleAuth() {
        try {
            window.google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            console.log('AuthService: Google Auth (SDK) inicializado.');
        } catch (error) {
            console.error('AuthService: Erro ao inicializar SDK do Google:', error);
        }
    }

    // Chamada real do Google
    handleCredentialResponse(response) {
        try {
            console.log('AuthService: Recebida resposta REAL do Google.');
            const responsePayload = this.decodeJwt(response.credential);
            
            this.user = {
                id: responsePayload.sub,
                name: responsePayload.name,
                email: responsePayload.email,
                picture: responsePayload.picture
            };

            this.finalizeLogin();

        } catch (e) {
            console.error('AuthService: Erro ao processar credencial do Google', e);
        }
    }

    // Login Simulado (Mock)
    mockSignIn() {
        console.log('AuthService: Executando Login Simulado (Mock)...');
        
        // Cria um usuário fictício mas com dados estruturados corretamente
        const mockUser = {
            id: 'mock-dev-001',
            name: 'Desenvolvedor ML5',
            given_name: 'Dev',
            family_name: 'ML5',
            email: 'admin@ml5vitrine.com',
            // Usa um serviço de avatar para ficar visualmente bonito
            picture: 'https://ui-avatars.com/api/?name=Dev+ML5&background=0D8ABC&color=fff&size=128'
        };

        // Simula um pequeno delay de rede para realismo
        setTimeout(() => {
            this.user = mockUser;
            this.finalizeLogin();
            alert('MOCK: Login realizado com sucesso (Simulação).');
        }, 600);
    }

    signIn() {
        if (this.useMock) {
            this.mockSignIn();
            return;
        }

        console.log('AuthService: Tentativa de SignIn REAL chamada.');
        if (window.google) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('AuthService: Prompt Google não exibido:', notification);
                }
            });
        } else {
            alert('Erro: Biblioteca Google não carregada.');
        }
    }

    finalizeLogin() {
        this.saveUserToStorage();
        // Publica o evento para quem estiver ouvindo (Header, etc)
        this.eventBus.publish('auth:login', this.user);
        
        console.log("AuthService: Usuário logado:", this.user.name);
    }

    signOut() {
        this.user = null;
        localStorage.removeItem('mlab5_user');
        
        if (window.google && !this.useMock) {
            window.google.accounts.id.disableAutoSelect();
        }
        
        this.eventBus.publish('auth:logout');
        console.log('AuthService: Usuário deslogado.');
    }

    isAuthenticated() {
        return !!this.user;
    }

    getUser() {
        return this.user;
    }

    loadUserFromStorage() {
        const storedUser = localStorage.getItem('mlab5_user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                console.log('AuthService: Sessão restaurada do storage.');
                setTimeout(() => {
                    this.eventBus.publish('auth:login', this.user);
                }, 0);
            } catch (e) {
                console.error('AuthService: Erro ao ler storage', e);
            }
        }
    }

    saveUserToStorage() {
        localStorage.setItem('mlab5_user', JSON.stringify(this.user));
    }

    decodeJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}
