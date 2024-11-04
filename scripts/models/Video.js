import {Media} from './Media.js';

class Video extends Media {
	constructor(data, photographerName) {
		super(data, photographerName);
		this.src = `assets/images/${photographerName.split(' ')[0].toLowerCase()}/${data.video}`;
	}

	render() {
		return `
            <article class="media-card">
                <video controls class="media-content" tabindex="0">
                    <source src="${this.src}" type="video/mp4">
                    Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div class="media-info">
                    <h2>${this.title}</h2>
                    <button class="like-button" aria-label="likes">
                        ${this.likes} ❤️
                    </button>
                </div>
            </article>`;
	}
}

export {Video};