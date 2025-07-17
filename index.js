import fs from "fs/promises";
import chalk from "chalk";

const colors = [
  chalk.bgRedBright,
  chalk.bgGreenBright,
  chalk.bgYellowBright,
  chalk.bgBlueBright,
  chalk.bgMagentaBright,
  chalk.bgCyanBright,
  chalk.bgWhiteBright,
];

async function main() {
  const filePath = 'plano.txt';

  // Verificar si el archivo existe y es accesible
  try {
    await fs.access(filePath, fs.constants.F_OK); // Chequea si el archivo existe
  } catch (error) {
    console.error(chalk.red(`Error: El archivo '${filePath}' no existe o no se puede acceder.`));
    process.exit(1);
  }

  const input = (await fs.readFile("plano.txt", "utf-8")).trim();
  const lines = input.split("\n");

  //Asegurar que el plano no esté vacío
  if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
    console.error(chalk.red('Error: El plano está vacío. Por favor, asegúrate de que "plano.txt" contenga el mapa.'));
    process.exit(1);
  }

  const rowsCount = lines.length;
  const colsCount = lines[0].length; //al ser un rectangulo todas las filas deberian tener la misma cantidad de columnas

  //Valido que sea tenga caracteres Válidos
  for (let i = 0; i < rowsCount; i++) {
   // Validar que solo contenga '#' o ' '
    if (!/^[# ]+$/.test(lines[i])) {
      console.error(
        chalk.red(
          `Error: La línea ${
            i + 1
          } contiene caracteres inválidos. Solo se permiten '#' y espacios.`
        )
      );
      process.exit(1);
    }
  }

  const map = lines.map((line) => line.split(""));

  const visited = Array.from({ length: rowsCount }, () =>
    Array(colsCount).fill(false)
  );
  const roomMap = Array.from({ length: rowsCount }, () =>
    Array(colsCount).fill(null)
  );

  let currentRoomId = 0;

  const isDoor = (x, y) => {
    if (map[x][y] !== " ") return false;

    // Ver si está entre dos paredes verticales
    if (
      x > 0 &&
      x < rowsCount - 1 &&
      map[x - 1][y] === "#" &&
      map[x + 1][y] === "#"
    ) {
      return true;
    }

    // Ver si está entre dos paredes horizontales
    if (
      y > 0 &&
      y < colsCount - 1 &&
      map[x][y - 1] === "#" &&
      map[x][y + 1] === "#"
    ) {
      return true;
    }

    return false;
  };

  // Marcar puertas como "no visitables"
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < colsCount; j++) {
      if (isDoor(i, j)) {
        visited[i][j] = true;
      }
    }
  }

  //funcion para pintar habitaciones:
  function floodFill(r, c, roomId) {
    if (
      r < 0 ||
      c < 0 ||
      r >= rowsCount ||
      c >= colsCount ||
      visited[r][c] ||
      map[r][c] !== " "
    ) {
      return; // Detener la recursión aquí
    }

    // Marcar la celda actual como visitada y asignarle el ID de la habitación
    visited[r][c] = true;
    roomMap[r][c] = roomId;

    // "Expandir" la pintura a las celdas vecinas (recursivamente)
    floodFill(r + 1, c, roomId); // Abajo
    floodFill(r - 1, c, roomId); // Arriba
    floodFill(r, c + 1, roomId); // Derecha
    floodFill(r, c - 1, roomId); // Izquierda
  }

  // Detectar celda de habitaciones
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < colsCount; j++) {
      if (map[i][j] === " " && !visited[i][j]) {
        //pintar habitaciones
        floodFill(i, j, currentRoomId++);
      }
    }
  }

  // Imprimir plano con colores
  for (let i = 0; i < rowsCount; i++) {
    let row = "";
    for (let j = 0; j < colsCount; j++) {
      const cell = map[i][j];
      if (cell === "#") {
        row += "#";
      } else {
        const roomId = roomMap[i][j];
        if (roomId !== null) {
          // Es parte de una habitación
          const color = colors[roomId % colors.length];
          row += color(" ");
        } else {
          row += " "; // Un color distinto para las puertas
        }
      }
    }
    console.log(row);
  }
}

main().catch((err) => {
  console.error("Error leyendo el plano:", err);
});
