function photographerTemplate(data) {
	const {name, id, city, country, tagline, price, portrait} = data;

	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		const article = document.createElement('article');
		const img = document.createElement('img');
		img.setAttribute("src", picture)
		const renderName = document.createElement('h2');
		renderName.textContent = name;
		const renderCityCountry = document.createElement('p');
		renderCityCountry.textContent = city + ', ' + country;
		const renderTagline = document.createElement('p');
		renderTagline.textContent = tagline;
		const renderPrice = document.createElement('p');
		renderPrice.textContent = price + '€/jour';
		article.appendChild(img);
		article.appendChild(renderName);
		article.appendChild(renderCityCountry);
		article.appendChild(renderTagline);
		article.appendChild(renderPrice);
		return (article);
	}

	return {name, picture, getUserCardDOM}
}