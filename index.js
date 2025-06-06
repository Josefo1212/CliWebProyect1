document.getElementById('crearMatriz').addEventListener('click', () => {
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
});

function generarInputsMatriz(idMatriz, n) {
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
}

function mostrarTecladoNumerico() {
    if (document.getElementById('tecladoNumerico')) return;
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
        <button id="tecla-borrar">←</button>
        <button id="tecla-igual">=</button>
    `;
    document.getElementById('matrizInputs').appendChild(teclado);

    teclado.querySelectorAll('.tecla-num').forEach(btn => {
        btn.onclick = () => {
            if (celdaActiva) {
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
}

function seleccionarCelda(id) {
    if (celdaActiva) celdaActiva.classList.remove('activa');
    celdaActiva = document.getElementById(id);
    if (celdaActiva) celdaActiva.classList.add('activa');
}

function avanzarCelda() {
    if (!celdaActiva) return;
    const [matriz, i, j] = celdaActiva.id.split('_');
    let ni = parseInt(i, 10), nj = parseInt(j, 10);
    // Validar número
    if (celdaActiva.value === '' || isNaN(Number(celdaActiva.value))) {
        alert('Ingrese un número válido.');
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
}

function mostrarBotonGuardar(matriz) {
    const btn = document.createElement('button');
    btn.id = `guardarMatriz${matriz}`;
    btn.textContent = `Guardar Matriz ${matriz}`;
    btn.style.margin = '10px';
    btn.onclick = () => {
        if (!matrizCompleta(matriz)) {
            alert('Complete todos los campos de la matriz.');
            return;
        }
        if (matriz === 'A') {
            document.getElementById('matrizA').style.display = 'none';
            document.getElementById('guardarMatrizA').remove();
            document.getElementById('matrizB').style.display = '';
            generarInputsMatriz('matrizB', nGlobal);
            matrizActual = 'B';
            setTimeout(() => seleccionarCelda('matrizB_0_0'), 0);
        } else if (matriz === 'B') {
            document.getElementById('guardarMatrizB').remove();
            document.getElementById('tecladoNumerico').remove();
            alert('Matrices listas para operar.');
            // Aquí puedes habilitar los botones de operaciones
        }
    };
    document.getElementById('matrizInputs').appendChild(btn);
}

function matrizCompleta(matriz) {
    for (let i = 0; i < nGlobal; i++) {
        for (let j = 0; j < nGlobal; j++) {
            const input = document.getElementById(`matriz${matriz}_${i}_${j}`);
            if (!input || input.value === '' || isNaN(Number(input.value))) {
                return false;
            }
        }
    }
    return true;
}

// Inicialmente ocultar Matriz B
document.getElementById('matrizB').style.display = 'none';

let matrizActual = 'A'; // 'A' o 'B'
let nGlobal = 0;
let celdaActiva = null;