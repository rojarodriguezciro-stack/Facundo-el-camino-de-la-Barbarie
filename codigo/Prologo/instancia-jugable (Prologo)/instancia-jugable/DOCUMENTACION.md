# Documentación — Instancia jugable "Facundo: Civilización o Barbarie"

Esta documentación cubre lo que el código **no puede explicar por sí solo**: por qué se
tomó cada decisión, no qué hace cada línea (eso está en los comentarios de `index.html`).

## 1. Qué mecánica de la consigna implementa

La consigna de Sprint 2 propone tres mecánicas de ejemplo (esquivar, responder rápido
antes de que se acabe el tiempo, atrapar objetos). El guion entregado ("instancia
jugable.pdf") es una novela visual con diálogos ramificados, no encaja de forma literal
en ninguna de las tres. Para que el núcleo jugable cumpliera igual con la definición de
la consigna ("el jugador puede actuar y el juego responde a esa acción"), se tomó la
decisión de **implementar la mecánica de "responder antes de que se acabe el tiempo"
sobre las dos decisiones narrativas del guion** (la respuesta al cantinero y la respuesta
al personaje del Acto 3):

- Cada decisión tiene un límite de tiempo (20 s la primera, 18 s la segunda, ver punto 3).
- Si el jugador no elige a tiempo, el sistema igual responde: se resuelve como una opción
  neutral de "vacilación", con su propio texto de reacción. Así ninguna decisión queda sin
  respuesta del sistema, que es el requisito central de la consigna.

Esto no estaba especificado en el guion original (que no menciona tiempos límite); es una
decisión de implementación para alinear el guion con la actividad pedida.

## 2. Por qué el flujo no es 100% fiel al guion

- El guion trae errata "los pollos de la barbarie" en el Final 1; se corrigió a
  "los pliegos de la barbarie" por ser un error de tipeo evidente sobre el sentido
  de la frase (pliego = documento/registro histórico).
- El guion pide mostrar el puntaje final con números de ejemplo fijos ("Civilización 75% |
  Barbarie 25%"). En el juego esos porcentajes **se calculan según las decisiones reales
  del jugador**, no se muestran los números de ejemplo del guion.
- Se agregó una escena corta ("Al caer la noche, las luces de una pulpería asoman en el
  camino...") entre el Acto 1 y la Escena 1, para poder usar el fondo exterior nocturno de
  la pulpería (`pulperia-exterior.jpg`) como transición, en vez de cortar abruptamente del
  camino al interior.

## 3. Sistema de puntaje: valores asignados y por qué

El guion define puntaje explícito solo para la Decisión 1 (+20 civilización / +20
barbarie). Para la Decisión 2 solo indica que la opción "Acepto" *"ramifica según
personaje"* sin dar un número, y que las otras dos opciones son neutrales en las tres
rutas. Los valores que completan ese vacío, y su razonamiento:

| Decisión | Opción | Puntos | Por qué |
|---|---|---|---|
| 1 (cantinero) | Trabajo honrado | +20 civilización | Definido en el guion |
| 1 | Dinero | 0 (neutral) | Definido en el guion |
| 1 | Poder | +20 barbarie | Definido en el guion |
| 2, ruta Rastreador | Acepto | +20 civilización | Simetría con la Decisión 1: unirse a una partida que "trae justicia" es tan civilizatorio como buscar trabajo honrado |
| 2, ruta Comerciante | Acepto | +20 barbarie | El propio comerciante describe el negocio como riesgoso y al margen de la ley (bandidos, jueces corruptos); se lo trató como una elección que se aleja del orden, no como neutral |
| 2, ruta Facundo | Acepto | +20 barbarie | Unirse a una fuerza armada de caudillo |
| 2, cualquier ruta | Voy solo / Déjame pensarlo | 0 (neutral) | Definido en el guion |

Con estos valores el máximo posible de cada eje es 40 puntos (20 + 20), por eso la barra
de la brújula moral (HUD) usa 40 como referencia de "barra llena" de cada lado.

**Alternativa considerada y descartada:** puntuar la ruta del Comerciante como neutral
(ni civilización ni barbarie), ya que "hacer negocios" no es intrínsecamente barbárico.
Se descartó porque, sin puntaje, esa rama nunca podría empujar el resultado hacia ningún
final y quedaría narrativamente "muerta" respecto al sistema de puntaje.

## 4. Umbrales de los tres finales

El guion define con precisión los extremos (70%+ para los finales 1 y 2, 40–60% para el
final gris) pero deja sin definir la zona intermedia (61–69% para cualquiera de los dos
lados). Se resolvió así:

```
civilización% >= 70   → Final 1 "El héroe perdido"
barbarie%     >= 70   → Final 2 "El caudillo implacable"
cualquier otro caso    → Final 3 "El camino gris"
```

Es decir, la zona 61–69% cae en el final gris. Se eligió ese criterio (en vez de crear un
cuarto final no contemplado en el guion) para no introducir contenido narrativo fuera de
lo que el guion define, y porque conceptualmente esa franja sigue sin ser un extremo claro.

Caso borde: si el jugador contesta neutral en ambas decisiones, civilización + barbarie
suman 0 y el porcentaje sería una división por cero. Se definió que ese caso se resuelve
como 50%/50% (Final 3 gris), que es narrativamente coherente ("no te definiste").

## 5. Duración de los tiempos límite

20 segundos para la Decisión 1 (tres opciones, primera vez que el jugador ve el mecanismo)
y 18 segundos para la Decisión 2 (ya conoce la mecánica). No hay una referencia del guion
para este valor; se fijó a partir de la extensión de las opciones de respuesta (todas son
frases cortas, legibles en pocos segundos) dejando margen para leer y decidir sin que el
límite se sienta arbitrario o injusto.

## 6. Mapeo de assets a escenas

| Archivo original (zip) | Nombre final | Uso |
|---|---|---|
| `imagenes/pampa atardecer.png` | `pampa-camino.jpg` | Acto 1 (introducción) y Acto 3 (el camino) |
| `imagenes/pulperia.jfif` | `pulperia-exterior.jpg` | Escena de transición/llegada a la pulpería |
| `imagenes/mostrador.jfif` | `pulperia-mostrador.jpg` | Fondo de diálogo con el Cantinero (sin personajes de fondo, para no duplicar al sprite del Cantinero) |
| `imagenes/pulperia noche.png` | `pulperia-interior.jpg` | Incluida pero sin uso actual; queda disponible para quien quiera variar la escena de la pulpería |
| `imagenes/cantinero.png` | igual | Retrato del Cantinero |
| `imagenes/rastreador.png` | igual | Retrato de Juan (ruta civilización) |
| `imagenes/comerciante.png` | igual | Retrato del Comerciante (ruta neutral) |
| `imagenes/caudillo.png` | igual | Retrato de Facundo (ruta barbarie) |

Los sprites de personajes se redujeron a 700px de ancho y los fondos a 1600px con
compresión JPEG (calidad 82) para que el archivo cargue rápido sin depender de conexión a
un servidor de imágenes externo — todo el juego es autocontenido en la carpeta
`imagenes/`. `image-rendering: pixelated` se aplicó a los retratos para que el arte pixel
art no se vea borroso al escalarlo en el navegador.

## 7. Relación con ISO/IEC 25010

Cómo se atendieron algunas características de calidad del estándar visto en la teoría:

- **Adecuación funcional**: el núcleo cumple la definición de instancia jugable de la
  consigna — el jugador actúa (elige o deja pasar el tiempo) y el sistema siempre
  responde, sin pantallas de inicio, puntaje visible permanente ni resultado final fuera
  del propio cierre de la partida.
- **Usabilidad**: texto tipeado se puede completar al instante haciendo clic (no obliga a
  esperar), hay foco visible en botones para navegación por teclado, y las opciones nunca
  muestran el puntaje que otorgan (para no romper la inmersión con un cálculo visible).
- **Fiabilidad**: ninguna decisión queda sin respuesta del sistema — el límite de tiempo
  agotado se resuelve igual que una elección explícita, evitando estados sin salida.
- **Mantenibilidad**: el guion vive separado del motor. Agregar una cuarta ruta en el
  Acto 3 implica sumar una entrada a `ROUTE_CONFIG`, no tocar la lógica de escenas.
- **Portabilidad / compatibilidad**: un único archivo HTML + una carpeta de imágenes,
  sin dependencias de backend ni build; corre abriendo `index.html` en cualquier
  navegador moderno.
- **Accesibilidad** (dentro de usabilidad): se respeta `prefers-reduced-motion`, hay una
  región `aria-live` para que un lector de pantalla anuncie el texto nuevo, y los
  controles interactivos son elementos `<button>` reales.

## 8. Qué queda fuera a propósito

Por consigna, la instancia jugable no incluye pantalla de inicio de menú, sistema de
puntaje visible como "score" permanente ni pantalla de resultado fuera del cierre de la
propia partida — el HUD de civilización/barbarie es parte de la mecánica en sí (le
muestra al jugador hacia dónde se está inclinando su historia), no un marcador de
puntaje externo a la ficción.
