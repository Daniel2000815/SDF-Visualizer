# BlobTree SDF Visualizer

### Ejecución
- Visitar [GitHub Pages](https://daniel2000815.github.io/SDF-Visualizer/) o bien abrir [index.html](./build/index.html) para ejecutar en local.

## Librería de polinomios en varias variables
Librería que usa la aplicación para trabajar con polinomios en varias variables en $\mathbb{Q}$, calcular bases de Gröbner y resolver el problema de implicitación. El código y la documentación se pueden consultar en [https://github.com/Daniel2000815/multivariate-polynomial](https://github.com/Daniel2000815/multivariate-polynomial).
 
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

#### Playground
Esta zona permite al usuario configurar y ver las diferencias visuales y de rendimiento en tiempo real de los diferentes algoritmos de renderizado e iluminación sobre una escena de ejemplo generada por *raytracing*.
