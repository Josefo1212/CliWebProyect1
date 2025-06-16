/* Evento para crear la matriz A y preparar la interfaz para la entrada de datos.
 Al presionar el botón "Crear Matriz", se genera la tabla de inputs para la matriz A y se oculta la matriz B hasta que la A esté completa.*/
document.getElementById('crearMatriz').addEventListener('click', () => {
    try {
        const n = parseInt(document.getElementById('size').value, 10);
        if (isNaN(n) || n < 2 || n > 10) {
            alert('Por favor, ingrese un tamaño válido entre 2 y 10.');
            return;
        }
        nGlobal = n;
        generarInputsMatriz('matrizA', n);
        generarInputsMatriz('matrizB', n);
        document.getElementById('matrizA').style.display = '';
        document.getElementById('matrizB').style.display = '';
        limpiarResultado();
    } catch (error) {
        alert('Error al crear la matriz: ' + error.message);
    }
});

/* Función para generar los inputs de una matriz cuadrada de tamaño n.
 Cada celda es un input de solo lectura, editable solo mediante el teclado numérico personalizado.*/
function generarInputsMatriz(idMatriz, n) {
    try {
        const tabla = document.querySelector(`#${idMatriz} table`);
        tabla.innerHTML = '';
        for (let i = 0; i < n; i++) {
            const fila = document.createElement('tr');
            for (let j = 0; j < n; j++) {
                const celda = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'matriz-input';
                input.id = `${idMatriz}_${i}_${j}`;
                input.readOnly = false;
                celda.appendChild(input);
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
    } catch (error) {
        alert('Error al generar la matriz: ' + error.message);
    }
}

// funcion para generar ejemplo
document.getElementById('cargarEjemplo').addEventListener('click', () => {
    try {
        let n = parseInt(document.getElementById('size').value, 10);
        if (isNaN(n) || n < 2 || n > 10) n = 3;
        nGlobal = n;
        generarInputsMatriz('matrizA', n);
        generarInputsMatriz('matrizB', n);
        document.getElementById('matrizA').style.display = '';
        document.getElementById('matrizB').style.display = '';
        const ejemploA = [];
        const ejemploB = [];
        for (let i = 0; i < n; i++) {
            ejemploA[i] = [];
            ejemploB[i] = [];
            for (let j = 0; j < n; j++) {
                ejemploA[i][j] = i * n + j + 1;
                ejemploB[i][j] = n * n - (i * n + j);
            }
        }
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                document.getElementById(`matrizA_${i}_${j}`).value = ejemploA[i][j];
                document.getElementById(`matrizB_${i}_${j}`).value = ejemploB[i][j];
            }
        }
        limpiarResultado();
    } catch (error) {
        alert('Error al cargar el ejemplo: ' + error.message);
    }
});

// funcion para obtener la matriz del input
function obtenerMatriz(id, n) {
    const matriz = [];
    for (let i = 0; i < n; i++) {
        const fila = [];
        for (let j = 0; j < n; j++) {
            const val = parseFloat(document.getElementById(`${id}_${i}_${j}`).value);
            if (isNaN(val)) return null;
            fila.push(val);
        }
        matriz.push(fila);
    }
    return matriz;
}

// funcion para validar matrices y sus dimensiones
function matricesCompletas(ids, n) {
    for (let id of ids) {
        for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++) {
                const el = document.getElementById(`${id}_${i}_${j}`);
                if (!el || !/^[-+]?\d*\.?\d+$/.test(el.value)) return false;
            }
    }
    return true;
}

// nGlobal: tamaño actual de las matrices.
let nGlobal = 0;

