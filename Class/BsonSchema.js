const { isObject, check_schema } = require("../Utils/Function.js"),
      BsonError = require("./BsonError.js");


const valid_schemas = [
  "String",
  "Number",
  "Object",
  "Array",
  "Boolean"
]

class Schema {

  constructor(schema) {
    if(!schema || !isObject(schema)) throw new BsonError("Schema", "El parametro del constructor Schema debe ser un 'Object'")
    if(!check_schema(schema, valid_schemas)) throw new BsonError("Schema", "El formato del Schema es incorrecto.")

    this.schema = schema
    return this.schema
  }
}
module.exports = Schema
