const mongoose = require('mongoose');
const { mongodb } = require('./keys');

class Database {
  constructor() {
    this.URI = mongodb.URI;
  }

  connect() {
    mongoose.connect(this.URI, {})
      .then(db => console.log('Se ha conectado a la base de datos'))
      .catch(err => console.error(err));
  }
}

module.exports = Database;