// Permite llenar la matriz A o B con valores aleatorios entre -10 y 10.
// Detecta automáticamente si se debe llenar la matriz A o B según el flujo actual.
document.getElementById('matrizAleatoria').addEventListener('click', () => {
    try {
        const n = parseInt(document.getElementById('size').value, 10);
        if (isNaN(n) || n < 2 || n > 10) {
            alert('Por favor, ingrese un tamaño válido entre 2 y 10.');
            return;
        }
        nGlobal = n;
        generarInputsMatriz('matrizA', n);
        generarInputsMatriz('matrizB', n);
        rellenarMatrizAleatoria('matrizA', n);
        rellenarMatrizAleatoria('matrizB', n);
        document.getElementById('matrizA').style.display = '';
        document.getElementById('matrizB').style.display = '';
        limpiarResultado();
    } catch (error) {
        alert('Error al crear matriz aleatoria: ' + error.message);
    }
});

// Rellena una matriz específica con valores aleatorios en el rango [-10, 10].
function rellenarMatrizAleatoria(idMatriz, n) {
    try {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.getElementById(`${idMatriz}_${i}_${j}`);
                if (input) {
                    input.value = Math.floor(Math.random() * 21) - 10;
                }
            }
        }
    } catch (error) {
        alert('Error al rellenar matriz aleatoria: ' + error.message);
    }
}

// Limpia ambas matrices y reinicia la interfaz para un nuevo ingreso.
// También elimina botones y el teclado numérico.
document.getElementById('limpiarMatriz').addEventListener('click', () => {
    try {
        limpiarMatriz('matrizA');
        limpiarMatriz('matrizB');
        document.getElementById('matrizA').style.display = '';
        document.getElementById('matrizB').style.display = '';
        limpiarResultado();
    } catch (error) {
        alert('Error al limpiar las matrices: ' + error.message);
    }
});

// Limpia todos los inputs de una matriz específica.
function limpiarMatriz(idMatriz) {
    try {
        const inputs = document.querySelectorAll(`#${idMatriz} input`);
        inputs.forEach(input => input.value = '');
    } catch (error) {
        alert('Error al limpiar la matriz: ' + error.message);
    }
}

// Unificar todos los resultados en un solo cuadro
function mostrarResultado(titulo, contenidoHTML) {
    const div = document.getElementById('resultadoUnico');
    div.innerHTML = `
        <h2>Resultado: ${titulo}</h2>
        <div>${contenidoHTML}</div>
    `;
}

// Función para limpiar el cuadro de resultado
function limpiarResultado() {
    const div = document.getElementById('resultadoUnico');
    if (div) div.innerHTML = '<h2>Resultado</h2>';
}

// Suma de matrices (A + B)
function sumarMatrices() {
    try {
        const n = nGlobal;
        if (!matricesCompletas(['matrizA', 'matrizB'], n)) {
            mostrarResultado('Suma', '<div class="error">Debe ingresar ambas matrices completas y del mismo tamaño.</div>');
            return;
        }
        const matrizA = obtenerMatriz('matrizA', n);
        const matrizB = obtenerMatriz('matrizB', n);
        if (!matrizA || !matrizB) {
            mostrarResultado('Suma', '<div class="error">Todas las celdas deben estar completas y ser números.</div>');
            return;
        }
        if (matrizA.length !== matrizB.length || matrizA[0].length !== matrizB[0].length) {
            mostrarResultado('Suma', '<div class="error">Las matrices deben tener las mismas dimensiones.</div>');
            return;
        }
        const resultado = matrizA.map((fila, i) => fila.map((v, j) => v + matrizB[i][j]));
        mostrarResultado('Suma', tablaHTML(resultado));
    } catch (error) {
        mostrarResultado('Suma', `<div class="error">Error al sumar matrices: ${error.message}</div>`);
    }
}

