import { safeStorage } from 'electron'

if (!safeStorage.isEncryptionAvailable()) {
  console.warn('safeStorage encryption not available—falling back to plain text')
}

export function encryptValue(value: string) {
  try {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(value)
      return `enc:${encrypted.toString('base64')}`
    }
  } catch (err) {
    console.error('safeStorage encryption failed:', err)
  }
  return `raw:${Buffer.from(value).toString('base64')}`
}

export function decryptValue(value: string) {
  if (value.startsWith('enc:')) {
    try {
      const buf = Buffer.from(value.substring(4), 'base64')
      return safeStorage.decryptString(buf)
    } catch (err) {
      console.error('safeStorage decryption failed:', err)
    }
  } else if (value.startsWith('raw:')) {
    return Buffer.from(value.substring(4), 'base64').toString()
  }

  // Fallback for legacy data (though table was empty)
  try {
    const buf = Buffer.from(value, 'base64')
    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.decryptString(buf)
    }
  } catch (err) {
    // ignore
  }
  return value
}
