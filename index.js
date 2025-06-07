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