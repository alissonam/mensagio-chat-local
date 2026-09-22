/* =========================================================
   Chat Local - Mensagio Tecnologia
   Arquivo JavaScript (lógica do chat)
   =========================================================

   Este arquivo controla tudo o que acontece no chat:
   - Entrar com o nome
   - Enviar mensagens
   - Mostrar as mensagens na tela
   - Sair do chat

   IMPORTANTE:
   As mensagens ficam apenas na memória do navegador.
   Quando você atualiza a página (F5), elas desaparecem.
   Isso é uma limitação de um chat 100% local (sem servidor).
*/

// ---------- 1. Pegando os elementos da página ----------
// Aqui guardamos referências aos elementos HTML para poder manipulá-los depois.

const loginScreen   = document.getElementById('login-screen');   // Tela de digitar o nome
const chatScreen    = document.getElementById('chat-screen');    // Tela do chat
const usernameInput = document.getElementById('username-input'); // Campo de nome
const enterBtn      = document.getElementById('enter-btn');      // Botão "Entrar"
const displayName   = document.getElementById('display-name');   // Onde mostra o nome do usuário
const logoutBtn     = document.getElementById('logout-btn');     // Botão "Sair"
const messagesDiv   = document.getElementById('messages');       // Área das mensagens
const messageInput  = document.getElementById('message-input');  // Campo de digitação
const sendBtn       = document.getElementById('send-btn');       // Botão "Enviar"


// ---------- 2. Estado da aplicação ----------
// Variáveis que guardam informações enquanto o chat está aberto.

let currentUser = null;  // Nome do usuário logado (começa vazio)
let messages = [];       // Lista de todas as mensagens (array)


// ---------- 3. Funções auxiliares ----------

/**
 * Formata a hora atual no padrão brasileiro (ex: 14:35)
 */
function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Proteção simples contra XSS.
 * Transforma caracteres especiais em texto seguro.
 * Exemplo: <script> vira texto normal em vez de código.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Adiciona uma nova mensagem na lista e atualiza a tela.
 * @param {string} text  - Texto da mensagem
 * @param {boolean} isOwn - true = mensagem sua | false = mensagem de outro
 */
function addMessage(text, isOwn = true) {
  const msg = {
    id: Date.now(),          // ID único baseado no horário
    user: currentUser,       // Quem enviou
    text: text,              // Conteúdo
    time: new Date(),        // Horário
    own: isOwn               // Se é mensagem do usuário atual
  };

  messages.push(msg);        // Adiciona no array
  renderMessages();          // Atualiza a tela
}

/**
 * Desenha todas as mensagens na tela.
 * Essa função é chamada sempre que uma nova mensagem é adicionada.
 */
function renderMessages() {
  // Limpa a área de mensagens
  messagesDiv.innerHTML = '';

  // Percorre todas as mensagens e cria o HTML de cada uma
  messages.forEach(msg => {
    const div = document.createElement('div');

    // Define a classe CSS (own = direita azul | other = esquerda cinza)
    div.className = `message ${msg.own ? 'own' : 'other'}`;

    // Monta o conteúdo da mensagem
    div.innerHTML = `
      <div class="meta">${msg.user} • ${formatTime(msg.time)}</div>
      <div>${escapeHtml(msg.text)}</div>
    `;

    messagesDiv.appendChild(div);
  });

  // Rola automaticamente para a última mensagem
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


// ---------- 4. Eventos (o que acontece quando o usuário interage) ----------

/**
 * Quando o aluno clica em "Entrar no chat"
 */
enterBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim(); // Remove espaços extras

  // Validação simples
  if (name.length < 2) {
    alert('Digite um nome com pelo menos 2 caracteres');
    return;
  }

  // Guarda o nome do usuário
  currentUser = name;
  displayName.textContent = currentUser;

  // Esconde a tela de login e mostra a tela do chat
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');

  // Coloca o foco no campo de mensagem
  messageInput.focus();

  // Mensagem de boas-vindas (simulada como se fosse de "outro")
  setTimeout(() => {
    addMessage(`Bem-vindo(a) ao Chat Local, ${currentUser}! 👋`, false);
  }, 300);
});

/**
 * Permite pressionar Enter no campo de nome para entrar
 */
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    enterBtn.click();
  }
});

/**
 * Função que envia a mensagem
 */
function sendMessage() {
  const text = messageInput.value.trim();

  // Não envia se estiver vazio
  if (!text) return;

  // Adiciona a mensagem como "própria" (azul, direita)
  addMessage(text, true);

  // Limpa o campo e devolve o foco
  messageInput.value = '';
  messageInput.focus();
}

/**
 * Clique no botão Enviar
 */
sendBtn.addEventListener('click', sendMessage);

/**
 * Pressionar Enter no campo de mensagem também envia
 */
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

/**
 * Botão Sair - volta para a tela de login e limpa tudo
 */
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  messages = [];
  messagesDiv.innerHTML = '';
  usernameInput.value = '';

  chatScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  usernameInput.focus();
});


// ---------- 5. Inicialização ----------
// Quando a página carrega, o foco já fica no campo de nome.
usernameInput.focus();
