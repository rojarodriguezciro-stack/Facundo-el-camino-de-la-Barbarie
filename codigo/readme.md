## Flujo integrado de la aventura

El punto de entrada es `MenúPrincipal.html`, con el nuevo menú visual. **COMENZAR CAMINO** inicia una partida nueva y abre el manual/tutorial antes del prólogo. **RETOMAR CAMINO** vuelve al último capítulo registrado. Los botones de créditos y ajustes abren sus paneles correspondientes.

El archivo `progreso.js` centraliza la navegación, guarda el último capítulo visitado para retomar la partida, permite volver al menú desde las pantallas de juego y sincroniza los ajustes globales de tipografía, tamaño y velocidad del texto. Los recursos del menú están en `Recursos Graficos/`.

Para que la navegación y el almacenamiento funcionen de forma consistente, se recomienda abrir `MenúPrincipal.html` mediante un servidor local (por ejemplo, Live Server en Visual Studio Code) en lugar de abrir los archivos directamente con `file://`.

### Pantalla completa y cambio de escenas

`MenúPrincipal.html` es el punto de entrada recomendado. Mantiene el marco principal del juego abierto y carga el menú y los capítulos dentro de ese marco, de modo que la pantalla completa no se pierde al cambiar de escena o volver al menú. El botón de pantalla completa de los ajustes controla ese mismo marco. `Escape` abandona el modo de pantalla completa; `F11` también solicita la salida cuando el navegador entrega esa tecla a la página. El comportamiento nativo de `F11` puede variar según el navegador.

Se recomienda abrir el punto de entrada mediante un servidor local (por ejemplo, Live Server en Visual Studio Code), ya que algunos navegadores restringen las funciones de pantalla completa cuando se abren archivos directamente desde `file://`.
