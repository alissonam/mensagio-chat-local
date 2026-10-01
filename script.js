/* =====================================================
   Chat Local - Mensagio Tecnologia
   Lógica do chat (JavaScript)
   =====================================================

   O que este arquivo faz:
   1. Pega o nome do usuário
   2. Mostra a tela do chat
   3. Envia e exibe mensagens
   4. Permite sair

   IMPORTANTE:
   As mensagens ficam só na memória do navegador.
   Se atualizar a página (F5), elas somem.
   Isso acontece porque não existe servidor.
*/

// ----- 1. Elementos da página -----
const telaLogin = document.getElementById('tela-login');
const telaChat = document.getElementById('tela-chat');
const inputNome = document.getElementById('input-nome');
const btnEntrar = document.getElementById('btn-entrar');
const nomeUsuario = document.getElementById('nome-usuario');
const btnSair = document.getElementById('btn-sair');
const listaMensagens = document.getElementById('lista-mensagens');
const inputMensagem = document.getElementById('input-mensagem');
const btnEnviar = document.getElementById('btn-enviar');

// Novos elementos adicionados
const btnEmoji = document.getElementById('btn-emoji');
const painelEmojis = document.getElementById('painel-emojis');

// ----- 2. Dados do chat -----
let usuarioAtual = null;
let mensagens = [];

// ----- 3. Funções auxiliares -----

// Formata a hora (ex: 14:35)
function formatarHora(data) {
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Evita que alguém digite código HTML perigoso
function protegerTexto(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Adiciona uma mensagem na lista e atualiza a tela
function adicionarMensagem(texto, ehMinha) {
  const msg = {
    id: Date.now(),
    usuario: usuarioAtual,
    texto: texto,
    hora: new Date(),
    minha: ehMinha,
    curtidas: 0,
    curtido: false
  };

  mensagens.push(msg);
  mostrarMensagens();
}

// Alterna a curtida em uma mensagem específica
function alternarCurtida(id) {
  const msg = mensagens.find(m => m.id === id);
  if (msg) {
    msg.curtido = !msg.curtido;
    msg.curtidas += msg.curtido ? 1 : -1;
    mostrarMensagens();
  }
}

// Desenha todas as mensagens na tela
function mostrarMensagens() {
  listaMensagens.innerHTML = '';

  mensagens.forEach(function (msg) {
    const div = document.createElement('div');

    // Define se a mensagem é "minha" ou "outra"
    div.className = 'mensagem ' + (msg.minha ? 'minha' : 'outra');

    const iconeCurtida = msg.curtido ? '❤️' : '🤍';
    const textoCurtida = msg.curtidas > 0 ? ` ${iconeCurtida} ${msg.curtidas}` : ` ${iconeCurtida}`;

    div.innerHTML =
      '<div class="info">' + msg.usuario + ' • ' + formatarHora(msg.hora) + '</div>' +
      '<div>' + protegerTexto(msg.texto) + '</div>' + msg.id +
      '<button class="btn-curtir" onclick="alternarCurtida(' + msg.id + ')">' + textoCurtida + '</button>';

    listaMensagens.appendChild(div);
  });

  // Rola para a última mensagem
  listaMensagens.scrollTop = listaMensagens.scrollHeight;
}

// ----- 4. Eventos (o que acontece quando o usuário clica ou aperta Enter) -----

// Clicou em "Entrar no chat"
btnEntrar.addEventListener('click', function () {
  const nome = inputNome.value.trim();

  if (nome.length < 2) {
    alert('Digite um nome com pelo menos 2 caracteres');
    return;
  }

  usuarioAtual = nome;
  nomeUsuario.textContent = usuarioAtual;

  // Esconde login e mostra o chat
  telaLogin.classList.add('escondido');
  telaChat.classList.remove('escondido');

  inputMensagem.focus();

  // Mensagem de boas-vindas (aparece como se fosse de outro)
  setTimeout(function () {
    adicionarMensagem('Bem-vindo(a) ao Chat Local, ' + usuarioAtual + '!', false);
  }, 300);
});

// Apertou Enter no campo de nome
inputNome.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    btnEntrar.click();
  }
});

// Função que envia a mensagem
function enviarMensagem() {
  const texto = inputMensagem.value.trim();

  if (!texto) return;   // não envia se estiver vazio

  adicionarMensagem(texto, true);   // true = mensagem minha

  inputMensagem.value = '';
  painelEmojis.classList.add('escondido');
  inputMensagem.focus();
}

// Clicou em "Enviar"
btnEnviar.addEventListener('click', enviarMensagem);

// Apertou Enter no campo de mensagem
inputMensagem.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    enviarMensagem();
  }
});

// Mostrar/Ocultar painel de emojis
btnEmoji.addEventListener('click', function () {
  painelEmojis.classList.toggle('escondido');
});

// Inserir emoji no campo ao clicar
painelEmojis.addEventListener('click', function (e) {
  if (e.target.tagName === 'SPAN') {
    inputMensagem.value += e.target.textContent;
    inputMensagem.focus();
  }
});

// Clicou em "Sair"
btnSair.addEventListener('click', function () {
  usuarioAtual = null;
  mensagens = [];
  listaMensagens.innerHTML = '';
  inputNome.value = '';
  painelEmojis.classList.add('escondido');

  telaChat.classList.add('escondido');
  telaLogin.classList.remove('escondido');
  inputNome.focus();
});

// ----- 5. Ao carregar a página -----
inputNome.focus();   // já deixa o cursor no campo de nome
