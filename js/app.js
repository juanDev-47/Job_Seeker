const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarBusqueda)
})

function validarBusqueda(e) {
    e.preventDefault();

    const busqueda = document.querySelector('#busqueda').value;

    if(busqueda.length < 3) { 
        mostrarAlerta('Busqueda muy corta, añade mas información');
        return;
    }

    // consultando la API
    consultarAPI(busqueda);

}

function mostrarAlerta(mensaje) {
    const error = document.querySelector('.bg-gray-300');

    if(!error){
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('bg-gray-300', 'py-2', 'mt-2', 'uppercase', 'text-center', 'alerta');
        divAlerta.textContent = mensaje;

        formulario.appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove();
        }, 2000);
    }

}

function consultarAPI(busqueda) {
    const githubURL = `https://jobs.github.com/positions.json?search=${busqueda}`;
    const url = `https://api.allorigins.win/get?url=${ encodeURIComponent(githubURL) }`;

    axios.get(url)
        .then( respuesta => mostrarVacantes(JSON.parse(respuesta.data.contents)));
}

function mostrarVacantes(vacantes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    if(vacantes.length > 0) {
        resultado.classList.add('grid');

        vacantes.forEach(vacante => {
            const { company, title, type, url, location } = vacante;

            resultado.innerHTML += `
            <div class="shadow bg-white p-6 rounded">
                <h2 class="text-2xl font-light mb-4">${title}</h2>
                <p class="font-bold uppercase">Compañia:  <span class="font-light normal-case">${company} </span></p>
                <p class="font-bold uppercase">Tipo de Contrato:   <span class="font-light normal-case">${type} </span></p>
                <p class="font-bold uppercase">Lugar de trabajo:   <span class="font-light normal-case">${location} </span></p>
                <a class="bg-teal-500 max-w-lg mx-auto mt-3 rounded p-2 block uppercase font-xl font-bold text-white text-center" href="${url}">Ver Vacante</a>
            </div>
            `;


        });
    } else {
        mostrarAlerta('No se encontraron resultados para la busqueda.')
    }
}