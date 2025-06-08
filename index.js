document.getElementById('crearMatriz').addEventListener('click', () => {
    try {
        const n = parseInt(document.getElementById('size').value, 10);
        if (isNaN(n) || n < 2 || n > 10) {
            alert('Por favor, ingrese un tamaño válido entre 2 y 10.');
            return;
        }
        nGlobal = n;
        matrizActual = 'A';
        generarInputsMatriz('matrizA', n);
        document.querySelector('#matrizB table').innerHTML = '';
        document.getElementById('matrizB').style.display = 'none';
        document.getElementById('guardarMatrizA')?.remove();
        document.getElementById('guardarMatrizB')?.remove();
        mostrarTecladoNumerico();
        setTimeout(() => {
            seleccionarCelda('matrizA_0_0');
        }, 0);
    } catch (error) {
        alert('Error al crear la matriz: ' + error.message);
    }
});

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
                input.readOnly = true;
                input.addEventListener('click', () => seleccionarCelda(input.id));
                celda.appendChild(input);
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
    } catch (error) {
        alert('Error al generar la matriz: ' + error.message);
    }
}

function mostrarTecladoNumerico() {
    try {
        // Si ya existe, elimínalo antes de crear uno nuevo (para limpiar el DOM)
        const tecladoExistente = document.getElementById('tecladoNumerico');
        if (tecladoExistente) tecladoExistente.remove();
        const teclado = document.createElement('div');
        teclado.id = 'tecladoNumerico';
        teclado.style.margin = '20px 0';
        teclado.style.display = 'flex';
        teclado.style.flexWrap = 'wrap';
        teclado.style.maxWidth = '180px';
        teclado.innerHTML = `
            <button class="tecla-num">1</button>
            <button class="tecla-num">2</button>
            <button class="tecla-num">3</button>
            <button class="tecla-num">4</button>
            <button class="tecla-num">5</button>
            <button class="tecla-num">6</button>
            <button class="tecla-num">7</button>
            <button class="tecla-num">8</button>
            <button class="tecla-num">9</button>
            <button class="tecla-num">0</button>
            <button class="tecla-num">-</button>
            <button class="tecla-num">.</button>
            <button id="tecla-borrar">←</button>
            <button id="tecla-igual">=</button>
        `;
        document.getElementById('matrizInputs').appendChild(teclado);

        teclado.querySelectorAll('.tecla-num').forEach(btn => {
            btn.onclick = () => {
                if (celdaActiva) {
                    // Solo permitir un punto decimal
                    if (btn.textContent === '.' && celdaActiva.value.indexOf('.') !== -1) return;
                    // Solo permitir un signo menos al inicio
                    if (btn.textContent === '-' && (celdaActiva.value.indexOf('-') !== -1 || celdaActiva.value.length > 0)) return;
                    celdaActiva.value += btn.textContent;
                }
            };
        });
        teclado.querySelector('#tecla-borrar').onclick = () => {
            if (celdaActiva) {
                celdaActiva.value = celdaActiva.value.slice(0, -1);
            }
        };
        teclado.querySelector('#tecla-igual').onclick = () => {
            avanzarCelda();
        };
    } catch (error) {
        alert('Error al mostrar el teclado numérico: ' + error.message);
    }
}

function seleccionarCelda(id) {
    try {
        if (celdaActiva) celdaActiva.classList.remove('activa');
        celdaActiva = document.getElementById(id);
        if (celdaActiva) celdaActiva.classList.add('activa');
    } catch (error) {
        alert('Error al seleccionar la celda: ' + error.message);
    }
}

