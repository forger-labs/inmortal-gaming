export function generateRandomKey() {
  return `key_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
}
