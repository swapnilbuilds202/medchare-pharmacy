// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.textContent = isOpen ? '✕' : '☰';
});

// Chatbot
let msgs = [];
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open', chatOpen);
  win.setAttribute('aria-hidden', !chatOpen);
  document.getElementById('unreadBadge').style.display = 'none';
  if (chatOpen && msgs.length === 0) {
    setTimeout(() => addBot("Namaste! 🙏 I'm your MedCare AI assistant. Ask me about medicine availability, prices, timings, or health advice. How can I help you today?"), 400);
  }
}

function addBot(text) {
  const el = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.textContent = text;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
  msgs.push({ role: 'assistant', content: text });
}

function addUser(text) {
  const el = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg user';
  d.textContent = text;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
  msgs.push({ role: 'user', content: text });
}

function showTyping() {
  const el = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.id = 'typing';
  d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function sendQuick(text) {
  document.getElementById('quickReplies').style.display = 'none';
  send(text);
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  send(text);
}

async function send(text) {
  addUser(text);
  showTyping();

  try {
    // Calls our backend proxy — API key is safe on the server
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs.slice(-10) })
    });

    const data = await res.json();
    hideTyping();
    addBot(data.reply || "Sorry, please call us at +91 98765 43210!");

  } catch (e) {
    hideTyping();
    addBot("Sorry, I'm offline right now. Please WhatsApp us at +91 98765 43210!");
  }
}
