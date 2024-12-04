 
export const findElementById = (list, id) => {
    return list.find(item => item.id === id);
};

export const getPuntosParametros = (list, id) => {
    const estudio_parametro =  findElementById(list, id);
    return estudio_parametro?.puntos?.valor && estudio_parametro.puntos.valor;
}

export const getTotalPuntosParametros = (list) => {
    return list.reduce((total, item) => {
      const valorNumerico = parseFloat(item.puntos.valor); // Convertir a número
      return total + (isNaN(valorNumerico) ? 0 : valorNumerico); // Validar y sumar
    }, 0);
}

export const getMaximosPuntosParametros = (list) => {
    return list.reduce((total, item) => {
      const valorNumerico = parseFloat(item.puntos_maximo); // Convertir a número
      return total + (isNaN(valorNumerico) ? 0 : valorNumerico); // Validar y sumar
    }, 0);
}

export const getPorcentajeSugerido = (list) => {
    const puntuacion = getTotalPuntosParametros(list);
    const puntuacion_maxima = getMaximosPuntosParametros(list);
    const rango_pordentaje = (puntuacion_maxima !== 0 && (( puntuacion * 100 ) / puntuacion_maxima ) );

    const bloquesDe20 = Math.floor(rango_pordentaje / 20);

    // Calculamos el descuento: cada bloque de 20% equivale a un 5% de descuento
    const descuento = bloquesDe20 * 5;

    // Aseguramos que el descuento máximo sea 25%
    return Math.min(descuento, 25);
}
