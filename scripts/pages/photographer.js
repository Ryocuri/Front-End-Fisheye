import {getPhotographers, getPhotographerMedia} from '../utils/API.js';
import {MediaFactory} from '../utils/MediaFactory.js';

// Fonction principale d'initialisation
async function displayPhotographer() {
	// Récupérer l'ID depuis l'URL
	const urlParams = new URLSearchParams(window.location.search);
	const photographerId = urlParams.get('id');

	if (!photographerId) {
		console.error('ID du photographe manquant dans l\'URL');
		return;
	}

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

		// Ajouter les écouteurs d'événements pour le modal
		setupModalListeners();

	} catch (error) {
		console.error('Erreur:', error);
		// Afficher un message d'erreur à l'utilisateur
		displayError('Une erreur est survenue lors du chargement de la page');
	}
}

function displayPhotographerInfo(photographer) {
	const header = document.querySelector('.photograph-header');
	if (!header) return;

	header.innerHTML = `
    <div class="photographer-profile">
      <h1>${photographer.name}</h1>
      <p class="location">${photographer.city}, ${photographer.country}</p>
      <p class="tagline">${photographer.tagline}</p>
    </div>
    <button class="contact-button" aria-label="Contacter ${photographer.name}">
      Contactez-moi
    </button>
    <div id="contactModal" class="modal" aria-hidden="true" role="dialog">
      <div class="modal-content">
        <button class="close" aria-label="Fermer le formulaire de contact">&times;</button>
        <h2>Contactez-moi ${photographer.name}</h2>
        <form id="contactForm">
          <div class="form-group">
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" name="firstname" required>
          </div>
          <div class="form-group">
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" name="lastname" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button type="submit" class="submit-button">Envoyer</button>
        </form>
      </div>
    </div>
    <img src="assets/photographers/${photographer.portrait}" 
         alt="Portrait de ${photographer.name}"
         class="photographer-portrait">
  `;
}

async function displayMedia(medias, photographerName) {
	const mediaSection = document.querySelector('.media-section');
	if (!mediaSection) return;

	try {
		const mediaElements = medias.map(mediaData => {
			const media = MediaFactory.createMedia(mediaData, photographerName);
			return media.render();
		});

		mediaSection.innerHTML = mediaElements.join('');
	} catch (error) {
		console.error('Erreur lors de l\'affichage des médias:', error);
		mediaSection.innerHTML = '<p>Une erreur est survenue lors du chargement des médias</p>';
	}
}

function displayPriceCard(photographer) {
	const container = document.querySelector('.photographer-info');
	if (!container) return;

	const priceCard = document.createElement('div');
	priceCard.className = 'price-card';
	priceCard.setAttribute('aria-label', `Tarif journalier: ${photographer.price}€`);
	priceCard.innerHTML = `${photographer.price}€/jour`;
	container.appendChild(priceCard);
}

function setupModalListeners() {
	const modal = document.getElementById('contactModal');
	const openButton = document.querySelector('.contact-button');
	const closeButton = document.querySelector('.modal .close');
	const form = document.getElementById('contactForm');

	if (!modal || !openButton || !closeButton || !form) return;

	openButton.addEventListener('click', () => {
		openModal();
		modal.setAttribute('aria-hidden', 'false');
	});

	closeButton.addEventListener('click', () => {
		closeModal();
		modal.setAttribute('aria-hidden', 'true');
	});

	// Fermer le modal en cliquant en dehors
	window.addEventListener('click', (event) => {
		if (event.target === modal) {
			closeModal();
			modal.setAttribute('aria-hidden', 'true');
		}
	});

	// Gestion du formulaire
	form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
	event.preventDefault();
	const formData = new FormData(event.target);

	const modal = document.getElementById('contactModal');
	if (modal) {
		modal.style.display = 'none';
		modal.setAttribute('aria-hidden', 'true');
	}

	event.target.reset();
}

function displayError(message) {
	const main = document.querySelector('main');
	if (!main) return;

	const errorElement = document.createElement('div');
	errorElement.className = 'error-message';
	errorElement.setAttribute('role', 'alert');
	errorElement.textContent = message;
	main.prepend(errorElement);
}

function validateForm() {
	const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

	inputs.forEach(input => {
		input.addEventListener('invalid', function (event) {
			event.preventDefault();
			this.classList.add('error');

			// Ajouter un message d'erreur si n'existe pas déjà
			if (!this.nextElementSibling?.classList.contains('error-message')) {
				const errorMessage = document.createElement('div');
				errorMessage.className = 'error-message';
				errorMessage.textContent = 'Ce champ est requis';
				this.parentNode.appendChild(errorMessage);
			}
		});

		input.addEventListener('input', function () {
			this.classList.remove('error');
			const errorMessage = this.parentNode.querySelector('.error-message');
			if (errorMessage) {
				errorMessage.remove();
			}
		});
	});
}

function openModal() {
	document.getElementById('contactModal').style.display = 'block';
	document.body.classList.add('modal-open');
}

function closeModal() {
	document.getElementById('contactModal').style.display = 'none';
	document.body.classList.remove('modal-open');
}

// Appelez cette fonction après que le DOM soit chargé
document.addEventListener('DOMContentLoaded', validateForm);

// Initialiser la page
document.addEventListener('DOMContentLoaded', displayPhotographer);