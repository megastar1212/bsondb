const BsonError = require("../Class/BsonError.js"),
      fs = require("fs"),
      path = require("path"),
      bson = require("bson");

function isObject(data) {
  if(typeof data != "object" || typeof data == "object" && (data instanceof Array)) return false
  return true
}


function check_schema(object, schemas) {
  let keys = Object.keys(object)
  let object_data = object
  for(var prop_key of keys) {
    if(typeof object_data[prop_key] == "function" && schemas.includes(object_data[prop_key].name)) continue
    if(isObject(object_data[prop_key])) {
      if(object_data[prop_key].hasOwnProperty("type") && typeof object_data[prop_key].type == "function" && object_data[prop_key].type.name == "Object") {
        let is_schema = check_schema(object_data[prop_key], schemas)
        if(!is_schema) return false
      }
      else return false
    }
    else return false
  }
  return true
}


function isSchema(object, schema) {
  let keys_object = Object.keys(object)
  let keys_schema = Object.keys(schema).filter(f => f != "type").map(f => f)
  if(keys_schema.some(i => !keys_object.includes(i))) return false
  if(keys_object.some(e => !keys_schema.includes(e))) return false

  let object_data = object
  let schema_data = schema
  for(var x in keys_object) {
    if(typeof object_data[keys_schema[x]] != "undefined") {
      if(schema_data[keys_schema[x]].constructor.name.toLowerCase() == "function" && object_data[keys_schema[x]].constructor.name.toLowerCase() == schema_data[keys_schema[x]].constructor.name.toLowerCase()) continue
      if(isObject(schema_data[keys_object[x]])) {
        let is_schema = isSchema(object_data[keys_object[x]], schema_data[keys_schema[x]])
        if(!is_schema) return false
      }
      else {
        if(schema_data[keys_schema[x]].name.toLowerCase() != object_data[keys_object[x]].constructor.name.toLowerCase()) return false
      }
    }
    else return false
  }
  return true
}


function readBSON(path_file_name) {
  if(!fs.existsSync(path_file_name)) throw new Error(`[ERROR] El archivo ${path_file_name} no existe.`)
  var obj_data;
  try{
    let get_data = fs.readFileSync(path_file_name)
    obj_data = bson.deserialize(get_data)
  }
  catch(error) {
    throw new Error(`[ERROR] Ocurrio un problema al tratar de leer los datos del archivo ${path_file_name}, error: ${error}`)
  }
  return obj_data
}


function saveBSON(path_file_name, new_data) {
  if(!fs.existsSync(path_file_name)) throw new Error(`[ERROR] El archivo ${path_file_name} no existe.`)
  try{
    fs.writeFileSync(path_file_name, bson.serialize({arrayDB: new_data}))
    return true
  }
  catch(error) {
    return new Error(`[ERROR] Ocurrio un error al tratar de guardar los datos en el archivo ${path_file_name}, error: ${error}`)
  }
}


function buildPath(carpet, db_name) {
  let root = path.join(path.dirname(require.main.filename), carpet)
  if(!fs.existsSync(root)) {
    fs.mkdirSync(root, (err) => {
      if(err) throw new Error(`[ERROR] No se pudo crear la carpeta ${carpet} donde se almacenaran las base de datos, error: ${err}`)
      console.log(`[CREANDO DIRECTORIO] Acaba de crearse la carpeta ${carpet}, en esta carpeta se almacenaran tus base de datos`)
    })
    let default_data = {
      arrayDB: []
    }
    fs.writeFileSync(`${root}/${db_name}.bson`, bson.serialize(default_data))
  }
  else{
    if(!fs.existsSync(`${root}/${db_name}.bson`)) {
      let default_data = {
        arrayDB: []
      }
      fs.writeFileSync(`${root}/${db_name}.bson`, bson.serialize(default_data))

    }
  }
  return {
    path: path.join(root,`${db_name}.bson`)
  }
}

function cloneArray(array) {
  return array.map(i => Object.assign({}, i))
}


module.exports = {
  isObject: isObject,
  check_schema: check_schema,
  isSchema: isSchema,
  buildPath: buildPath,
  saveBSON: saveBSON,
  readBSON: readBSON,
  cloneArray: cloneArray
}