function avanzarCelda() {
    try {
        if (!celdaActiva) return;
        const [matriz, i, j] = celdaActiva.id.split('_');
        let ni = parseInt(i, 10), nj = parseInt(j, 10);
        // Validar número (ahora permite float)
        if (
            celdaActiva.value === '' ||
            isNaN(Number(celdaActiva.value)) ||
            !/^[-+]?\d*\.?\d+$/.test(celdaActiva.value)
        ) {
            alert('Ingrese un número válido (puede ser decimal).');
            return;
        }
        // Buscar siguiente celda
        if (nj < nGlobal - 1) {
            seleccionarCelda(`${matriz}_${ni}_${nj + 1}`);
        } else if (ni < nGlobal - 1) {
            seleccionarCelda(`${matriz}_${ni + 1}_0`);
        } else {
            // Última celda, mostrar botón guardar
            if (matrizActual === 'A' && !document.getElementById('guardarMatrizA')) {
                mostrarBotonGuardar('A');
            } else if (matrizActual === 'B' && !document.getElementById('guardarMatrizB')) {
                mostrarBotonGuardar('B');
            }
        }
    } catch (error) {
        alert('Error al avanzar de celda: ' + error.message);
    }
}

function mostrarBotonGuardar(matriz) {
    try {
        // Evita múltiples botones de guardar
        if (document.getElementById(`guardarMatriz${matriz}`)) return;
        const btn = document.createElement('button');
        btn.id = `guardarMatriz${matriz}`;
        btn.textContent = `Guardar Matriz ${matriz}`;
        btn.style.margin = '10px';
        btn.onclick = () => {
            try {
                if (!matrizCompleta(matriz)) {
                    alert('Complete todos los campos de la matriz.');
                    return;
                }
                if (matriz === 'A') {
                    document.getElementById('matrizA').style.display = 'none';
                    // Solo remover el botón si existe
                    const btnA = document.getElementById('guardarMatrizA');
                    if (btnA) btnA.remove();
                    document.getElementById('matrizB').style.display = '';
                    generarInputsMatriz('matrizB', nGlobal);
                    matrizActual = 'B';
                    setTimeout(() => {
                        seleccionarCelda('matrizB_0_0');
                    }, 0);
                } else if (matriz === 'B') {
                    // Solo remover el botón si existe
                    const btnB = document.getElementById('guardarMatrizB');
                    if (btnB) btnB.remove();
                    document.getElementById('tecladoNumerico').remove();
                    document.getElementById('matrizA').style.display = '';
                    document.getElementById('matrizB').style.display = '';
                    alert('Matrices listas para operar.');
                }
            } catch (error) {
                alert('Error al guardar la matriz: ' + error.message);
            }
        };
        document.getElementById('matrizInputs').appendChild(btn);
    } catch (error) {
        alert('Error al mostrar el botón guardar: ' + error.message);
    }
}

function matrizCompleta(matriz) {
    try {
        for (let i = 0; i < nGlobal; i++) {
            for (let j = 0; j < nGlobal; j++) {
                const input = document.getElementById(`matriz${matriz}_${i}_${j}`);
                if (
                    !input ||
                    input.value === '' ||
                    isNaN(Number(input.value)) ||
                    !/^[-+]?\d*\.?\d+$/.test(input.value)
                ) {
                    return false;
                }
            }
        }
        return true;
    } catch (error) {
        alert('Error al validar la matriz: ' + error.message);
        return false;
    }
}

// Inicialmente ocultar Matriz B
try {
    document.getElementById('matrizB').style.display = 'none';
} catch (error) {
    alert('Error al ocultar la Matriz B: ' + error.message);
}

let matrizActual = 'A'; // 'A' o 'B'
let nGlobal = 0;
let celdaActiva = null;

// Al final del archivo, agrega este listener global:
document.addEventListener('keydown', (e) => {
    try {
        // No interceptar teclas si el foco está en el input del escalar
        if (document.activeElement && document.activeElement.id === 'escalarInput') return;
        if (!celdaActiva) return;
        // Permitir ingresar números, el signo menos y el punto decimal
        if (
            (e.key >= '0' && e.key <= '9') ||
            (e.key === '-' && celdaActiva.value.indexOf('-') === -1 && celdaActiva.value.length === 0) ||
            (e.key === '.' && celdaActiva.value.indexOf('.') === -1)
        ) {
            celdaActiva.value += e.key;
            e.preventDefault();
            return;
        }
        // Borrar con Backspace
        if (e.key === 'Backspace') {
            celdaActiva.value = celdaActiva.value.slice(0, -1);
            e.preventDefault();
            return;
        }
        // Avanzar con Enter
        if (e.key === 'Enter') {
            avanzarCelda();
            e.preventDefault();
        }
    } catch (error) {
        alert('Error en la entrada de teclado: ' + error.message);
    }
});

