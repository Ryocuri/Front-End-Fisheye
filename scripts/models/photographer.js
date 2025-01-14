export class Photographer {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.city = data.city;
    this.country = data.country;
    this.tagline = data.tagline;
    this.price = data.price;
    this.portrait = data.portrait;
  }

  getUserCardDOM() {
    const template = `
      <article class="photographer">
        <a href="photographer.html?id=${this.id}" 
           aria-label="Voir le profil de ${this.name}"
           class="photographer-link">
          <figure>
            <img src="assets/photographers/${this.portrait}" alt="">
            <figcaption>
              <h2>${this.name}</h2>
              <p class="location">${this.city}, ${this.country}</p>
              <p class="tagline">${this.tagline}</p> 
              <p class="price">${this.price}€/jour</p>
            </figcaption>
          </figure>
        </a>
      </article>`;
    return (new DOMParser().parseFromString(template, 'text/html')).body.firstChild;
  }
}