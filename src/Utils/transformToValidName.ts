export function TransformToValidName(inputString: string): string {
    // Elimina todas las tildes
  const step1 = inputString.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Convierte todas las letras en minúsculas
  const step2 = step1.toLowerCase();
  
  // Reemplaza todos los caracteres que no sean letras, números o guiones bajos por un guion bajo
  const step3 = step2.replace(/[^a-z0-9_]/g, '_');
  
  // Si el string resultante comienza con un número, añade un guion bajo al principio
  const step4 = /^[0-9]/.test(step3) ? '_' + step3 : step3;
  
  // Retorna el resultado
  return step4;
  }