document.getElementById('matrizAleatoria').addEventListener('click', () => {
    try {
        const n = parseInt(document.getElementById('size').value, 10);
        if (isNaN(n) || n < 2 || n > 10) {
            alert('Por favor, ingrese un tamaño válido entre 2 y 10.');
            return;
        }
        nGlobal = n;
        // Detectar si estamos en matriz B o A según cuál está visible
        if (matrizActual === 'B' && document.getElementById('matrizB').style.display !== 'none') {
            // Generar aleatoria para matriz B
            generarInputsMatriz('matrizB', n);
            rellenarMatrizAleatoria('matrizB', n);
            seleccionarCelda('matrizB_0_0');
            document.getElementById('matrizA').style.display = 'none';
            document.getElementById('matrizB').style.display = '';
            document.getElementById('guardarMatrizB')?.remove();
            if (matrizCompleta('B') && !document.getElementById('guardarMatrizB')) {
                mostrarBotonGuardar('B');
            }
        } else {
            // Generar aleatoria para matriz A (flujo normal)
            matrizActual = 'A';
            generarInputsMatriz('matrizA', n);
            document.querySelector('#matrizB table').innerHTML = '';
            document.getElementById('matrizB').style.display = 'none';
            document.getElementById('guardarMatrizA')?.remove();
            document.getElementById('guardarMatrizB')?.remove();
            mostrarTecladoNumerico();
            setTimeout(() => {
                rellenarMatrizAleatoria('matrizA', n);
                seleccionarCelda('matrizA_0_0');
                if (matrizCompleta('A') && !document.getElementById('guardarMatrizA')) {
                    mostrarBotonGuardar('A');
                }
            }, 0);
        }
    } catch (error) {
        alert('Error al crear matriz aleatoria: ' + error.message);
    }
});

function rellenarMatrizAleatoria(idMatriz, n) {
    try {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.getElementById(`${idMatriz}_${i}_${j}`);
                if (input) {
                    input.value = Math.floor(Math.random() * 21) - 10; // Números enteros entre -10 y 10
                }
            }
        }
    } catch (error) {
        alert('Error al rellenar matriz aleatoria: ' + error.message);
    }
}

document.getElementById('limpiarMatriz').addEventListener('click', () => {
    try {
        limpiarMatriz('matrizA');
        limpiarMatriz('matrizB');
        document.getElementById('guardarMatrizA')?.remove();
        document.getElementById('guardarMatrizB')?.remove();
        document.getElementById('tecladoNumerico')?.remove();
        document.getElementById('matrizA').style.display = '';
        document.getElementById('matrizB').style.display = 'none';
        celdaActiva = null;
        matrizActual = 'A';
        // Al limpiar, vuelve a mostrar el teclado numérico para el siguiente uso
        mostrarTecladoNumerico();
        // El usuario debe volver a presionar "Crear Matriz" o "Matriz Aleatoria"
    } catch (error) {
        alert('Error al limpiar las matrices: ' + error.message);
    }
});

function limpiarMatriz(idMatriz) {
    try {
        const inputs = document.querySelectorAll(`#${idMatriz} input`);
        inputs.forEach(input => input.value = '');
    } catch (error) {
        alert('Error al limpiar la matriz: ' + error.message);
    }
}