// Resta de matrices (A - B y B - A)
function restarMatrices() {
    try {
        const n = nGlobal;
        if (!matricesCompletas(['matrizA', 'matrizB'], n)) {
            mostrarResultado('Resta', '<div class="error">Debe ingresar ambas matrices completas y del mismo tamaño.</div>');
            return;
        }
        const matrizA = obtenerMatriz('matrizA', n);
        const matrizB = obtenerMatriz('matrizB', n);
        if (!matrizA || !matrizB) {
            mostrarResultado('Resta', '<div class="error">Todas las celdas deben estar completas y ser números.</div>');
            return;
        }
        if (matrizA.length !== matrizB.length || matrizA[0].length !== matrizB[0].length) {
            mostrarResultado('Resta', '<div class="error">Las matrices deben tener las mismas dimensiones.</div>');
            return;
        }
        const resultadoAB = matrizA.map((fila, i) => fila.map((v, j) => v - matrizB[i][j]));
        const resultadoBA = matrizB.map((fila, i) => fila.map((v, j) => v - matrizA[i][j]));
        mostrarResultado('Resta', `
            <div><b>A - B</b>${tablaHTML(resultadoAB)}</div>
            <div style="margin-top:10px;"><b>B - A</b>${tablaHTML(resultadoBA)}</div>
        `);
    } catch (error) {
        mostrarResultado('Resta', `<div class="error">Error al restar matrices: ${error.message}</div>`);
    }
}

// Multiplicación de matrices (A × B)
function multiplicarMatrices() {
    try {
        const n = nGlobal;
        if (!matricesCompletas(['matrizA', 'matrizB'], n)) {
            mostrarResultado('Multiplicación', '<div class="error">Debe ingresar ambas matrices completas.</div>');
            return;
        }
        const matrizA = obtenerMatriz('matrizA', n);
        const matrizB = obtenerMatriz('matrizB', n);
        if (!matrizA || !matrizB) {
            mostrarResultado('Multiplicación', '<div class="error">Todas las celdas deben estar completas y ser números.</div>');
            return;
        }
        if (matrizA[0].length !== matrizB.length) {
            mostrarResultado('Multiplicación', '<div class="error">El número de columnas de A debe ser igual al número de filas de B.</div>');
            return;
        }
        const resultado = Array.from({ length: n }, (_, i) =>
            Array.from({ length: n }, (_, j) =>
                matrizA[i].reduce((sum, _, k) => sum + matrizA[i][k] * matrizB[k][j], 0)
            )
        );
        mostrarResultado('Multiplicación', tablaHTML(resultado));
    } catch (error) {
        mostrarResultado('Multiplicación', `<div class="error">Error al multiplicar matrices: ${error.message}</div>`);
    }
}

// Multiplicación por escalar
function mostrarEscalarUI() {
    if (document.getElementById('escalarForm')) return;
    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'escalarForm';
    form.style.marginLeft = '10px';
    const select = document.createElement('select');
    select.id = 'escalarMatrizSelect';
    const optionA = document.createElement('option');
    optionA.value = 'A';
    optionA.textContent = 'Matriz A';
    const optionB = document.createElement('option');
    optionB.value = 'B';
    optionB.textContent = 'Matriz B';
    select.appendChild(optionA);
    select.appendChild(optionB);
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'escalarInput';
    input.placeholder = 'Escalar k';
    input.step = 'any';
    input.style.width = '80px';
    input.style.marginLeft = '5px';
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        multiplicarPorEscalar();
        form.remove();
    };
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.type = 'button';
    btnCancel.style.marginLeft = '5px';
    btnCancel.onclick = () => form.remove();
    form.appendChild(select);
    form.appendChild(input);
    form.appendChild(btn);
    form.appendChild(btnCancel);
    acciones.appendChild(form);
}
function multiplicarPorEscalar() {
    try {
        const k = parseFloat(document.getElementById('escalarInput').value);
        const matriz = document.getElementById('escalarMatrizSelect').value;
        const n = nGlobal;
        if (isNaN(k) || !matricesCompletas([`matriz${matriz}`], n)) {
            mostrarResultado('Multiplicación por escalar', '<div class="error">Ingrese un escalar y matriz válidos.</div>');
            return;
        }
        const matrizData = obtenerMatriz(`matriz${matriz}`, n);
        if (!matrizData) {
            mostrarResultado('Multiplicación por escalar', `<div class="error">Todas las celdas de la matriz ${matriz} deben estar completas y ser números.</div>`);
            return;
        }
        const resultado = matrizData.map(fila => fila.map(v => k * v));
        mostrarResultado('Multiplicación por escalar', tablaHTML(resultado));
    } catch (error) {
        mostrarResultado('Multiplicación por escalar', `<div class="error">Error al multiplicar por escalar: ${error.message}</div>`);
    }
}

