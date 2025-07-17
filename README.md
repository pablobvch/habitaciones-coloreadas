## Estrategia de Coloreado de Habitaciones en Planos

Este documento describe la estrategia implementada para procesar un archivo de plano de texto (`plano.txt`) y colorear las diferentes habitaciones detectadas, distinguiéndolas de las paredes y las puertas.

-----

### 1\. Propósito

El objetivo principal de este script es leer un archivo plano de texto, identificar las diferentes habitaciones, las paredes y las puertas, y luego imprimirlas en la consola con colores para distinguirlas visualmente.

-----

### 2\. Formato del Plano de Entrada (`plano.txt`)

El archivo `plano.txt` debe ser un mapa rectangular donde:

  * `#`: Representa una **pared**.
  * `     `: Representa un **espacio abierto** (que puede ser parte de una habitación o una puerta).

**Ejemplo de `plano.txt`:**

```
#######
#     #
#     #
##### #
#     #
#     #
#######
```

-----

### 3\. Estrategia de Detección y Coloreado

La estrategia se basa en los siguientes pasos clave:

#### 3.1. Detección de Paredes

Las celdas marcadas con `#` son identificadas directamente como **paredes**. Estas se imprimen en la consola utilizando el carácter `#` con un color gris para distinguirlas visualmente.

#### 3.2. Detección de Puertas

Antes de identificar las habitaciones, es crucial diferenciar las puertas de los espacios "abiertos" dentro de las habitaciones. Una "**puerta**" se define como un espacio (`' '`) que está **rodeado por dos paredes opuestas**, ya sea vertical u horizontalmente.

  * **Lógica de `isDoor(x, y)`:**
      * Verifica si la celda `(x, y)` es un espacio (`' '`).
      * Comprueba si está entre dos paredes verticales (`map[x-1][y] === '#'` y `map[x+1][y] === '#'`).
      * Comprueba si está entre dos paredes horizontales (`map[x][y-1] === '#'` y `map[x][y+1] === '#'`).
      * Si cumple alguna de estas condiciones, se considera una puerta.

Las puertas son marcadas en una matriz auxiliar `visited` (inicializada en `false` para todas las celdas) al inicio del proceso. Esto es fundamental porque **se excluyen de la función de detección de habitaciones** (`floodFill`) para que actúen como "separadores" y permitan que cada habitación sea identificada como una entidad independiente.

#### 3.3. Detección de Habitaciones (Flood Fill)

Una vez que las paredes y las puertas han sido identificadas (y las puertas marcadas como "no visitables" para el algoritmo de relleno), se utiliza un algoritmo de **Flood Fill (o "relleno por inundación")** para identificar y agrupar celdas que pertenecen a la misma habitación.

  * **Proceso:**
    1.  El script itera sobre cada celda del mapa.
    2.  Si una celda es un espacio (`' '`) y aún no ha sido visitada (lo que significa que no es una pared ni una puerta ya marcada), se considera el punto de partida de una **nueva habitación**.
    3.  Se inicia un `floodFill` desde esa celda, asignándole un `roomId` único.
    4.  La función `floodFill` **explora recursivamente** todas las celdas adyacentes que son espacios y que no han sido visitadas. Todas estas celdas se marcan como visitadas y se les asigna el mismo `roomId`.
    5.  Este proceso de expansión continúa hasta que todas las celdas conectadas de la habitación han sido visitadas y asignadas a ese `roomId`.
    6.  El `roomId` se incrementa para que la próxima habitación encontrada tenga un identificador distinto. El proceso se repite para encontrar las siguientes habitaciones no detectadas.

#### 3.4. Coloreado del Plano de Salida

Finalmente, se itera sobre el mapa original para construir la salida coloreada que se imprime en la consola:

  * Las **paredes** (`#`) se imprimen utilizando el carácter `#` en color gris.
  * Las **celdas de habitación** (espacios a los que se les asignó un `roomId` durante el `floodFill`) se colorean con un color de fondo único, determinado por `colors[roomId % colors.length]`. Esto asegura que cada habitación tenga un color distinto.
  * Las **puertas** (espacios que no fueron asignados a un `roomId` por el `floodFill` debido a que fueron marcadas como "visitadas" previamente) se imprimen como un espacio en blanco (`' '`) sin color de fondo, distinguiéndose visualmente de las habitaciones coloreadas y las paredes.

-----

### 4\. Validaciones de la Entrada (plano.txt)

El script incluye validaciones al inicio para asegurar que el archivo plano.txt tenga un formato básico correcto y pueda ser procesado. Si alguna validación falla, el script mostrará un mensaje de error descriptivo y terminará su ejecución.

Las validaciones implementadas son:

* Verificar Existencia y Accesibilidad del Archivo: Se asegura de que plano.txt esté presente en el directorio y que el script tenga los permisos necesarios para leerlo.

* Asegurar que el Plano no esté Vacío: Comprueba que el archivo contenga líneas de mapa y no esté en blanco.

* Validar Caracteres Permitidos: Revisa que el plano contenga únicamente los caracteres válidos (# para paredes y       para espacios). Cualquier otro carácter generará un error.

#### Otras validaciones Adicionales Recomendadas (No implementadas en este script):

Validar Formato Rectangular: Comprobar que todas las líneas del plano tengan exactamente la misma longitud.

Comprobar Bordes Cerrados: Asegurar que los límites exteriores del plano estén completamente formados por paredes (#) para evitar que las habitaciones se "salgan" del mapa.

-----

### 5\. Dependencias

  * `fs/promises`: Para lectura asíncrona del archivo de entrada.
  * `chalk`: Para aplicar colores a la salida de la terminal: [https://www.npmjs.com/package/chalk](https://www.npmjs.com/package/chalk)

-----

### 6\. Cómo Ejecutar

1.  Asegurarse de tener instalado Node.js: [https://nodejs.org/en](https://nodejs.org/en)
2.  Crear un archivo `plano.txt` en el mismo directorio con el formato descripto.
3.  Ejecutar el script de Node.js.

-----

Esta estrategia permite una visualización clara y diferenciada de los componentes del plano, facilitando la comprensión de su estructura.