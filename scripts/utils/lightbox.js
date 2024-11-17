export class Lightbox {
	constructor() {
		this.currentIndex = 0;
		this.medias = [];
		this.lightboxElement = null;
		this.photographerName = '';
	}

	init(medias, photographerName) {
		this.medias = medias;
		this.photographerName = photographerName;
		this.setupLightbox();
		this.attachEventListeners();
	}

	setupLightbox() {
		// Création de l'élément lightbox
		const lightboxHTML = `
      <div class="lightbox" role="dialog" aria-label="Vue image en plein écran" aria-hidden="true">
        <div class="lightbox-content">
          <button class="close-button" aria-label="Fermer la lightbox">×</button>
          <button class="nav-button prev" aria-label="Image précédente">❮</button>
          <div class="media-container"></div>
          <button class="nav-button next" aria-label="Image suivante">❯</button>
        </div>
        <div class="media-title"></div>
      </div>
    `;

		document.body.insertAdjacentHTML('beforeend', lightboxHTML);
		this.lightboxElement = document.querySelector('.lightbox');
	}

	attachEventListeners() {
		// Attacher les événements aux médias
		document.querySelectorAll('.media-content').forEach((media, index) => {
			media.addEventListener('click', () => this.openLightbox(index));
			media.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') this.openLightbox(index);
			});
		});

		// Événements de navigation
		this.lightboxElement.querySelector('.close-button').addEventListener('click', () => this.closeLightbox());
		this.lightboxElement.querySelector('.prev').addEventListener('click', () => this.showPrevious());
		this.lightboxElement.querySelector('.next').addEventListener('click', () => this.showNext());

		// Événements clavier
		document.addEventListener('keydown', (e) => {
			if (!this.lightboxElement.getAttribute('aria-hidden') === 'false') return;

			switch (e.key) {
				case 'Escape':
					this.closeLightbox();
					break;
				case 'ArrowLeft':
					this.showPrevious();
					break;
				case 'ArrowRight':
					this.showNext();
					break;
			}
		});
	}

	openLightbox(index) {
		this.currentIndex = index;
		this.lightboxElement.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		this.updateMedia();
	}

	closeLightbox() {
		this.lightboxElement.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
	}

	showPrevious() {
		this.currentIndex = (this.currentIndex - 1 + this.medias.length) % this.medias.length;
		this.updateMedia();
	}

	showNext() {
		this.currentIndex = (this.currentIndex + 1) % this.medias.length;
		this.updateMedia();
	}

	updateMedia() {
		const mediaContainer = this.lightboxElement.querySelector('.media-container');
		const titleContainer = this.lightboxElement.querySelector('.media-title');
		const currentMedia = this.medias[this.currentIndex];

		// Mise à jour du contenu
		if (currentMedia.image) {
			const imagePath = `assets/images/${this.photographerName.split(' ')[0].toLowerCase()}/${currentMedia.image}`;
			mediaContainer.innerHTML = `<img src="${imagePath}" alt="${currentMedia.title}">`;
		} else if (currentMedia.video) {
			const videoPath = `assets/images/${this.photographerName.split(' ')[0].toLowerCase()}/${currentMedia.video}`;
			mediaContainer.innerHTML = `
        <video controls>
          <source src="${videoPath}" type="video/mp4">
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      `;
		}

		titleContainer.textContent = currentMedia.title;
	}
}