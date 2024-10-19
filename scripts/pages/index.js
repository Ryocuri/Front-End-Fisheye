async function getPhotographers() {
	// Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
	// mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".

	try {
		const response = await fetch('../../data/photographers.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return {
			photographers: data.photographers
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des photographes:", error);
		return {
			photographers: []
		};
	}
}

async function displayData(photographers) {
	const photographersSection = document.querySelector(".photographer_section");
	photographers.forEach((photographer) => {
		const photographerModel = photographerTemplate(photographer);
		const userCardDOM = photographerModel.getUserCardDOM();
		document.querySelector(".photographer_section").appendChild(userCardDOM);
	});

	photographers.forEach((photographer) => {
		const photographerModel = photographerTemplate(photographer);
		//const userCardDOM = photographerModel.getUserCardDOM();
		photographersSection.appendChild(photographerModel);
	});
}

async function init() {
	// Récupère les datas des photographes
	const {photographers} = await getPhotographers();
	displayData(photographers);
}

init();
    