// Suma de matrices (A + B)
function sumarMatrices() {
    try {
        // Validar dimensiones
        const nA = document.querySelectorAll('#matrizA input').length;
        const nB = document.querySelectorAll('#matrizB input').length;
        if (nA === 0 || nB === 0) {
            mostrarError('resultadoSuma', 'Debe ingresar ambas matrices.');
            return;
        }
        const n = nGlobal;
        if (nA !== nB) {
            mostrarError('resultadoSuma', 'Las dimensiones de las matrices no coinciden.');
            return;
        }
        // Obtener valores de ambas matrices
        const matrizA = [];
        const matrizB = [];
        for (let i = 0; i < n; i++) {
            const filaA = [];
            const filaB = [];
            for (let j = 0; j < n; j++) {
                const valA = parseFloat(document.getElementById(`matrizA_${i}_${j}`).value);
                const valB = parseFloat(document.getElementById(`matrizB_${i}_${j}`).value);
                if (isNaN(valA) || isNaN(valB)) {
                    mostrarError('resultadoSuma', 'Todas las celdas deben estar completas y ser números.');
                    return;
                }
                filaA.push(valA);
                filaB.push(valB);
            }
            matrizA.push(filaA);
            matrizB.push(filaB);
        }
        // Sumar matrices
        const resultado = [];
        for (let i = 0; i < n; i++) {
            resultado[i] = [];
            for (let j = 0; j < n; j++) {
                resultado[i][j] = matrizA[i][j] + matrizB[i][j];
            }
        }
        mostrarResultadoSuma(resultado);
    } catch (error) {
        mostrarError('resultadoSuma', 'Error al sumar matrices: ' + error.message);
    }
}

function mostrarResultadoSuma(resultado) {
    const tabla = document.querySelector('#resultadoSuma table');
    tabla.innerHTML = '';
    resultado.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
    // Limpiar mensaje de error si lo hubiera
    const div = document.getElementById('resultadoSuma');
    let error = div.querySelector('.error');
    if (error) error.remove();
}

function mostrarError(idDiv, mensaje) {
    const div = document.getElementById(idDiv);
    let error = div.querySelector('.error');
    if (!error) {
        error = document.createElement('div');
        error.className = 'error';
        div.appendChild(error);
    }
    error.textContent = mensaje;
    // Limpiar tabla de resultado
    const tabla = div.querySelector('table');
    if (tabla) tabla.innerHTML = '';
}

// Event listener para el botón "sumar"
document.getElementById('sumar').addEventListener('click', sumarMatrices);

// Resta de matrices (A - B y B - A)
function restarMatrices() {
    try {
        const nA = document.querySelectorAll('#matrizA input').length;
        const nB = document.querySelectorAll('#matrizB input').length;
        if (nA === 0 || nB === 0) {
            mostrarError('resultadoResta', 'Debe ingresar ambas matrices.');
            return;
        }
        const n = nGlobal;
        if (nA !== nB) {
            mostrarError('resultadoResta', 'Las dimensiones de las matrices no coinciden.');
            return;
        }
        // Obtener valores de ambas matrices
        const matrizA = [];
        const matrizB = [];
        for (let i = 0; i < n; i++) {
            const filaA = [];
            const filaB = [];
            for (let j = 0; j < n; j++) {
                const valA = parseFloat(document.getElementById(`matrizA_${i}_${j}`).value);
                const valB = parseFloat(document.getElementById(`matrizB_${i}_${j}`).value);
                if (isNaN(valA) || isNaN(valB)) {
                    mostrarError('resultadoResta', 'Todas las celdas deben estar completas y ser números.');
                    return;
                }
                filaA.push(valA);
                filaB.push(valB);
            }
            matrizA.push(filaA);
            matrizB.push(filaB);
        }
        // Calcular A - B y B - A
        const resultadoAB = [];
        const resultadoBA = [];
        for (let i = 0; i < n; i++) {
            resultadoAB[i] = [];
            resultadoBA[i] = [];
            for (let j = 0; j < n; j++) {
                resultadoAB[i][j] = matrizA[i][j] - matrizB[i][j];
                resultadoBA[i][j] = matrizB[i][j] - matrizA[i][j];
            }
        }
        mostrarResultadoResta(resultadoAB, resultadoBA);
    } catch (error) {
        mostrarError('resultadoResta', 'Error al restar matrices: ' + error.message);
    }
}

