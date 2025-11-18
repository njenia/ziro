/**
 * Bot detection logic to prevent crawlers from triggering burn-on-read
 */

const BOT_PATTERNS = [
  // Common search engine bots
  /googlebot/i,
  /bingbot/i,
  /slurp/i, // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  /exabot/i,
  /facebot/i,
  /ia_archiver/i,
  
  // Social media crawlers
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  
  // Other common bots (be more specific to avoid false positives)
  /\bbot\b/i, // Word boundary - matches "bot" as a word, not part of another word
  /\bcrawler\b/i,
  /\bspider\b/i,
  /\bscraper\b/i,
  /^curl\//i, // Starts with "curl/"
  /^wget/i,
  /python-requests/i,
  /go-http-client/i,
  /^java\/[0-9]/i, // Java version string
  /node-fetch/i,
  /^axios\//i,
  /^postman/i,
  /^insomnia/i,
  /^httpie/i,
  /okhttp/i,
  /^apache-httpclient/i,
  /^nginx\/[0-9]/i, // Nginx version
  /uptime/i,
  /pingdom/i,
  /newrelic/i,
  /datadog/i,
  /sentry/i,
];

/**
 * Check if a User-Agent string indicates a bot/crawler
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) {
    // No user agent is suspicious - could be a bot
    return true;
  }

  // Check against known bot patterns
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

/**
 * Get User-Agent from request headers
 */
export function getUserAgent(headers: Headers): string | null {
  return headers.get('user-agent');
}

