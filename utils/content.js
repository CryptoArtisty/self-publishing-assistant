import { RateLimiter } from './utils/rateLimiter.js';

const pageLimiter = new RateLimiter(1, 1000); // 1 scrape/sec

(async () => {
  await pageLimiter.removeToken();
  // TOS disclaimer in console
  console.warn(
    'Reminder: Only publicly visible data is scraped. '
    + 'Ensure compliance with Amazon Terms of Service.'
  );
  
  // 1. JSON-LD
  const ld = document.querySelector('script[type="application/ld+json"]');
  const bookData = ld ? JSON.parse(ld.textContent) : {};

  // 2. Meta Keywords
  const metaKW = document.querySelector('meta[name="keywords"]');
  const backendKeywords = metaKW 
    ? metaKW.content.split(',').map(s => s.trim()) 
    : [];

  // 3. BSR
  const bsrEl = [...document.querySelectorAll('#detailBulletsWrapper li')]
    .find(li => li.textContent.includes('Best Sellers Rank'));
  const bsr = bsrEl 
    ? bsrEl.querySelector('span.a-text-bold').nextSibling.textContent.trim() 
    : null;

  // 4. Price & Reviews
  const price   = document.querySelector('.a-price .a-offscreen')?.textContent;
  const rating  = document.querySelector('span.a-icon-alt')?.textContent;
  const reviews = document.querySelector('#acrCustomerReviewText')?.textContent;

  chrome.runtime.sendMessage({
    type: 'BOOK_INFO',
    payload: { bookData, backendKeywords, bsr, price, rating, reviews }
  });
})();