// Transponer
function mostrarTransponerUI() {
    if (document.getElementById('transponerForm')) return;
    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'transponerForm';
    form.style.marginLeft = '10px';
    const select = document.createElement('select');
    select.id = 'transponerMatrizSelect';
    const optionA = document.createElement('option');
    optionA.value = 'A';
    optionA.textContent = 'Matriz A';
    const optionB = document.createElement('option');
    optionB.value = 'B';
    optionB.textContent = 'Matriz B';
    select.appendChild(optionA);
    select.appendChild(optionB);
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        transponerMatriz();
        form.remove();
    };
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.type = 'button';
    btnCancel.style.marginLeft = '5px';
    btnCancel.onclick = () => form.remove();
    form.appendChild(select);
    form.appendChild(btn);
    form.appendChild(btnCancel);
    acciones.appendChild(form);
}
function transponerMatriz() {
    try {
        const matriz = document.getElementById('transponerMatrizSelect').value;
        const n = nGlobal;
        if (!matricesCompletas([`matriz${matriz}`], n)) {
            mostrarResultado('Transpuesta', `<div class="error">Debe ingresar la matriz ${matriz}.</div>`);
            return;
        }
        const matrizData = obtenerMatriz(`matriz${matriz}`, n);
        if (!matrizData) {
            mostrarResultado('Transpuesta', `<div class="error">Todas las celdas de la matriz ${matriz} deben estar completas y ser números.</div>`);
            return;
        }
        const transpuesta = matrizData[0].map((_, j) => matrizData.map(fila => fila[j]));
        mostrarResultado('Transpuesta', `
            <div style="display:flex;gap:40px;align-items:flex-start;">
                <div>
                    <div style="font-weight:bold;text-align:center;">${matriz === 'A' ? 'Matriz A' : 'Matriz B'}</div>
                    ${tablaHTML(matrizData)}
                </div>
                <div>
                    <div style="font-weight:bold;text-align:center;">Transpuesta (${matriz}<sup>T</sup>)</div>
                    ${tablaHTML(transpuesta)}
                </div>
            </div>
        `);
    } catch (error) {
        mostrarResultado('Transpuesta', `<div class="error">Error al transponer la matriz: ${error.message}</div>`);
    }
}

// Determinante
function mostrarDeterminanteUI() {
    if (document.getElementById('determinanteForm')) return;
    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'determinanteForm';
    form.style.marginLeft = '10px';
    const select = document.createElement('select');
    select.id = 'determinanteMatrizSelect';
    const optionA = document.createElement('option');
    optionA.value = 'A';
    optionA.textContent = 'Matriz A';
    const optionB = document.createElement('option');
    optionB.value = 'B';
    optionB.textContent = 'Matriz B';
    select.appendChild(optionA);
    select.appendChild(optionB);
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        calcularDeterminante();
        form.remove();
    };
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.type = 'button';
    btnCancel.style.marginLeft = '5px';
    btnCancel.onclick = () => form.remove();
    form.appendChild(select);
    form.appendChild(btn);
    form.appendChild(btnCancel);
    acciones.appendChild(form);
}
function calcularDeterminante() {
    try {
        const matriz = document.getElementById('determinanteMatrizSelect').value;
        const n = nGlobal;
        if (!matricesCompletas([`matriz${matriz}`], n)) {
            mostrarResultado('Determinante', `<div class="error">Debe ingresar la matriz ${matriz}.</div>`);
            return;
        }
        const matrizData = obtenerMatriz(`matriz${matriz}`, n);
        if (!matrizData) {
            mostrarResultado('Determinante', `<div class="error">Todas las celdas de la matriz ${matriz} deben estar completas y ser números.</div>`);
            return;
        }
        const det = determinanteGauss(matrizData);
        mostrarResultado('Determinante', `<div>Determinante(${matriz}): <b>${det}</b></div>`);
    } catch (error) {
        mostrarResultado('Determinante', `<div class="error">Error al calcular el determinante: ${error.message}</div>`);
    }
}

