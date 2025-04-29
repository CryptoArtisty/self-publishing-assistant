import { RateLimiter } from './utils/rateLimiter.js';

const autosuggestLimiter = new RateLimiter(5, 1000);  // 5 req/sec
const fetchLimiter      = new RateLimiter(2, 500);   // 2 req/0.5s

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'FETCH_AUTOSUGGEST') {
    autosuggestLimiter.removeToken().then(() => {
      fetch(msg.url)
        .then(r => r.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(err => sendResponse({ success: false, error: err }));
    });
    return true;  // async
  }
  if (msg.type === 'EXPORT_CSV') {
    // Use SheetJS (xlsx) to build and trigger download
  }
});
