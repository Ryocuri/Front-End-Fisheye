function photographerTemplate(data) {
	const {name, id, city, country, tagline, price, portrait} = data;

	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		let template = `<article class="photographer">` +
			`<img src="assets/photographers/${portrait}" alt="${name}">` +
			`<h2>${name}</h2>` +
			`<p>${city}, ${country}</p>` +
			`<p>${tagline}</p>` +
			`<p>${price}€/jour</p>` +
			`</article>`;
		return (new DOMParser().parseFromString(template, 'text/html')).body.firstChild;
	}

	return {name, picture, getUserCardDOM}
}