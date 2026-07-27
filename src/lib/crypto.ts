/**
 * Linual Crypto Module
 * 
 * Provides real AES-256-GCM encryption using the Web Crypto API,
 * replacing the previous XOR-based obfuscation.
 * Also provides SHA-256 hashing for PIN verification.
 */

// Convert ArrayBuffer to Base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derive an AES-256-GCM key from a password using PBKDF2.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext string with AES-256-GCM.
 * Returns a JSON-serializable object containing salt, iv, and ciphertext (all Base64).
 */
export async function encryptAES(plaintext: string, password: string): Promise<{
  salt: string;
  iv: string;
  ciphertext: string;
}> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    salt: bufferToBase64(salt.buffer),
    iv: bufferToBase64(iv.buffer),
    ciphertext: bufferToBase64(encrypted),
  };
}

/**
 * Decrypt an AES-256-GCM encrypted payload back to plaintext.
 * Throws if the password is incorrect or data is corrupted.
 */
export async function decryptAES(
  encryptedData: { salt: string; iv: string; ciphertext: string },
  password: string
): Promise<string> {
  const salt = new Uint8Array(base64ToBuffer(encryptedData.salt));
  const iv = new Uint8Array(base64ToBuffer(encryptedData.iv));
  const ciphertext = base64ToBuffer(encryptedData.ciphertext);
  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Hash a PIN/password with SHA-256.
 * Returns the hex-encoded hash string.
 */
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a PIN against a stored SHA-256 hash.
 */
export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(pin);
  return hash === storedHash;
}

/**
 * Legacy XOR decryption for backwards compatibility with old backups.
 * This allows importing backups created before the AES migration.
 */
export function legacyXorDecrypt(payload: string, password: string): string {
  const pass = password.trim();
  const decodedXor = decodeURIComponent(escape(atob(payload)));
  let rawJson = "";
  for (let i = 0; i < decodedXor.length; i++) {
    rawJson += String.fromCharCode(decodedXor.charCodeAt(i) ^ pass.charCodeAt(i % pass.length));
  }
  return rawJson;
}
