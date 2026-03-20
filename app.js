
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const fbAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const Auth = {
DEFAULT_EMAIL: 'cerqueirac63@gmail.com',
    
init() {
        fbAuth.onAuthStateChanged(user => {
            if (user) {
                const sessionData = {
                    id: user.uid,
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    role: user.email === this.DEFAULT_EMAIL ? 'admin' : 'colaborador'
                };
                localStorage.setItem('cc_pilates_session', JSON.stringify(sessionData));
                if (typeof showApp === 'function') showApp();
            } else {
                localStorage.removeItem('cc_pilates_session');
                if (typeof showLogin === 'function') showLogin();
            }
        });
        const session = localStorage.getItem('cc_pilates_session');
        if (session) {
            if (typeof showApp === 'function') showApp();
        } else {
            if (typeof showLogin === 'function') showLogin();
        }
},
    async loginWithGoogle() {

    async login(email, password) {
try {
            await fbAuth.signInWithPopup(googleProvider);
        } catch (e) { alert("Erro Google: " + e.message); }
            const result = await fbAuth.signInWithEmailAndPassword(email, password);
            const user = result.user;
            const sessionData = {
                id: user.uid,
                name: user.email.split('@')[0],
                email: user.email,
                role: user.email === this.DEFAULT_EMAIL ? 'admin' : 'colaborador'
            };
            localStorage.setItem('cc_pilates_session', JSON.stringify(sessionData));
            if (typeof showApp === 'function') showApp();
            return true;
        } catch (e) {
            console.error(e);
            alert("E-mail ou senha incorretos.");
            return false;
        }
},

isLoggedIn() {
return !!localStorage.getItem('cc_pilates_session');
},

getUser() {
const session = localStorage.getItem('cc_pilates_session');
return session ? JSON.parse(session) : null;
},

async resetPassword(email) {
try {
await fbAuth.sendPasswordResetEmail(email);
@@ -88,9 +97,10 @@ const Auth = {
return false;
}
},
    logout() { 
        localStorage.removeItem('cc_pilates_session'); 
        fbAuth.signOut(); 

    logout() {
        localStorage.removeItem('cc_pilates_session');
        fbAuth.signOut();
if (typeof showLogin === 'function') showLogin();
}
};
@@ -3156,23 +3166,16 @@ function initTestData() {
DataModel.addExpense({ description: 'Internet e Luz', amount: 350, date: todayString, type: 'variable' });
}

// BLOCO MESTRE DE CLIQUES - NÃO REMOVER OU ALTERAR
// BLOCO MESTRE DE CLIQUES
document.addEventListener('click', (e) => {
// 1. Botão de Login Tradicional (Entrar)
if (e.target.id === 'login-btn' || e.target.closest('#login-btn')) {
console.log("Tentando login por e-mail...");
const form = document.getElementById('login-form');
        if (form) form.requestSubmit(); // Força o envio do formulário
        if (form) form.requestSubmit();
}

    // 2. Botão Google
    if (e.target.id === 'google-login-btn' || e.target.closest('#google-login-btn')) {
        e.preventDefault();
        console.log("Chamando Google Login...");
        Auth.loginWithGoogle();
    }

    // 3. Esqueci Senha
    // 2. Esqueci Senha
if (e.target.id === 'forgot-password' || e.target.closest('#forgot-password')) {
e.preventDefault();
const email = document.getElementById('login-email').value;
@@ -3183,34 +3186,16 @@ document.addEventListener('click', (e) => {
}
}

    // 4. Botão Novo Profissional (Dentro do App)
    // 3. Botão Novo Profissional
if (e.target.id === 'add-professional-btn' || e.target.closest('#add-professional-btn')) {
if (typeof openProfessionalModal === 'function') openProfessionalModal();
}

    // 5. Botão Editar Profissional
    // 4. Botão Editar Profissional
const editBtn = e.target.closest('.edit-prof-btn');
if (editBtn) {
if (typeof editProfessional === 'function') editProfessional(editBtn.dataset.id);
}
});

// FORÇAR DESTRAVAMENTO DA GESTÃO DE PROFISSIONAIS
document.addEventListener('click', function(e) {
    const addBtn = e.target.closest('#add-professional-btn');
    const editBtn = e.target.closest('.edit-prof-btn');

    if (addBtn) {
        console.log("Admin detectado: Forçando abertura da modal de cadastro...");
        e.preventDefault();
        e.stopImmediatePropagation();
        if (typeof openProfessionalModal === 'function') openProfessionalModal();
    }

    if (editBtn) {
        console.log("Admin detectado: Forçando edição...");
        e.preventDefault();
        e.stopImmediatePropagation();
        if (typeof editProfessional === 'function') editProfessional(editBtn.dataset.id);
    }
}, true);
