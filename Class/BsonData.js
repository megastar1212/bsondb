const { isSchema, saveBSON } = require("../Utils/Function.js"),
      BsonError = require("./BsonError.js");

let SCHEMA,
    DBS,
    INDEX,
    PATH;

class Data {
  constructor(dbs, index, schema, path) {
    Object.keys(dbs[index]).forEach(k_ => this[k_] = dbs[index][k_])
    SCHEMA = schema
    DBS = dbs
    INDEX = index
    PATH = path
  }

  save() {
    let current_data = this
    if(!isSchema(current_data, SCHEMA)) throw new BsonError("Model", "[save] El valor de los datos ingresados son incorrectos, deben ser igual al 'Schema'")
    DBS[INDEX] = current_data
    let status = saveBSON(PATH, DBS)
    if(status) return Promise.resolve(current_data)
    return Promise.reject(`No se pudo guardar los datos en el archivo: ${PATH}`)
  }
}

module.exports = Data
