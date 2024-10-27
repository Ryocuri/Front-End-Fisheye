class MediaFactory {
	static createMedia(data, photographerName) {
		if (data.image) {
			return new Image(data, photographerName);
		} else if (data.video) {
			return new Video(data, photographerName);
		}
		throw new Error('Type de média non supporté');
	}
}

class Media {
	constructor(data, photographerName) {
		this.id = data.id;
		this.photographerId = data.photographerId;
		this.photographerName = photographerName;
		this.title = data.title;
		this.likes = data.likes;
		this.date = data.date;
		this.price = data.price;
	}
}

class Image extends Media {
	constructor(data, photographerName) {
		super(data, photographerName);
		const firstName = photographerName.split(' ')[0].toLowerCase();
		this.src = 'assets/images/' + firstName + `/${data.image}`;
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

class Video extends Media {
	constructor(data, photographerName) {
		super(data, photographerName);
		this.src = `assets/images/${this.photographerName}/${data.video}`;
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

export {MediaFactory};