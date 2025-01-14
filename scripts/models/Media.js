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

export { Media };