import { getPhotographers } from '../utils/API.js';

function displayData(photographers) {
  const photographersSection = document.querySelector('.photographer_section');
  photographers.forEach((photographer) => {
    photographersSection.appendChild(photographer.getUserCardDOM());
  });
}

async function init() {
  const photographers = await getPhotographers(); // Récupération des photographes
  displayData(photographers); // Affichage des photographes
}

init();