function mostrarResultadoResta(resultadoAB, resultadoBA) {
    const tabla = document.querySelector('#resultadoResta table');
    tabla.innerHTML = '';
    // Mostrar A - B
    const captionAB = document.createElement('caption');
    captionAB.textContent = 'A - B';
    captionAB.style.fontWeight = 'bold';
    tabla.appendChild(captionAB);
    resultadoAB.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
    // Separador visual
    const sep = document.createElement('tr');
    const sepTd = document.createElement('td');
    sepTd.colSpan = resultadoAB.length;
    sepTd.style.height = '10px';
    sepTd.style.background = 'transparent';
    sep.appendChild(sepTd);
    tabla.appendChild(sep);
    // Mostrar B - A
    const captionBA = document.createElement('caption');
    captionBA.textContent = 'B - A';
    captionBA.style.fontWeight = 'bold';
    tabla.appendChild(captionBA);
    resultadoBA.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
    // Limpiar mensaje de error si lo hubiera
    const div = document.getElementById('resultadoResta');
    let error = div.querySelector('.error');
    if (error) error.remove();
}

// Event listener para el botón "restar"
document.getElementById('restar').addEventListener('click', restarMatrices);

// Multiplicación de matrices (A × B)
function multiplicarMatrices() {
    try {
        const nA = document.querySelectorAll('#matrizA input').length;
        const nB = document.querySelectorAll('#matrizB input').length;
        if (nA === 0 || nB === 0) {
            mostrarError('resultadoMultiplicacion', 'Debe ingresar ambas matrices.');
            return;
        }
        const n = nGlobal;
        if (nA !== nB) {
            mostrarError('resultadoMultiplicacion', 'Las dimensiones de las matrices no coinciden.');
            return;
        }
        // Obtener valores de ambas matrices
        const matrizA = [];
        const matrizB = [];
        for (let i = 0; i < n; i++) {
            const filaA = [];
            const filaB = [];
            for (let j = 0; j < n; j++) {
                const valA = parseFloat(document.getElementById(`matrizA_${i}_${j}`).value);
                const valB = parseFloat(document.getElementById(`matrizB_${i}_${j}`).value);
                if (isNaN(valA) || isNaN(valB)) {
                    mostrarError('resultadoMultiplicacion', 'Todas las celdas deben estar completas y ser números.');
                    return;
                }
                filaA.push(valA);
                filaB.push(valB);
            }
            matrizA.push(filaA);
            matrizB.push(filaB);
        }
        // Multiplicar matrices (A × B)
        const resultado = [];
        for (let i = 0; i < n; i++) {
            resultado[i] = [];
            for (let j = 0; j < n; j++) {
                let suma = 0;
                for (let k = 0; k < n; k++) {
                    suma += matrizA[i][k] * matrizB[k][j];
                }
                resultado[i][j] = suma;
            }
        }
        mostrarResultadoMultiplicacion(resultado);
    } catch (error) {
        mostrarError('resultadoMultiplicacion', 'Error al multiplicar matrices: ' + error.message);
    }
}

function mostrarResultadoMultiplicacion(resultado) {
    const tabla = document.querySelector('#resultadoMultiplicacion table');
    tabla.innerHTML = '';
    resultado.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
    // Limpiar mensaje de error si lo hubiera
    const div = document.getElementById('resultadoMultiplicacion');
    let error = div.querySelector('.error');
    if (error) error.remove();
}

// Event listener para el botón "multiplicar"
document.getElementById('multiplicar').addEventListener('click', multiplicarMatrices);

