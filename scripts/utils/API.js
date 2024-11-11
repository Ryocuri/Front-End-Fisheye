import {Photographer} from "../models/photographer.js";

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

export async function getPhotographerById(id) {
	try {
		const response = await fetch('../../data/photographers.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.photographers.find(p => p.id === parseInt(id));
	} catch (error) {
		console.error("Erreur lors de la récupération du photographe:", error);
		return {};
	}
}

export async function getPhotographerMedia(photographerId) {
	try {
		const response = await fetch('../../data/photographers.json');
		const data = await response.json();
		return data.media.filter(m => m.photographerId === parseInt(photographerId));
	} catch (error) {
		console.error('Erreur lors du chargement des médias:', error);
		return [];
	}
}