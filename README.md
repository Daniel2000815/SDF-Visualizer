# TFG

## Aplicación

### Ejecución

- Visitar [GitHub Pages](https://daniel2000815.github.io/SDF-Visualizer/).

### Estructura

Se pueden elegir diferentes pestañas desde la barra superior:

#### Graph

Aquí se pueden realizar operaciones sobre las primitivas existentes. A la derecha aparece un canvas con la superficie final. A la izquierda aparece el editor de nodos. Cada nodo tiene un canvas de previsualización. Los puertos de entrada son los de la izquierda y los de salida los de la derecha.

##### Controles

- Creación de nodos:
  - `click derecho`: menú contextual.
- Navegación / Edición:
  - `click izquierdo`:
    - Sobre el fondo: mover vista.
    - Sobre un nodo: seleccionar/mover nodo.
    - Sobre una conexión: eliminar conexión.
    - Sobre shader: rotar vista
  - `doble click` sobre un nodo (no en el shader): marcar como shader final
  - `rueda ratón` sobre el fondo o sobre un shader: hacer zoom.
  - `retroceso`: elimina el nodo seleccionado anteriormente.
  - `s`: colapsar/expandir todos los nodos

#### Surfaces

En esta página se pueden crear nuevas superficies. Por defecto aparecen 3. Para crear una nueva superficie:

- Pulsar el botón superior derecho de la tabla
- Se elige el tipo de ecuación a introducir (implícita, paramétricas o SDF).
- En la tabla inferior se pueden añadir parámetros que luego se podrán controlar en el editor de nodos.
- A la derecha aparece un shader del mismo tipo que en la página _Graph_ a modo de previsualización de la superficie creada.

> _Ejemplo:_ para crear una esfera con diámetro variable, puedes seleccionar la opción "SDF" e introducir `length(p) - r` en el campo de texto de la ecuación. En la tabla tendrás que añadir un nuevo parámetro con símbol `r`, etiqueta la que quieras y un valor por defecto, por ejemplo $1$. Otra opción sería usar la opción "Implicit" e introducir $x^2+y^2+z^2-r$.

### Fallos conocidos / TODO

- _Surfaces_:
  - [ ] Algunos fallos no se imprimen bien.
  - [ ] Modificar el material solo tiene efecto en la previsualización al crear la superficie.
  - [x] Las superficies creadas no se guardan en el almacenamiento local.
  - [x] Error al introducir operador de división al crear superficie paramétrica.
  - [x] Algunos campos de texto tienen errores de focus
  - [x] No se pueden usar parámetros cuando el tipo de ecuación es "Parametric".
  - [x] En el modo "SDF" si hay algún fallo no te avisa, simplemente no se visualiza nada.
  - [x] El botón de editar no funciona.
  - [x] Añadir controles de ayuda .
- _Graph_
  - [ ] El zoom no funciona bien.
  - [ ] Algunas combinaciones de nodos no funcionan bien porque no se sustituye bien la expresion con "p, ".
  - [x] Al borrar conexiones a un nodo booleano, algunas conexiones que no deberian también se borrar.
  - [ ] Save / Load ?
  - [x] Etiquetas de parámetros con espacios no se muestran bien.
  - [x] Faltan algunas operaciones.
  - [x] Operador de escalado no funciona.
  - [x] Eliminar conexiones hace que deje de funcionar.
  - [x] La primera vez que se selecciona un desplegable se cierra solo.
  - [x] Rendimiento.
