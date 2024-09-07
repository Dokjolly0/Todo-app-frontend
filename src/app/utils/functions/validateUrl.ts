export function isValidUrl(urlString: string): boolean {
  // Definisce un pattern di URL che accetta solo protocolli http e https.
  const urlPattern = /^(https?):\/\/[^\s$.?#].[^\s]*$/i;

  try {
    // Crea un oggetto URL per verificare la validità.
    const url = new URL(urlString);

    // Verifica se il protocollo è http o https e se l'URL corrisponde al pattern.
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      urlPattern.test(urlString)
    );
  } catch {
    // Se l'URL non è valido, cattura l'eccezione e ritorna false.
    return false;
  }
}
