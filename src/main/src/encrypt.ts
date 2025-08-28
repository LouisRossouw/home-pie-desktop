import { safeStorage } from 'electron'

if (!safeStorage.isEncryptionAvailable()) {
  console.warn('safeStorage encryption not available—falling back to plain text')
}

export function encryptValue(value: string) {
  const encrypted = safeStorage.encryptString(value)
  return encrypted
}

export function decryptValue(value: string) {
  const buf = Buffer.from(value, 'base64')
  const decrypted = safeStorage.decryptString(buf)
  return decrypted
}
