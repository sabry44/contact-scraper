// Content script for the contact scraper extension
// This script runs on every page and can be used for additional functionality

console.log('Contact Scraper extension loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeContacts') {
    const contacts = scrapePageContacts();
    sendResponse(contacts);
  }
});

function scrapePageContacts() {
  const emails = new Set();
  const phones = new Set();
  const addresses = new Set();
  
  // Get all text content from the page
  const textContent = document.body.innerText || document.body.textContent || '';
  
  // Email regex patterns
  const emailPatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    /\b[A-Za-z0-9._%+-]+\s*\[at\]\s*[A-Za-z0-9.-]+\s*\[dot\]\s*[A-Z|a-z]{2,}\b/g
  ];
  
  // Phone regex patterns
  const phonePatterns = [
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    /(\+?[1-9]\d{0,3}[-.\s]?)?\(?([0-9]{2,4})\)?[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})/g,
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
  ];
  
  // Extract emails
  emailPatterns.forEach(pattern => {
    const matches = textContent.match(pattern);
    if (matches) {
      matches.forEach(email => {
        const cleanEmail = email.replace(/\s*\[at\]\s*/g, '@').replace(/\s*\[dot\]\s*/g, '.');
        if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
          emails.add(cleanEmail.toLowerCase());
        }
      });
    }
  });
  
  // Extract phone numbers
  phonePatterns.forEach(pattern => {
    const matches = textContent.match(pattern);
    if (matches) {
      matches.forEach(phone => {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        if (cleanPhone.length >= 10) {
          phones.add(phone.trim());
        }
      });
    }
  });
  
  // Look for address patterns
  const addressKeywords = ['address', 'location', 'office', 'headquarters', 'street', 'avenue', 'blvd', 'road', 'suite'];
  const lines = textContent.split('\n');
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (addressKeywords.some(keyword => lowerLine.includes(keyword))) {
      if (line.length > 20 && line.length < 150) {
        const hasNumber = /\d+/.test(line);
        const hasStreetWords = /(street|st|avenue|ave|blvd|boulevard|road|rd|drive|dr|lane|ln|court|ct|suite|ste)/i.test(line);
        if (hasNumber && hasStreetWords) {
          addresses.add(line.trim());
        }
      }
    }
  });
  
  // Check meta tags
  const metaTags = document.querySelectorAll('meta[property*="contact"], meta[name*="contact"], meta[content*="@"]');
  metaTags.forEach(meta => {
    const content = meta.getAttribute('content');
    if (content && content.includes('@')) {
      const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch) {
        emails.add(emailMatch[0].toLowerCase());
      }
    }
  });
  
  // Check for mailto links
  const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailtoLinks.forEach(link => {
    const email = link.href.replace('mailto:', '').split('?')[0];
    if (email.includes('@')) {
      emails.add(email.toLowerCase());
    }
  });
  
  // Check for tel links
  const telLinks = document.querySelectorAll('a[href^="tel:"]');
  telLinks.forEach(link => {
    const phone = link.href.replace('tel:', '');
    if (phone.length >= 10) {
      phones.add(phone);
    }
  });
  
  return {
    emails: Array.from(emails),
    phones: Array.from(phones),
    addresses: Array.from(addresses)
  };
}