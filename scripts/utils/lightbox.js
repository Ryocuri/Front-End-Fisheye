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

		// Ajout du CSS
		const style = document.createElement('style');
		style.textContent = `
      .lightbox {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
      }

      .lightbox[aria-hidden="false"] {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .lightbox-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .media-container {
        max-width: 90%;
        max-height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .media-container img,
      .media-container video {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
      }

      .close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 2em;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
      }

      .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: white;
        font-size: 2em;
        cursor: pointer;
        padding: 20px;
      }

      .prev { left: 20px; }
      .next { right: 20px; }

      .media-title {
        color: white;
        font-size: 1.2em;
        margin-top: 20px;
        text-align: center;
      }
    `;
		document.head.appendChild(style);
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