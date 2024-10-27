import {getPhotographers} from '../utils/API.js';
import {MediaFactory} from '../utils/MediaFactory.js';

async function displayPhotographer() {
	// Récupérer l'ID depuis l'URL
	const urlParams = new URLSearchParams(window.location.search);
	const photographerId = urlParams.get('id');

	try {
		// Récupérer les données du photographe
		const photographers = await getPhotographers();
		const photographer = photographers.find(p => p.id === parseInt(photographerId));

		if (!photographer) {
			throw new Error('Photographe non trouvé');
		}

		// Afficher les informations du photographe
		displayPhotographerInfo(photographer);

		// Charger et afficher les médias
		const medias = await getPhotographerMedia(photographerId);
		await displayMedia(medias, photographer.name);

		// Afficher l'encart avec le tarif journalier
		displayPriceCard(photographer);

	} catch (error) {
		console.error('Erreur:', error);
		// Gérer l'erreur de manière appropriée
	}
}

async function getPhotographerMedia(photographerId) {
	try {
		const response = await fetch('../../data/photographers.json');
		const data = await response.json();
		return data.media.filter(m => m.photographerId === parseInt(photographerId));
	} catch (error) {
		console.error('Erreur lors du chargement des médias:', error);
		return [];
	}
}

function displayPhotographerInfo(photographer) {
	const header = document.querySelector('.photograph-header');
	header.innerHTML = `
        <div class="photographer-profile">
            <h1>${photographer.name}</h1>
            <p class="location">${photographer.city}, ${photographer.country}</p>
            <p class="tagline">${photographer.tagline}</p>
        </div>
        <button class="contact-button" aria-label="Contacter ${photographer.name}">
            Contactez-moi
        </button>
        <img src="assets/photographers/${photographer.portrait}" 
             alt="${photographer.name}"
             class="photographer-portrait">
    `;
}

async function displayMedia(medias, photographerName) {
	const mediaSection = document.querySelector('.media-section');
	mediaSection.innerHTML = medias.map(mediaData => {
		const media = MediaFactory.createMedia(mediaData, photographerName);
		return media.render();
	}).join('');
}

function displayPriceCard(photographer) {
	const priceCard = document.createElement('div');
	priceCard.className = 'price-card';
	priceCard.innerHTML = `${photographer.price}€/jour`;
	document.querySelector('.photographer-info').appendChild(priceCard);
}

// Initialiser la page
displayPhotographer();