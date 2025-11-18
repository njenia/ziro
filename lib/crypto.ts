/**
 * Client-side encryption utilities using Web Crypto API
 * All encryption/decryption happens in the browser - keys never leave the client
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Generate a random encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Export key to base64 string for URL fragment storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  const keyArray = Array.from(new Uint8Array(exported));
  return btoa(String.fromCharCode(...keyArray));
}

/**
 * Import key from base64 string
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(
    atob(keyString),
    (c) => c.charCodeAt(0)
  );
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random IV (Initialization Vector)
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Encrypt text using AES-GCM
 * Returns encrypted data and IV as base64 strings
 */
export async function encrypt(
  text: string,
  key: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const iv = generateIV();

  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    data
  );

  const encryptedArray = Array.from(new Uint8Array(encrypted));
  const ivArray = Array.from(iv);

  return {
    encrypted: btoa(String.fromCharCode(...encryptedArray)),
    iv: btoa(String.fromCharCode(...ivArray)),
  };
}

/**
 * Decrypt text using AES-GCM
 */
export async function decrypt(
  encrypted: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const encryptedData = Uint8Array.from(
    atob(encrypted),
    (c) => c.charCodeAt(0)
  );
  const ivData = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: ivData,
    },
    key,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

