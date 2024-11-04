import {Media} from './Media.js';

class Image extends Media {
	constructor(data, photographerName) {
		super(data, photographerName);
		this.src = `assets/images/${photographerName.split(' ')[0].toLowerCase()}/${data.image}`;
	}

	render() {
		return `
            <article class="media-card">
                <img src="${this.src}" 
                     alt="${this.title}"
                     class="media-content"
                     tabindex="0">
                <div class="media-info">
                    <h2>${this.title}</h2>
                    <button class="like-button" aria-label="likes">
                        ${this.likes} ❤️
                    </button>
                </div>
            </article>`;
	}
}

export {Image};