// Inversa
function mostrarInversaUI() {
    if (document.getElementById('inversaForm')) return;
    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'inversaForm';
    form.style.marginLeft = '10px';
    const select = document.createElement('select');
    select.id = 'inversaMatrizSelect';
    const optionA = document.createElement('option');
    optionA.value = 'A';
    optionA.textContent = 'Matriz A';
    const optionB = document.createElement('option');
    optionB.value = 'B';
    optionB.textContent = 'Matriz B';
    select.appendChild(optionA);
    select.appendChild(optionB);
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        calcularInversa();
        form.remove();
    };
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.type = 'button';
    btnCancel.style.marginLeft = '5px';
    btnCancel.onclick = () => form.remove();
    form.appendChild(select);
    form.appendChild(btn);
    form.appendChild(btnCancel);
    acciones.appendChild(form);
}
function calcularInversa() {
    try {
        const matriz = document.getElementById('inversaMatrizSelect').value;
        const n = nGlobal;
        if (!matricesCompletas([`matriz${matriz}`], n)) {
            mostrarResultado('Inversa', `<div class="error">Debe ingresar la matriz ${matriz}.</div>`);
            return;
        }
        const matrizData = obtenerMatriz(`matriz${matriz}`, n);
        if (!matrizData) {
            mostrarResultado('Inversa', `<div class="error">Todas las celdas de la matriz ${matriz} deben estar completas y ser números.</div>`);
            return;
        }
        const det = determinanteGauss(matrizData);
        if (Math.abs(det) < 1e-10) {
            mostrarResultado('Inversa', `<div class="error">La matriz no es invertible (determinante = 0).</div>`);
            return;
        }
        const inversa = inversaGaussJordan(matrizData);
        if (!inversa) {
            mostrarResultado('Inversa', `<div class="error">La matriz no es invertible (singular o mal condicionada).</div>`);
            return;
        }
        const producto = multiplicarMatricesGenerico(matrizData, inversa);
        mostrarResultado('Inversa', `
            <div style="display:flex;gap:40px;align-items:flex-start;">
                <div>
                    <div style="font-weight:bold;text-align:center;">${matriz === 'A' ? 'Matriz A' : 'Matriz B'}</div>
                    ${tablaHTML(matrizData)}
                </div>
                <div>
                    <div style="font-weight:bold;text-align:center;">Inversa (${matriz}<sup>-1</sup>)</div>
                    ${tablaHTML(inversa)}
                </div>
                <div>
                    <div style="font-weight:bold;text-align:center;">Verificación: ${matriz} × ${matriz}<sup>-1</sup> = I</div>
                    ${tablaHTML(producto)}
                </div>
            </div>
        `);
    } catch (error) {
        mostrarResultado('Inversa', `<div class="error">Error al calcular la inversa: ${error.message}</div>`);
    }
}

// Identidad
function mostrarIdentidadUI() {
    if (document.getElementById('identidadForm')) return;
    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'identidadForm';
    form.style.marginLeft = '10px';
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'identidadSizeInput';
    input.placeholder = 'Tamaño n';
    input.min = 2;
    input.max = 10;
    input.style.width = '60px';
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        generarIdentidad();
        form.remove();
    };
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.type = 'button';
    btnCancel.style.marginLeft = '5px';
    btnCancel.onclick = () => form.remove();
    form.appendChild(input);
    form.appendChild(btn);
    form.appendChild(btnCancel);
    acciones.appendChild(form);
}
function generarIdentidad() {
    try {
        const input = document.getElementById('identidadSizeInput');
        if (!input) return;
        const n = parseInt(input.value, 10);
        if (isNaN(n) || n < 2 || n > 10) {
            mostrarResultado('Identidad', '<div class="error">Ingrese un tamaño válido entre 2 y 10.</div>');
            return;
        }
        const identidad = [];
        for (let i = 0; i < n; i++) {
            identidad[i] = [];
            for (let j = 0; j < n; j++) {
                identidad[i][j] = (i === j ? 1 : 0);
            }
        }
        mostrarResultado('Identidad', tablaHTML(identidad));
    } catch (error) {
        mostrarResultado('Identidad', `<div class="error">Error al generar la matriz identidad: ${error.message}</div>`);
    }
}

