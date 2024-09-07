export function isValidEmail(email: string): boolean {
  // Definisce un pattern di espressione regolare per validare l'email.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Verifica se l'email corrisponde al pattern.
  return emailPattern.test(email);
}
