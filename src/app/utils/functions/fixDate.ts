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

export function dateStringToIsoString(fixedDate: Date | string, forInput: boolean = false): string {
  if (typeof fixedDate === 'string') {
    const hasTime = fixedDate.includes(' - ');
    let datePart: string;
    let timePart: string | undefined;

    // Controlla se esiste la parte di orario
    [datePart, timePart] = fixedDate.split(' - ');

    let year: number, month: number, day: number;

    if (datePart.includes('/')) {
      // Formato europeo (dd/MM/yyyy)
      [day, month, year] = datePart.split('/').map(Number);
    } else if (datePart.includes('-')) {
      // Formato ISO (yyyy-MM-dd)
      [year, month, day] = datePart.split('-').map(Number);
    } else {
      throw new Error('Invalid date format');
    }

    let isoDate: string;
    if (hasTime && timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      // Crea la data con orario in UTC
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      isoDate = date.toISOString();
    } else {
      // Se non c'è orario, imposta 02:00:00 GMT+0200 (fuso orario +2 ore)
      const date = new Date(year, month - 1, day, 2, 0); // Orario impostato a 02:00:00
      const timezoneOffset = date.getTimezoneOffset() * 60000; // Calcola il fuso orario
      isoDate = new Date(date.getTime() - timezoneOffset).toISOString().replace('Z', ' GMT+0200');
    }

    // Se `forInput` è true, restituisci solo la parte della data "yyyy-MM-dd"
    return forInput ? isoDate.split('T')[0] : isoDate;
  } else if (fixedDate instanceof Date) {
    // Se è un oggetto Date, restituisci il formato ISO
    return forInput ? fixedDate.toISOString().split('T')[0] : fixedDate.toISOString();
  } else {
    throw new Error('Invalid date format');
  }
}
