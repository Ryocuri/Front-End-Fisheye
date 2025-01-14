import { getPhotographers, getPhotographerMedia } from '../utils/API.js';
import { MediaFactory } from '../utils/MediaFactory.js';
import { setupModalListeners } from '../utils/contactForm.js';
import { Lightbox } from '../utils/lightbox.js';

let currentMedias = []; // Variable globale pour stocker les médias actuels
let currentPhotographerName = ''; // Variable globale pour le nom du photographe
const likedMedias = new Map(); // Map pour stocker les médias likés

function displayPhotographerInfo(photographer) {
  const header = document.querySelector('.photograph-header'); // Sélectionner l'élément header
  if (!header) return; // Arrêter l'exécution si l'élément n'existe pas

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

  // Ajouter la section de tri
  const sortingSection = document.createElement('div');
  sortingSection.className = 'sorting-section';
  sortingSection.innerHTML = `
        <label for="sorting">Trier par</label>
        <div class="custom-select">
            <select id="sorting" aria-label="Trier les médias">
                <option value="popularity">Popularité</option>
                <option value="date">Date</option>
                <option value="title">Titre</option>
            </select>
        </div>
    `;
  header.after(sortingSection); // Insérer la section après l'élément header
}

function sortMedia(medias, criteria) {
  switch (criteria) { // Ajout d'un switch pour trier les médias
  case 'popularity':
    return medias.sort((a, b) => b.likes - a.likes);
  case 'date':
    return medias.sort((a, b) => new Date(b.date) - new Date(a.date));
  case 'title':
    return medias.sort((a, b) => a.title.localeCompare(b.title));
  default:
    return medias;
  }
}


function updateTotalLikes() {
  const totalLikes = currentMedias.reduce((sum, media) => sum + media.likes, 0); // Calcul du total des likes
  const likesCounter = document.querySelector('.total-likes'); // Sélectionner le compteur de likes
  if (likesCounter) {
    likesCounter.textContent = totalLikes.toLocaleString(); // Ajout de toLocaleString()
  }
}

function handleLikeClick() {
  const mediaCard = this.closest('.media-card'); // Récupérer la carte parente
  if (!mediaCard) return; // Arrêter l'exécution si l'élément n'existe pas

  const mediaTitle = mediaCard.querySelector('h2').textContent; // Récupérer le titre du média
  const mediaIndex = currentMedias.findIndex((media) => media.title === mediaTitle); // Trouver l'index du média

  if (mediaIndex === -1) return; // Arrêter l'exécution si le média n'est pas trouvé

  const media = currentMedias[mediaIndex]; // Récupérer le média
  const mediaId = media.id.toString(); // Convertir l'ID en chaîne de caractères

  if (!likedMedias.has(mediaId)) {
    currentMedias[mediaIndex].likes++;
    likedMedias.set(mediaId, true);
    this.classList.add('liked');
    this.innerHTML = `${currentMedias[mediaIndex].likes} ❤️`;
  } else {
    currentMedias[mediaIndex].likes--;
    likedMedias.delete(mediaId);
    this.classList.remove('liked');
    this.innerHTML = `${currentMedias[mediaIndex].likes} 🤍`;
  }

  updateTotalLikes(); // Mettre à jour le compteur de likes
}

function setupLikeListeners() {
  document.querySelectorAll('.like-button').forEach((button) => {
    button.addEventListener('click', handleLikeClick);
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLikeClick.call(button, e); // Appel de la fonction handleLikeClick avec le bouton comme contexte
      }
    });
  });
}

async function displayMedia(medias, photographerName, sortCriteria = 'popularity') {
  const mediaSection = document.querySelector('.media-section'); // Sélectionner la section des médias
  if (!mediaSection) return; // Arrêter l'exécution si l'élément n'existe pas

  currentMedias = medias;
  currentPhotographerName = photographerName;

  try {
    const sortedMedias = sortMedia([...medias], sortCriteria); // Tri des médias

    const mediaElements = sortedMedias.map((mediaData) => {
      const media = MediaFactory.createMedia(mediaData, photographerName);
      return media.render();
    });

    mediaSection.innerHTML = mediaElements.join(''); // Afficher les médias

    // Initialiser la lightbox
    const lightbox = new Lightbox();
    lightbox.init(sortedMedias, photographerName);

    // Mettre à jour le compteur de likes
    setupLikeListeners();
    updateTotalLikes();
  } catch (error) {
	  // eslint-disable-next-line max-len
    mediaSection.innerHTML = '<p>Une erreur est survenue lors du chargement des médias : ' + error.message + '</p>';
  }
}

function displayPriceCard(photographer) {
  const container = document.querySelector('.photographer-info'); // Sélectionner le conteneur
  if (!container) return; // Arrêter l'exécution si l'élément n'existe pas

  const priceCard = document.createElement('div');
  priceCard.className = 'price-card';
  priceCard.setAttribute('aria-label', `Tarif journalier: ${photographer.price}€`);
  priceCard.innerHTML = `
        <span class="total-likes">0</span>
        <span class="heart-icon">❤️</span>
        <span class="price">${photographer.price}€ / jour</span>
    `;
  container.appendChild(priceCard);
}

function setupSortingListeners() {
  const sortingSelect = document.getElementById('sorting'); // Sélectionner l'élément de tri
  if (sortingSelect) {
    sortingSelect.addEventListener('change', (e) => {
      displayMedia(currentMedias, currentPhotographerName, e.target.value); // Appel de displayMedia avec le critère de tri
    });

    sortingSelect.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sortingSelect.click();
      }
    });
  }
}

function displayError(message) {
  const main = document.querySelector('main'); // Sélectionner l'élément main
  if (main) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    main.prepend(errorDiv);
  }
}

// Fonction principale d'initialisation
async function displayPhotographer() {
  // Récupérer l'ID depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get('id');

  if (!photographerId) {
    return;
  }

  try {
    // Récupérer les données du photographe
    const photographers = await getPhotographers();
    const photographer = photographers.find((p) => p.id === parseInt(photographerId));

    if (!photographer) {
      throw new Error('Photographe non trouvé'); // Lancer une erreur si le photographe n'est pas trouvé
    }

    // Afficher les informations du photographe
    displayPhotographerInfo(photographer);

    // Charger et afficher les médias
    const medias = await getPhotographerMedia(photographerId);
    await displayMedia(medias, photographer.name);

    // Afficher l'encart avec le tarif journalier
    displayPriceCard(photographer);

    // Initialiser le système de tri
    setupSortingListeners();

    // Ajouter les écouteurs d'événements pour le modal
    setupModalListeners();

  } catch (error) {
    displayError('Une erreur est survenue lors du chargement de la page : ' + error.message);
  }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', displayPhotographer);
