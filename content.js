if (window.location.href.includes("youtube.com/watch")) {
    console.log('Content script loaded');
  
    const videoId = new URLSearchParams(window.location.search).get('v');
    console.log('Video ID:', videoId);
  
    let username = localStorage.getItem('username');
    if (!username) {
      username = prompt("Enter your username:");
      if (username) {
        localStorage.setItem('username', username);
        console.log('Username set and saved:', username);
      } else {
        alert('Username is required to use the chat.');
        return;
      }
    } else {
      console.log('Username found:', username);
    }
  
    const chatBox = document.createElement('div');
    chatBox.id = 'live-chat-box';
    chatBox.style.position = 'fixed';
    chatBox.style.right = '20px';
    chatBox.style.bottom = '20px';
    chatBox.style.width = '300px';
    chatBox.style.height = '400px';
    chatBox.style.backgroundColor = 'white';
    chatBox.style.border = '1px solid black';
    chatBox.style.zIndex = '10000';
    chatBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; padding: 10px;">Live Chat</h3>
        <button id="close-chat" style="margin-right: 10px; padding: 5px;">X</button>
      </div>
      <div id="chat-messages" style="height: 80%; overflow-y: scroll; padding: 10px;"></div>
      <input type="text" id="chat-input" autocomplete="off" style="width: 100%; padding: 10px;" placeholder="Enter message">
    `;
    document.body.appendChild(chatBox);
    console.log('Chat box created');
  
    document.getElementById('close-chat').addEventListener('click', function() {
      document.body.removeChild(chatBox);
      console.log('Chat box closed');
    });
  
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const socket = new WebSocket('ws://127.0.0.1:5000/socket.io/?EIO=3&transport=websocket');
  
    socket.onopen = function() {
      console.log('WebSocket connection opened');
      socket.send(JSON.stringify({ type: 'join', room: videoId, username: username }));
    };
  
    socket.onmessage = function(event) {
      console.log('Message received:', event.data);
      const messageData = JSON.parse(event.data);
      const messageElem = document.createElement('div');
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      messageElem.innerHTML = `<strong>${messageData.username} [${time}]:</strong> ${messageData.message}`;
      chatMessages.appendChild(messageElem);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };
  
    chatInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        const message = chatInput.value;
        if (message) {
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          console.log('Sending message:', message);
          socket.send(JSON.stringify({ type: 'message', room: videoId, message: message, username: username, time: time }));
  
          const messageElem = document.createElement('div');
          messageElem.innerHTML = `<strong>${username} [${time}]:</strong> ${message}`;
          chatMessages.appendChild(messageElem);
          chatMessages.scrollTop = chatMessages.scrollHeight;
  
          chatInput.value = '';
        }
      }
    });
  }
  