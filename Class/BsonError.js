class BsonError extends Error {
  constructor(name, message) {
    super()
    this.name = name
    this.message = message
  }
}

module.exports = BsonError