// Multiplicación por escalar (k × A o k × B)
function mostrarEscalarUI() {
    // Evita múltiples formularios
    if (document.getElementById('escalarForm')) return;

    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'escalarForm';
    form.style.marginLeft = '10px';

    // Select para elegir matriz
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

    // Input para escalar
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'escalarInput';
    input.placeholder = 'Escalar k';
    input.step = 'any';
    input.style.width = '80px';
    input.style.marginLeft = '5px';

    // Botón para confirmar
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        multiplicarPorEscalar();
        form.remove();
    };

    // Botón para cancelar
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
        const kInput = document.getElementById('escalarInput');
        const select = document.getElementById('escalarMatrizSelect');
        if (!kInput || !select) {
            mostrarError('resultadoEscalar', 'No se encontró el campo para el escalar o la matriz.');
            return;
        }
        const matriz = select.value;
        const k = parseFloat(kInput.value);
        if (isNaN(k)) {
            mostrarError('resultadoEscalar', 'Ingrese un número válido para el escalar.');
            return;
        }
        const nInputs = document.querySelectorAll(`#matriz${matriz} input`).length;
        if (nInputs === 0) {
            mostrarError('resultadoEscalar', `Debe ingresar la matriz ${matriz}.`);
            return;
        }
        const n = nGlobal;
        const matrizData = [];
        for (let i = 0; i < n; i++) {
            const fila = [];
            for (let j = 0; j < n; j++) {
                const val = parseFloat(document.getElementById(`matriz${matriz}_${i}_${j}`).value);
                if (isNaN(val)) {
                    mostrarError('resultadoEscalar', `Todas las celdas de la matriz ${matriz} deben estar completas y ser números.`);
                    return;
                }
                fila.push(val);
            }
            matrizData.push(fila);
        }
        // Multiplicar por escalar
        const resultado = [];
        for (let i = 0; i < n; i++) {
            resultado[i] = [];
            for (let j = 0; j < n; j++) {
                resultado[i][j] = k * matrizData[i][j];
            }
        }
        mostrarResultadoEscalar(resultado);
    } catch (error) {
        mostrarError('resultadoEscalar', 'Error al multiplicar por escalar: ' + error.message);
    }
}

function mostrarResultadoEscalar(resultado) {
    const tabla = document.querySelector('#resultadoEscalar table');
    tabla.innerHTML = '';
    resultado.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
    // Limpiar mensaje de error si lo hubiera
    const div = document.getElementById('resultadoEscalar');
    let error = div.querySelector('.error');
    if (error) error.remove();
}

// Event listener para el botón "escalar"
document.getElementById('escalar').addEventListener('click', mostrarEscalarUI);

// Transposición de matriz (A^T o B^T)
function mostrarTransponerUI() {
    if (document.getElementById('transponerForm')) return;

    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'transponerForm';
    form.style.marginLeft = '10px';

    // Select para elegir matriz
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

    // Botón para confirmar
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        transponerMatriz();
        form.remove();
    };

    // Botón para cancelar
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
        const select = document.getElementById('transponerMatrizSelect');
        if (!select) {
            mostrarError('resultadoTranspuesta', 'No se encontró el campo para seleccionar la matriz.');
            return;
        }
        const matriz = select.value;
        const nInputs = document.querySelectorAll(`#matriz${matriz} input`).length;
        if (nInputs === 0) {
            mostrarError('resultadoTranspuesta', `Debe ingresar la matriz ${matriz}.`);
            return;
        }
        const n = nGlobal;
        const matrizData = [];
        for (let i = 0; i < n; i++) {
            const fila = [];
            for (let j = 0; j < n; j++) {
                const val = parseFloat(document.getElementById(`matriz${matriz}_${i}_${j}`).value);
                if (isNaN(val)) {
                    mostrarError('resultadoTranspuesta', `Todas las celdas de la matriz ${matriz} deben estar completas y ser números.`);
                    return;
                }
                fila.push(val);
            }
            matrizData.push(fila);
        }
        // Calcular transpuesta
        const transpuesta = [];
        for (let i = 0; i < n; i++) {
            transpuesta[i] = [];
            for (let j = 0; j < n; j++) {
                transpuesta[i][j] = matrizData[j][i];
            }
        }
        mostrarResultadoTranspuesta(matriz, matrizData, transpuesta);
    } catch (error) {
        mostrarError('resultadoTranspuesta', 'Error al transponer la matriz: ' + error.message);
    }
}

function mostrarResultadoTranspuesta(matriz, original, transpuesta) {
    const div = document.getElementById('resultadoTranspuesta');
    div.innerHTML = `
        <h2>Resultado Transpuesta</h2>
        <div style="display:flex;gap:40px;align-items:flex-start;">
            <div>
                <div style="font-weight:bold;text-align:center;">${matriz === 'A' ? 'Matriz A' : 'Matriz B'}</div>
                <table id="tablaOriginal"></table>
            </div>
            <div>
                <div style="font-weight:bold;text-align:center;">Transpuesta (${matriz}<sup>T</sup>)</div>
                <table id="tablaTranspuesta"></table>
            </div>
        </div>
    `;
    // Mostrar original
    const tablaOriginal = div.querySelector('#tablaOriginal');
    tablaOriginal.innerHTML = '';
    original.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tablaOriginal.appendChild(tr);
    });
    // Mostrar transpuesta
    const tablaTranspuesta = div.querySelector('#tablaTranspuesta');
    tablaTranspuesta.innerHTML = '';
    transpuesta.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tablaTranspuesta.appendChild(tr);
    });
}

