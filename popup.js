document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
  
    const saveUsernameButton = document.getElementById('save-username');
    const openChatButton = document.getElementById('open-chat');
    const usernameInput = document.getElementById('username');
  
    console.log('saveUsernameButton:', saveUsernameButton);
    console.log('openChatButton:', openChatButton);
    console.log('usernameInput:', usernameInput);
  
    if (saveUsernameButton && openChatButton && usernameInput) {
      saveUsernameButton.addEventListener('click', function() {
        const username = usernameInput.value;
        if (username) {
          localStorage.setItem('username', username);
          console.log('Username saved:', username);
          alert('Username saved!');
  
          openChatButton.disabled = false;
        } else {
          alert('Please enter a username.');
        }
      });
  
      openChatButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          console.log('Injecting content script');
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else {
              console.log('Content script injected successfully');
            }
          });
        });
      });
    } else {
      console.error('One or more elements are missing in the DOM');
    }
  });
  