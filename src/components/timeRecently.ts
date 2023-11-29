export function tiempoTranscurrido(fecha: string) {
  // Convertir la cadena de fecha a un objeto Date
  const fechaPasada = new Date(fecha)

  // Obtener la fecha y hora actual
  const fechaActual = new Date()

  // Calcular la diferencia en milisegundos
  const diferenciaEnMilisegundos = fechaActual.getTime() - fechaPasada.getTime()

  // Calcular la diferencia en minutos
  const diferenciaEnMinutos = Math.floor(diferenciaEnMilisegundos / (1000 * 60))

  // Si la diferencia es menor a 60 minutos, mostrar "hace tantos minutos"
  if (diferenciaEnMinutos < 60) {
    return 'Hace ' + diferenciaEnMinutos + ' minutos'
  } else {
    // Calcular la diferencia en horas
    const diferenciaEnHoras = Math.floor(diferenciaEnMinutos / 60)

    // Si la diferencia es igual a 1 hora, mostrar "hace una hora"
    if (diferenciaEnHoras === 1) {
      return 'Hace una hora'
    } else {
      // Si la diferencia es mayor a 1 hora, mostrar "hace tantas horas"
      return diferenciaEnHoras + ' hours ago'
    }
  }
}

export function fechaFormateada() {
  const fechaActual = new Date()

  // Array de nombres de meses en español
  const meses = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  // Obtener el día, mes y año
  const dia = fechaActual.getDate()
  const mes = fechaActual.getMonth() // Los meses en JavaScript comienzan desde 0
  const año = fechaActual.getFullYear()

  // Formatear la fecha
  const fechaFormateada = dia + ' ' + meses[mes] + ' ' + año

  return fechaFormateada
}