// Determinante de matriz (det(A) o det(B))
function mostrarDeterminanteUI() {
    if (document.getElementById('determinanteForm')) return;

    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'determinanteForm';
    form.style.marginLeft = '10px';

    // Select para elegir matriz
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

    // Botón para confirmar
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        calcularDeterminante();
        form.remove();
    };

    // Botón para cancelar
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
        const select = document.getElementById('determinanteMatrizSelect');
        if (!select) {
            mostrarError('resultadoDeterminante', 'No se encontró el campo para seleccionar la matriz.');
            return;
        }
        const matriz = select.value;
        const nInputs = document.querySelectorAll(`#matriz${matriz} input`).length;
        if (nInputs === 0) {
            mostrarError('resultadoDeterminante', `Debe ingresar la matriz ${matriz}.`);
            return;
        }
        const n = nGlobal;
        const matrizData = [];
        for (let i = 0; i < n; i++) {
            const fila = [];
            for (let j = 0; j < n; j++) {
                const val = parseFloat(document.getElementById(`matriz${matriz}_${i}_${j}`).value);
                if (isNaN(val)) {
                    mostrarError('resultadoDeterminante', `Todas las celdas de la matriz ${matriz} deben estar completas y ser números.`);
                    return;
                }
                fila.push(val);
            }
            matrizData.push(fila);
        }
        // Calcular determinante usando eliminación gaussiana
        const det = determinanteGauss(matrizData);
        mostrarResultadoDeterminante(det);
    } catch (error) {
        mostrarError('resultadoDeterminante', 'Error al calcular el determinante: ' + error.message);
    }
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

function mostrarResultadoDeterminante(det) {
    const div = document.getElementById('resultadoDeterminante');
    div.querySelector('p').textContent = `Determinante: ${det}`;
    // Limpiar mensaje de error si lo hubiera
    let error = div.querySelector('.error');
    if (error) error.remove();
}

// Event listener para el botón "determinante"
document.getElementById('determinante').addEventListener('click', mostrarDeterminanteUI);

// Inversa de matriz (A^-1 o B^-1)
function mostrarInversaUI() {
    if (document.getElementById('inversaForm')) return;

    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'inversaForm';
    form.style.marginLeft = '10px';

    // Select para elegir matriz
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

    // Botón para confirmar
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        calcularInversa();
        form.remove();
    };

    // Botón para cancelar
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
        const select = document.getElementById('inversaMatrizSelect');
        if (!select) {
            mostrarError('resultadoInversa', 'No se encontró el campo para seleccionar la matriz.');
            return;
        }
        const matriz = select.value;
        const nInputs = document.querySelectorAll(`#matriz${matriz} input`).length;
        if (nInputs === 0) {
            mostrarError('resultadoInversa', `Debe ingresar la matriz ${matriz}.`);
            return;
        }
        const n = nGlobal;
        const matrizData = [];
        for (let i = 0; i < n; i++) {
            const fila = [];
            for (let j = 0; j < n; j++) {
                const val = parseFloat(document.getElementById(`matriz${matriz}_${i}_${j}`).value);
                if (isNaN(val)) {
                    mostrarError('resultadoInversa', `Todas las celdas de la matriz ${matriz} deben estar completas y ser números.`);
                    return;
                }
                fila.push(val);
            }
            matrizData.push(fila);
        }
        // Validar determinante
        const det = determinanteGauss(matrizData);
        if (Math.abs(det) < 1e-10) {
            mostrarError('resultadoInversa', 'La matriz no es invertible (determinante = 0).');
            mostrarResultadoInversa(null, null, null, matriz);
            return;
        }
        // Calcular inversa
        const inversa = inversaGaussJordan(matrizData);
        if (!inversa) {
            mostrarError('resultadoInversa', 'La matriz no es invertible (singular o mal condicionada).');
            mostrarResultadoInversa(null, null, null, matriz);
            return;
        }
        // Verificación: A × A^-1 = I
        const producto = multiplicarMatricesGenerico(matrizData, inversa);
        mostrarResultadoInversa(matrizData, inversa, producto, matriz);
    } catch (error) {
        mostrarError('resultadoInversa', 'Error al calcular la inversa: ' + error.message);
    }
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

