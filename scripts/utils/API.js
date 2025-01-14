import { Photographer } from '../models/photographer.js';

export async function getPhotographers() {
  try {
    const response = await fetch('../../data/photographers.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.photographers.map((photographer) => new Photographer(photographer));
	  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      photographers: [],
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
    return data.photographers.find((p) => p.id === parseInt(id));
	  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {};
  }
}

export async function getPhotographerMedia(photographerId) {
  try {
    const response = await fetch('../../data/photographers.json');
    const data = await response.json();
    return data.media.filter((m) => m.photographerId === parseInt(photographerId));
	  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return [];
  }
}