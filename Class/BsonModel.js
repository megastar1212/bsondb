const { readFileSync } = require("fs"),
      { isObject, isSchema, buildPath, readBSON, cloneArray, saveBSON } = require("../Utils/Function.js"),
      Schema = require("./BsonSchema.js"),
      Data = require("./BsonData.js"),
      BsonError = require("./BsonError.js");


let global_db = new Object();



class Model {

   constructor(db_name, schema, path, data = false) {
    if(!db_name) new BsonError("Model", "El nombre del 'Model' no fue especificado.")
    db_name = db_name.replace(/[^a-zA-Z0-9_]/g, '')
    if(db_name.length <= 0) throw new BsonError("Model", "El nombre del 'Model' no debe de contener simbolos.")
    if(!schema) new BsonError("Model", "El 'Schema' no fue especificado, usa el constructor.")
    if(!schema instanceof Schema) throw new BsonError("Model", "El 'Schema' debe ser creado con su constructor.")
    if(!path) path = "bsonDB"
    path = path.replace(/[^a-zA-Z0-9_]/g, '')

    if(path.length <= 0) throw new BsonError("Model", "El nombre de la ruta no debe de contener simbolos.")
    this.root = path
    this.path = buildPath(path, db_name).path
    this.schema = schema
    this.db_name = db_name

    if(!global_db[this.db_name]) global_db[this.db_name] = readBSON(this.path).arrayDB

    if(data) {
      global_db[this.db_name].push(data)
      return new Data(global_db[this.db_name], global_db[this.db_name].length-1, this.schema, this.path)
    }

  }


  buildModel(object) {
    if(!object || !isObject(object)) throw new BsonError("Model", "[buildModel] El parametro debe ser un objeto.")
    if(!isSchema(object, this.schema)) throw new BsonError("Model", `[buildModel] Los datos del objecto deben ser iguales al Schema '${this.db_name}'.`)
    return new Model(this.db_name, this.schema, this.root, object)
  }


  findOne(filter, callback) {
    if(!filter || typeof filter != "function") throw new BsonError("Model", "[findOne] El primero parametro debe ser un filtro.")
    if(!callback || typeof callback != "function") throw new BsonError("Model", "[findOne] El segundo parametro debe ser un callback(funcion).")
    let found = global_db[this.db_name].findIndex(filter)
    if(found == -1) return callback(undefined)
    return callback(new Data(global_db[this.db_name], found, this.schema, this.path))
  }


  filter(filter, callback) {
    if(!filter || typeof filter != "function") throw new BsonError("Model", "[filter] El primero parametro debe ser un filtro.")
    if(!callback || typeof callback != "function") throw new BsonError("Model", "[filter] El segundo parametro debe ser un callback(funcion).")
    let filter_array = global_db[this.db_name].filter(filter)
    if(filter_array.length <= 0) return callback(undefined)
    return callback(cloneArray(filter_array))
  }


  remove(filter, callback) {
    if(!filter || typeof filter != "function") throw new BsonError("Model", "[remove] El primero parametro debe ser un filtro.")
    if(!callback || typeof callback != "function") throw new BsonError("Model", "[remove] El segundo parametro debe ser un callback(funcion).")
    let found = global_db[this.db_name].findIndex(filter)
    if(found == -1) return callback(undefined)
    let delete_item = global_db[this.db_name].splice(found, 1)[0]
    let status = saveBSON(this.path, global_db[this.db_name])
    if(status) return callback(delete_item)
    return callback(undefined)
  }


  all(callback) {
    if(!callback || typeof callback != "function") throw new BsonError("Model", "[all] El parametro debe ser un callback(funcion).")
    if(global_db[this.db_name].length <= 0) return callback(undefined)
    return callback(cloneArray(global_db[this.db_name]))
  }




}
module.exports = Model
