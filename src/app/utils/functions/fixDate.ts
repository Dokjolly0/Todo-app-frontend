export function fixDate(todoDate: Date | string, clock: boolean = false): string {
  const date = new Date(todoDate);
  const day = String(date.getDate()).padStart(2, '0'); // Usa getDate per il tempo locale
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Usa getMonth per il tempo locale
  const year = date.getFullYear(); // Usa getFullYear per il tempo locale
  if (clock) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }
  //console.log(`${day}/${month}/${year} -> ${todoDate}`);
  return `${day}/${month}/${year}`;
}
