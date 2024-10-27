import {Photographer} from "../templates/photographer.js";

export async function getPhotographers() {
	try {
		const response = await fetch('../../data/photographers.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.photographers.map((photographer) => new Photographer(photographer));
	} catch (error) {
		console.error("Erreur lors de la récupération des photographes:", error);
		return {
			photographers: []
		};
	}
}