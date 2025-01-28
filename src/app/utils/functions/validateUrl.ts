export async function isValidUrl(urlString: string): Promise<boolean> {
  // Verifica se l'URL punta a un'immagine valida
  return new Promise((resolve) => {
    const img = new Image();
    img.src = urlString;

    img.onload = () => resolve(true); // Se l'immagine viene caricata con successo
    img.onerror = () => resolve(false); // Se c'è un errore nel caricamento
  });
}