// Multiplicación genérica de matrices cuadradas
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

function mostrarResultadoInversa(original, inversa, producto, matriz) {
    const div = document.getElementById('resultadoInversa');
    if (!inversa) {
        div.innerHTML = `
            <h2>Resultado Inversa</h2>
            <div style="color:red;font-weight:bold;">La matriz no es invertible.</div>
        `;
        return;
    }
    div.innerHTML = `
        <h2>Resultado Inversa</h2>
        <div style="display:flex;gap:40px;align-items:flex-start;">
            <div>
                <div style="font-weight:bold;text-align:center;">${matriz === 'A' ? 'Matriz A' : 'Matriz B'}</div>
                <table id="tablaOriginalInv"></table>
            </div>
            <div>
                <div style="font-weight:bold;text-align:center;">Inversa (${matriz}<sup>-1</sup>)</div>
                <table id="tablaInversa"></table>
            </div>
            <div>
                <div style="font-weight:bold;text-align:center;">Verificación: ${matriz} × ${matriz}<sup>-1</sup> = I</div>
                <table id="tablaVerificacion"></table>
            </div>
        </div>
    `;
    // Mostrar original
    const tablaOriginal = div.querySelector('#tablaOriginalInv');
    tablaOriginal.innerHTML = '';
    original.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tablaOriginal.appendChild(tr);
    });
    // Mostrar inversa
    const tablaInversa = div.querySelector('#tablaInversa');
    tablaInversa.innerHTML = '';
    inversa.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tablaInversa.appendChild(tr);
    });
    // Mostrar verificación (producto)
    const tablaVerificacion = div.querySelector('#tablaVerificacion');
    tablaVerificacion.innerHTML = '';
    producto.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tablaVerificacion.appendChild(tr);
    });
}

// Matriz identidad (I_n)
function mostrarIdentidadUI() {
    // Evita múltiples formularios
    if (document.getElementById('identidadForm')) return;

    const acciones = document.getElementById('acciones');
    const form = document.createElement('span');
    form.id = 'identidadForm';
    form.style.marginLeft = '10px';

    // Input para tamaño
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'identidadSizeInput';
    input.placeholder = 'Tamaño n';
    input.min = 2;
    input.max = 10;
    input.style.width = '60px';

    // Botón para confirmar
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.type = 'button';
    btn.style.marginLeft = '5px';
    btn.onclick = () => {
        generarIdentidad();
        form.remove();
    };

    // Botón para cancelar
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
            mostrarError('resultadoIdentidad', 'Ingrese un tamaño válido entre 2 y 10.');
            return;
        }
        const identidad = [];
        for (let i = 0; i < n; i++) {
            identidad[i] = [];
            for (let j = 0; j < n; j++) {
                identidad[i][j] = (i === j ? 1 : 0);
            }
        }
        mostrarResultadoIdentidad(identidad);
    } catch (error) {
        mostrarError('resultadoIdentidad', 'Error al generar la matriz identidad: ' + error.message);
    }
}

function mostrarResultadoIdentidad(identidad) {
    const div = document.getElementById('resultadoIdentidad');
    div.innerHTML = `
        <h2>Matriz Identidad</h2>
        <table id="tablaIdentidad"></table>
    `;
    const tabla = div.querySelector('#tablaIdentidad');
    tabla.innerHTML = '';
    identidad.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
    // Limpiar mensaje de error si lo hubiera
    let error = div.querySelector('.error');
    if (error) error.remove();
}

// Event listener para el botón "identidad"
document.getElementById('identidad').addEventListener('click', mostrarIdentidadUI);