// Utilidad para mostrar una matriz como tabla HTML
function tablaHTML(matriz) {
    let html = '<table style="margin:0 auto;"><tbody>';
    matriz.forEach(fila => {
        html += '<tr>';
        fila.forEach(valor => {
            html += `<td>${valor}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
}

// Eliminación gaussiana para determinante
function determinanteGauss(matriz) {
    const n = matriz.length;
    // Copia profunda para no modificar la original
    const A = matriz.map(row => row.slice());
    let det = 1;
    let swapCount = 0;
    for (let i = 0; i < n; i++) {
        // Buscar el pivote máximo en la columna i
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }
        if (Math.abs(A[maxRow][i]) < 1e-12) return 0; // Matriz singular
        // Intercambiar filas si es necesario
        if (i !== maxRow) {
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            swapCount++;
        }
        det *= A[i][i];
        // Eliminar debajo del pivote
        for (let k = i + 1; k < n; k++) {
            const factor = A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
        }
    }
    // Ajustar signo por intercambios de filas
    if (swapCount % 2 !== 0) det = -det;
    // Redondear a 4 decimales
    return Math.round(det * 10000) / 10000;
}

// Gauss-Jordan para matriz inversa
function inversaGaussJordan(mat) {
    const n = mat.length;
    // Copia profunda
    const A = mat.map(row => row.slice());
    // Matriz identidad
    const I = [];
    for (let i = 0; i < n; i++) {
        I[i] = [];
        for (let j = 0; j < n; j++) {
            I[i][j] = (i === j ? 1 : 0);
        }
    }
    for (let i = 0; i < n; i++) {
        // Buscar el pivote
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }
        if (Math.abs(A[maxRow][i]) < 1e-12) return null; // No invertible
        // Intercambiar filas en ambas matrices
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [I[i], I[maxRow]] = [I[maxRow], I[i]];
        // Normalizar la fila del pivote
        const pivote = A[i][i];
        for (let j = 0; j < n; j++) {
            A[i][j] /= pivote;
            I[i][j] /= pivote;
        }
        // Eliminar otras filas
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = A[k][i];
                for (let j = 0; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                    I[k][j] -= factor * I[i][j];
                }
            }
        }
    }
    // Redondear a 6 decimales para evitar residuos numéricos
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            I[i][j] = Math.round(I[i][j] * 1e6) / 1e6;
    return I;
}

// Multiplica dos matrices cuadradas de igual tamaño y retorna el resultado.
function multiplicarMatricesGenerico(A, B) {
    const n = A.length;
    const resultado = [];
    for (let i = 0; i < n; i++) {
        resultado[i] = [];
        for (let j = 0; j < n; j++) {
            let suma = 0;
            for (let k = 0; k < n; k++) {
                suma += A[i][k] * B[k][j];
            }
            // Redondear a 4 decimales para mostrar como identidad
            resultado[i][j] = Math.round(suma * 10000) / 10000;
        }
    }
    return resultado;
}

// Event listeners para los botones
document.getElementById('sumar').addEventListener('click', sumarMatrices);
document.getElementById('restar').addEventListener('click', restarMatrices);
document.getElementById('multiplicar').addEventListener('click', multiplicarMatrices);
document.getElementById('escalar').addEventListener('click', mostrarEscalarUI);
document.getElementById('transponer').addEventListener('click', mostrarTransponerUI);
document.getElementById('determinante').addEventListener('click', mostrarDeterminanteUI);
document.getElementById('inversa').addEventListener('click', mostrarInversaUI);
document.getElementById('identidad').addEventListener('click', mostrarIdentidadUI);