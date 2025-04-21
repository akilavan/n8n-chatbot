// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
      .n8n-chat-widget {
        --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
        --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
        --chat--color-background: var(--n8n-chat-background-color, #ffffff);
        --chat--color-font: var(--n8n-chat-font-color, #333333);
        --chat--color-light-bg: var(--n8n-chat-light-bg, #f7f7f9);
        font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .n8n-chat-widget .chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: none;
        width: 380px;
        height: 600px;
        background: var(--chat--color-background);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
        border: 1px solid rgba(133, 79, 255, 0.2);
        overflow: hidden;
        font-family: inherit;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        transform: translateY(20px);
      }
      
      .n8n-chat-widget .chat-container.position-left {
        right: auto;
        left: 20px;
      }
      
      .n8n-chat-widget .chat-container.open {
        display: flex;
        flex-direction: column;
        opacity: 1;
        transform: translateY(0);
      }
      
      .n8n-chat-widget .brand-header {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(133, 79, 255, 0.1);
        position: relative;
        background: var(--chat--color-light-bg);
      }
      
      .n8n-chat-widget .close-button {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--chat--color-font);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-size: 20px;
        opacity: 0.6;
        border-radius: 50%;
        width: 28px;
        height: 28px;
      }
      
      .n8n-chat-widget .close-button:hover {
        opacity: 1;
        background: rgba(133, 79, 255, 0.1);
      }
      
      .n8n-chat-widget .brand-header img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        object-fit: contain;
      }
      
      .n8n-chat-widget .brand-header span {
        font-size: 18px;
        font-weight: 500;
        color: var(--chat--color-font);
      }
      
      .n8n-chat-widget .new-conversation {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        text-align: center;
        width: 100%;
        max-width: 300px;
      }
      
      .n8n-chat-widget .welcome-text {
        font-size: 24px;
        font-weight: 600;
        color: var(--chat--color-font);
        margin-bottom: 24px;
        line-height: 1.3;
      }
      
      .n8n-chat-widget .new-chat-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 16px 24px;
        background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        transition: transform 0.3s, box-shadow 0.3s;
        font-weight: 500;
        font-family: inherit;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
      }
      
      .n8n-chat-widget .new-chat-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(133, 79, 255, 0.3);
      }
      
      .n8n-chat-widget .new-chat-btn:active {
        transform: translateY(0);
      }
      
      .n8n-chat-widget .message-icon {
        width: 20px;
        height: 20px;
      }
      
      .n8n-chat-widget .response-text {
        font-size: 14px;
        color: var(--chat--color-font);
        opacity: 0.7;
        margin: 0;
      }
      
      .n8n-chat-widget .chat-interface {
        display: none;
        flex-direction: column;
        height: 100%;
      }
      
      .n8n-chat-widget .chat-interface.active {
        display: flex;
      }
      
      .n8n-chat-widget .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: var(--chat--color-background);
        display: flex;
        flex-direction: column;
      }
      
      .n8n-chat-widget .chat-messages::-webkit-scrollbar {
        width: 6px;
      }
      
      .n8n-chat-widget .chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb {
        background: rgba(133, 79, 255, 0.3);
        border-radius: 3px;
      }
      
      .n8n-chat-widget .chat-message {
        padding: 12px 16px;
        margin: 8px 0;
        border-radius: 16px;
        max-width: 80%;
        word-wrap: break-word;
        font-size: 14px;
        line-height: 1.5;
        animation: fadeIn 0.3s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .n8n-chat-widget .chat-message.user {
        background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
        color: white;
        align-self: flex-end;
        box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
        border: none;
        border-bottom-right-radius: 4px;
      }
      
      .n8n-chat-widget .chat-message.bot {
        background: var(--chat--color-light-bg);
        border: 1px solid rgba(133, 79, 255, 0.1);
        color: var(--chat--color-font);
        align-self: flex-start;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-bottom-left-radius: 4px;
      }
      
      .n8n-chat-widget .chat-message.typing-indicator {
        background: var(--chat--color-light-bg);
        border: 1px solid rgba(133, 79, 255, 0.1);
        color: var(--chat--color-font);
        align-self: flex-start;
        padding: 12px 16px;
        opacity: 0.8;
        width: auto;
        max-width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .n8n-chat-widget .typing-dots {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .n8n-chat-widget .typing-dot {
        width: 8px;
        height: 8px;
        background: var(--chat--color-primary);
        border-radius: 50%;
      }
      
      .n8n-chat-widget .typing-dot:nth-child(1) {
        animation: typingDot 1.4s infinite ease-in-out;
        animation-delay: 0s;
      }
      
      .n8n-chat-widget .typing-dot:nth-child(2) {
        animation: typingDot 1.4s infinite ease-in-out;
        animation-delay: 0.2s;
      }
      
      .n8n-chat-widget .typing-dot:nth-child(3) {
        animation: typingDot 1.4s infinite ease-in-out;
        animation-delay: 0.4s;
      }
      
      @keyframes typingDot {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }
      
      .n8n-chat-widget .chat-input {
        padding: 16px;
        background: var(--chat--color-light-bg);
        border-top: 1px solid rgba(133, 79, 255, 0.1);
        display: flex;
        gap: 8px;
        align-items: center;
      }
      
      .n8n-chat-widget .chat-input textarea {
        flex: 1;
        padding: 14px;
        border: 1px solid rgba(133, 79, 255, 0.2);
        border-radius: 12px;
        background: var(--chat--color-background);
        color: var(--chat--color-font);
        resize: none;
        font-family: inherit;
        font-size: 14px;
        transition: border-color 0.3s, box-shadow 0.3s;
        outline: none;
        height: 24px;
        max-height: 120px;
        overflow-y: auto;
      }
      
      .n8n-chat-widget .chat-input textarea:focus {
        border-color: var(--chat--color-primary);
        box-shadow: 0 0 0 2px rgba(133, 79, 255, 0.2);
      }
      
      .n8n-chat-widget .chat-input textarea::placeholder {
        color: var(--chat--color-font);
        opacity: 0.6;
      }
      
      .n8n-chat-widget .chat-input button {
        background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0 20px;
        height: 52px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        font-family: inherit;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .n8n-chat-widget .chat-input button svg {
        width: 24px;
        height: 24px;
      }
      
      .n8n-chat-widget .chat-input button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
      }
      
      .n8n-chat-widget .chat-input button:active {
        transform: translateY(0);
      }
      
      .n8n-chat-widget .chat-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 64px;
        height: 64px;
        border-radius: 32px;
        background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
        z-index: 999;
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .n8n-chat-widget .chat-toggle.position-left {
        right: auto;
        left: 20px;
      }
      
      .n8n-chat-widget .chat-toggle:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(133, 79, 255, 0.4);
      }
      
      .n8n-chat-widget .chat-toggle:active {
        transform: scale(0.95);
      }
      
      .n8n-chat-widget .chat-toggle svg {
        width: 28px;
        height: 28px;
        fill: currentColor;
        transition: transform 0.3s;
      }
      
      .n8n-chat-widget .chat-toggle.open svg {
        transform: scale(0);
      }
      
      .n8n-chat-widget .chat-toggle .close-icon {
        position: absolute;
        width: 28px;
        height: 28px;
        opacity: 0;
        transform: scale(0);
        transition: transform 0.3s, opacity 0.3s;
      }
      
      .n8n-chat-widget .chat-toggle.open .close-icon {
        opacity: 1;
        transform: scale(1);
      }
      
      .n8n-chat-widget .chat-footer {
        padding: 8px;
        text-align: center;
        background: var(--chat--color-light-bg);
        border-top: 1px solid rgba(133, 79, 255, 0.1);
      }
      
      .n8n-chat-widget .chat-footer a {
        color: var(--chat--color-primary);
        text-decoration: none;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.2s;
        font-family: inherit;
      }
      
      .n8n-chat-widget .chat-footer a:hover {
        opacity: 1;
      }
      
      .n8n-chat-widget .timestamp {
        font-size: 11px;
        color: rgba(0,0,0,0.5);
        text-align: center;
        margin: 8px 0;
        opacity: 0.7;
      }
      
      .n8n-chat-widget .unread-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        background: #ff3b30;
        border-radius: 50%;
        color: white;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0);
        transition: transform 0.3s, opacity 0.3s;
      }
      
      .n8n-chat-widget .unread-badge.show {
        opacity: 1;
        transform: scale(1);
      }
    `;
  
    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);
  
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  
    // Default configuration
    const defaultConfig = {
      webhook: {
        url: '',
        route: ''
      },
      branding: {
        logo: '',
        name: '',
        welcomeText: '',
        responseTimeText: '',
        poweredBy: {
          text: 'Powered by Vallunar',
          link: 'https://vallunar.com'
        }
      },
      style: {
        primaryColor: '',
        secondaryColor: '',
        position: 'right',
        backgroundColor: '#ffffff',
        fontColor: '#333333'
      }
    };
  
    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? {
      webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
      branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
      style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
    } : defaultConfig;
  
    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;
  
    let currentSessionId = '';
    let unreadCount = 0;
    let isWidgetOpen = false;
    let typingIndicatorTimeout = null;
  
    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
  
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
    widgetContainer.style.setProperty('--n8n-chat-light-bg', adjustBrightness(config.style.backgroundColor, 0.98));
  
    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
  
    const newConversationHTML = `
      <div class="brand-header">
        <img src="${config.branding.logo}" alt="${config.branding.name}">
        <span>${config.branding.name}</span>
        <button class="close-button">×</button>
      </div>
      <div class="new-conversation">
        <h2 class="welcome-text">${config.branding.welcomeText}</h2>
        <button class="new-chat-btn">
          <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
          </svg>
          Send us a message
        </button>
        <p class="response-text">${config.branding.responseTimeText}</p>
      </div>
    `;
  
    const chatInterfaceHTML = `
      <div class="chat-interface">
        <div class="brand-header">
          <img src="${config.branding.logo}" alt="${config.branding.name}">
          <span>${config.branding.name}</span>
          <button class="close-button">×</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input">
          <textarea placeholder="Type your message here..." rows="1"></textarea>
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="chat-footer">
          <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
        </div>
      </div>
    `;
  
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
  
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
      </svg>
      <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
      <span class="unread-badge">0</span>
    `;
  
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);
  
    const unreadBadge = toggleButton.querySelector('.unread-badge');
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
  
    // Helper function to adjust color brightness
    function adjustBrightness(color, factor) {
      if (!color || color === '') return '#f7f7f9';
      
      // Convert hex to RGB
      let r, g, b;
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else {
        return '#f7f7f9'; // Default if not hex
      }
      
      // Adjust brightness
      r = Math.min(255, Math.round(r * factor));
      g = Math.min(255, Math.round(g * factor));
      b = Math.min(255, Math.round(b * factor));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  
    // Auto-resize textarea
    function autoResizeTextarea() {
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight > 120 ? 120 : textarea.scrollHeight) + 'px';
    }
  
    textarea.addEventListener('input', autoResizeTextarea);
  
    function generateUUID() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
  
    function getCurrentTimestamp() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  
    function showTimestamp() {
      const timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = getCurrentTimestamp();
      messagesContainer.appendChild(timestamp);
      return timestamp;
    }
  
    function showTypingIndicator() {
      // Remove any existing typing indicators
      removeTypingIndicator();
      
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-message bot typing-indicator';
      typingIndicator.innerHTML = `
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      return typingIndicator;
    }
  
    function removeTypingIndicator() {
      const existingIndicator = messagesContainer.querySelector('.typing-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }
      
      if (typingIndicatorTimeout) {
        clearTimeout(typingIndicatorTimeout);
        typingIndicatorTimeout = null;
      }
    }
  
    function incrementUnreadCount() {
      if (!isWidgetOpen) {
        unreadCount++;
        unreadBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        unreadBadge.classList.add('show');
      }
    }
  
    function resetUnreadCount() {
      unreadCount = 0;
      unreadBadge.textContent = '0';
      unreadBadge.classList.remove('show');
    }
  
    async function startNewConversation() {
      currentSessionId = generateUUID();
      showTimestamp();
      
      const data = [{
        action: "loadPreviousSession",
        sessionId: currentSessionId,
        route: config.webhook.route,
        metadata: { userId: "" }
      }];
      
      try {
        showTypingIndicator();
        
        const response = await fetch(config.webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        removeTypingIndicator();
        
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Focus on textarea
        setTimeout(() => {
          textarea.focus();
        }, 300);
        
      } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        
        // Show error message
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'chat-message bot';
        errorMessageDiv.textContent = "Sorry, we couldn't connect to our servers. Please try again later.";
        messagesContainer.appendChild(errorMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  
    async function sendMessage(message) {
      if (!message.trim()) return;
      
      const messageData = {
        action: "sendMessage",
        sessionId: currentSessionId,
        route: config.webhook.route,
        chatInput: message,
        metadata: { userId: "" }
      };
      
      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'chat-message user';
      userMessageDiv.textContent = message;
      messagesContainer.appendChild(userMessageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Add random delay to typing indicator (more realistic)
      const typingDelay = Math.floor(Math.random() * 500) + 500;
      
      try {
        // Show typing indicator after a short delay
        typingIndicatorTimeout = setTimeout(() => {
          showTypingIndicator();
        }, typingDelay);
        
        const response = await fetch(config.webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot message
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Increment unread count if widget is closed
        incrementUnreadCount();
        
      } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        const errorMessageDiv = document.createElement('div');
      errorMessageDiv.className = 'chat-message bot';
      errorMessageDiv.textContent = "Sorry, we couldn't deliver your message. Please try again later.";
      messagesContainer.appendChild(errorMessageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  newChatBtn.addEventListener('click', startNewConversation);

  sendButton.addEventListener('click', () => {
    const message = textarea.value.trim();
    if (message) {
      sendMessage(message);
      textarea.value = '';
      textarea.style.height = 'auto';
    }
  });

  textarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = textarea.value.trim();
      if (message) {
        sendMessage(message);
        textarea.value = '';
        textarea.style.height = 'auto';
      }
    }
  });

  // Toggle chat window
  toggleButton.addEventListener('click', () => {
    isWidgetOpen = !isWidgetOpen;
    chatContainer.classList.toggle('open');
    toggleButton.classList.toggle('open');
    
    // Reset unread count when opened
    if (isWidgetOpen) {
      resetUnreadCount();
      // Focus on textarea if chat is active
      if (chatInterface.classList.contains('active')) {
        setTimeout(() => {
          textarea.focus();
        }, 300);
      }
    }
  });

  // Add close button handlers
  const closeButtons = chatContainer.querySelectorAll('.close-button');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      chatContainer.classList.remove('open');
      toggleButton.classList.remove('open');
      isWidgetOpen = false;
    });
  });

  // Auto-open based on URL parameter
  function checkUrlForAutoOpen() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('open_chat') || urlParams.has('chat')) {
      setTimeout(() => {
        toggleButton.click();
      }, 1000);
    }
  }

  // Local storage for session persistence
  function saveSession() {
    if (currentSessionId) {
      localStorage.setItem('n8n_chat_session', currentSessionId);
    }
  }

  function loadSession() {
    return localStorage.getItem('n8n_chat_session');
  }

  // Add event listeners to save session
  window.addEventListener('beforeunload', saveSession);
  
  // Set page visibility listener for badge updates
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isWidgetOpen) {
      resetUnreadCount();
    }
  });

  // Check for URL parameter to auto-open
  checkUrlForAutoOpen();
})();
