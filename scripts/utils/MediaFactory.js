import { Image } from '../models/Image.js';
import { Video } from '../models/Video.js';

class MediaFactory {
  static createMedia(data, photographerName) { // Créer un média en fonction de son type
    if (data.image) {
      return new Image(data, photographerName);
    } else if (data.video) {
      return new Video(data, photographerName);
    }
    throw new Error('Type de média non supporté');
  }
}

export { MediaFactory };