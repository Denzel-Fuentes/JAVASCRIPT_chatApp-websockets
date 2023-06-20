const mongoose = require('mongoose');
const { mongodb } = require('./keys');

class Database {
  constructor() {
    this.URI = process.env.UriDB || mongodb.URI;
  }

  connect() {
    mongoose.connect(this.URI, {})
      .then(db => console.log('Se ha conectado a la base de datos'))
      .catch(err => console.error(err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

module.exports = Database;
