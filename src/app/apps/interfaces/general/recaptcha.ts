
// {
//   "event": {
//     "token": "TOKEN",
//     "expectedAction": "USER_ACTION",
//     "siteKey": "6Lf9cjsrAAAAAO_tCXpDf9E-Zir0i8C9oARtQeE5",
//   }
// }

// https://cloud.google.com/recaptcha/docs/actions-website?hl=es_419

// signup	Regístrate en el sitio web.
// login	Accede al sitio web.
// password_reset	Solicita el restablecimiento de la contraseña.
// get_price	Recupera el precio de un artículo.
// cart_add	Agrega artículos al carrito.
// cart_view	Consulta el contenido del carrito.
// payment_add	Agrega o actualiza la información de pago (p.ej., los detalles de la tarjeta o la dirección).
// checkout	Consulta el sitio web.
// transaction_confirmed	Confirmación de que se procesó una transacción.
// play_song	Reproducir una canción de una lista.

export class Recaptcha {
  token?: string;
  expectedAction?: string | null;
  siteKey?: string | null;

  constructor(token?: string, expectedAction?: string, siteKey?: string) {
    this.token = token || '';
    this.expectedAction = expectedAction || '';
    this.siteKey = siteKey || '';
  }
}
