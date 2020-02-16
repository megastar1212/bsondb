<div align="center">
  <h1>bsonDB</h1>
  <p>Base de datos usando bson basado en modelos.</p>
</div>

## Instalacion:

```shell
npm install bsondb --save
```

## Tabla de contenido
*   [Introduccion](#Introduccion)
*   [Schema](#Schema)
*   [Model](#Model)
    *   [`buildModel`](#buildModel)     
    *   [`findOne`](#findOne)  
    *   [`filter`](#filter)
    *   [`remove`](#remove)
*   [`save`](#save)

## Introduccion
<a name="Introduccion" />

**bsonDB** usa **bson** (valga la redundancia) y se basa en modelos **(tipos de datos)**, por ahora solo cuenta con una base de datos local pero se tiene pensado implementar una base de datos en red al igual que mas metodos.

Antes de usar esto se recomienda tener un previo conocimiento de los tipos de datos **(string, number, etc)**


## Schema
<a name="Schema" />

```js
Schema(schema)
```

Este constructor te servirá para crear SchemaTypes la cual servira como un identificador de propiedades y el tipo de valor que se almacenará.

Actualmente solo cuenta con 5 tipos de valores:

- String
- Number
- Object
- Array
- Boolean

Debes de colocar uno de estos tipos de valores en caso de que una propiedad directamente reciba un valor, en el caso de que una propiedad sea un objeto, debes de colocar la propiedad **"type"** indicando como valor **Object**, esto es obligatorio.

Parametros | Descripcion
--- | ---
`schema` | Aqui deberá de ir un **objeto** con el nombre de las propiedades y sus respectivos tipos de valores que almacenará.


Por ejemplo:

```js
const bsonDB = require("bsondb");

let SchemaNivel = new bsonDB.Schema({
  id: String,
  nivel: Number,
  xp: Number
})


//Ejemplo 2 usando mas cosas:

let SchemaPerfil = new bsonDB.Schema({
  id: String,
  nivel: Number,
  monedas: Number,
  medallas: {
    type: Object,
    cantidad: Number,
    nombres: Array
  }
})

//Ejemplo 3 usando mas cosas:

let SchemaGuild = new bsonDB.Schema({
  id: String,
  descripcion: String,
  usuarios: Number,
  canales: {
    type: Object,
    canales_texto: {
      type: Object,
      nombres: Array
    },
    canales_voz: {
      type: Object,
      nombres: Array
    }
  },
  verificado: Boolean
})
```

**Retorna** - Un Schema que sera usado en el constructor [Model](#Model)


## Model
<a name="Model" />

```js
Model(nombre_db, schema, directorio)
```

Este constructor crea la base de datos y inicializa su [Schema](#Schema) respectivo.

Parametros | Descripcion
--- | ---
`nombre_db` | Aqui deberá de ir el nombre con el cual se guardará la base de datos.
`schema` | Aqui deberás de ir el [Schema](#Schema) que usará el Modelo.
`directorio` | Aqui deberá de ir el directorio donde se guardará la base de datos, si el nombre del directorio no existe, lo que hará es crear una carpeta llamada **bsonDB** y dentro de esa carpeta estará la base de datos que indicaste en **nombre_db**



Ejemplo:

```js
const bsonDB = require("bsondb");

let SchemaNivel = new bsonDB.Schema({
  id: String,
  nivel: Number,
  xp: Number
})

//Ejemplo en el caso de que quieras exportar el Modelo (supongamos que este archivo se llama NivelSchema.js).
module.exports = new bsonDB.Model("Niveles", SchemaNivel) //No coloco nada en el tercer parametro ya que quiero que se guarde en la carpeta default "bsonDB"
//Ahora solo lo llamarias en otro archivo, exp: let NivelModel = require("./nivelSchema.js")


//Ejemplo en el caso de que quieras usarlo en el mismo archivo del Modelo.
let NivelModel = new bsonDB.Model("Niveles", SchemaNivel)
```

Esto hará que se cree un archivo llamado **Niveles.bson** en el lugar donde especificaste (recuerda no borrarlo a menos de que quieras borrar absolutamente todos los datos que contiene, tampoco es recomendable manejar el archivo manualmente)

Este constructor contiene metodos las cuales veremos a continuacion.

#### buildModel
<a name="buildModel" />

```js
buildModel(objeto)
```

Este metodo te permite crear un nuevo Modelo tomando en cuenta las propiedades y tipos de valores que especificaste en su [Schema](#Schema)

Recuerda que aqui debe ir un objeto con las mismas propiedades que colocaste en su Schema, al igual que sus tipo de valores correspondientes, ya no hace falta colocar String, Number, etc, ahora deberas de colocar los datos que se almacenaran en la base de datos.

Debes de colocar todas las propiedades que colocaste en el Schema, esto es sensitivo y respeta la cantidad, nombre y valor de todas propiedades.

Puede ocurrir un error en los siguientes casos:

- Si no colocas una propiedad (te falta una propiedad del Schema)
- Si colocas una propiedad de mas (que no se encuentra en el Schema)
- Si el tipo de valor es diferente al tipo de valor que especificaste en el Schema.

(Se mostrará un mensaje indicando que no hay coincidencia entre ambas cosas)

Esto retorna los datos convertidos(objeto), cuenta con un metodo llamado **save()** ([click_aqui](#save) para ver su funcion)

Parametros | Descripcion
--- | ---
`objeto` | Aqui deberá de ir un objeto con los datos que se mencionó arriba.


**Retorna** - El objeto y un metodo llamado [save](#save)

Ejemplo:

```js
const bsonDB = require("bsondb");

let SchemaReporte = new bsonDB.Schema({
  id: String,
  usuario: String,
  razon: String
})

let ReporteModel = new bsonDB.Model("Reportes", SchemaReporte)

let NuevoReporte = ReporteModel.buildModel({
  id: "129934939493934",
  usuario: "MegaStar",
  razon: "wapo"
})

console.log(NuevoReporte) // {id: "129934939493934", usuar...}
NuevoReporte.save()
  .then(data => console.log(data)) //Si los datos se guardaron correctamente, regresa el objeto guardado
  .catch(error => console.log(error)) //Si no se guardaron los datos (ocurrio un error)
```


#### findOne
<a name="findOne" />

```js
findOne(filtro, callback)
```

Este metodo te permite buscar un dato especifico en la base de datos, el dato encontrado puede ser modificado y guardado.

Parametros | Descripcion
--- | ---
`filtro` | Aqui deberá de ir el filtro que se usará para buscar el dato en la base de datos.
`callback` | Aqui deberá de ir una funcion con un parametro, este parametro tendra como valor el dato encontrado **(objeto)** y en el caso de que no encuentre nada regresará **undefined**


En el caso de que el parametro del callback contenga algo, podras modificar sus valores, debes de usar solo las propiedades que colocaste en el Schema, esto es sensitivo y respeta el nombre y valor de todas propiedades.

Puede ocurrir un error en los siguientes casos:

- Si creas una propiedad de mas (que no se encuentra en el Schema)
- Si el tipo de valor de la propiedad que actualizaras es diferente al tipo de valor que especificaste en el Schema.

(Se mostrará un mensaje indicando que no hay coincidencia entre ambas cosas)

El valor del parametro del callback cuenta con un metodo llamado **save()** ([click_aqui](#save) para ver su funcion)

Ejemplo:

```js
const bsonDB = require("bsondb");

//Creamos el Schema para el Nivel
let SchemaNivel = new bsonDB.Schema({
  id: String,
  nivel: Number,
  xp: Number
})

//Creamos la base de datos y inicializamos su schema (SchemaNivel)
let NivelModel = new bsonDB.Model("Niveles", SchemaNivel)

let randomxp = Math.floor(Math.random() * 10) + 1

NivelModel.findOne((f) => f.id == "algunaID", (datos) => {
  if(!datos) { //Creamos un Modelo si no se encontró nada
    let NuevoModelo = NivelModel.buildModel({
      id: "algunaID",
      nivel: 1,
      xp: randomxp
    })
    NuevoModelo.save().catch(error => console.log(error)) //Lo guardamos en la base de datos
  }
  else { //Si se encontró
    if((datos.xp+randomxp) >= 30) { //Le subimos +1 nivel
      datos.nivel = datos.nivel + 1 //Le damos +1 a su nivel
      datos.xp = 0 //Actualizamos su xp a 0
      datos.save() //Guardamos los cambios en la base de datos
      .then(nuevo_dato => console.log(`Subiste al nivel ${nuevo_dato.nivel}!`))
      .catch(error => console.log(error))
    }
    else { //Si el xp ganado no es suficiente para subir de nivel, solo le aumentamos el xp
      datos.xp = datos.xp + randomxp
      datos.save().catch(error => console.log(error)) //Guardamos los cambios en la base de datos
    }
  }
})
```


#### filter
<a name="filter" />

```js
filter(filtro, callback)
```

Este metodo te permite buscar todos los datos que coincidan con lo que especificaste en el filtro.

Esto retorna un **Array** con los objetos encontrados, de lo contrario(si no encuentra nada) retorna **undefined**.

Parametros | Descripcion
--- | ---
`filtro` | Aqui deberá de ir el filtro que se usará para buscar los datos en la base de datos.
`callback` | Aqui deberá de ir una funcion con un parametro, este parametro tendra como valor los datos encontrados **(Array)** y en el caso de que no encuentre nada regresará **undefined**


Ejemplo:

```js
NivelModel.filter((f) => f.nivel > 1, (datos) => { //El filtro quiere decir que obtendra todos los datos que contengan un nivel mayor a 1
  if(!datos) { //Si no se encontró nada
    console.log("No se encontró nada.")
  }
  else { //Si se encontró [{...},{...},{...}...]
    let usuarios = []
    for(var x = 0; x < datos.length; x++) {
      usuarios.push(`ID: ${datos[x].id}, Nivel: ${datos[x].nivel}, Xp: ${datos[x].xp}`)
    }
    console.log(usuarios.join("\n"))
  }
})
```


#### remove
<a name="remove" />

```js
remove(filtro, callback)
```

Este metodo te permite eliminar un dato(que coincida con el filtro que especificaste) de la base de datos.

Esto retorna el dato eliminado **objeto**, de lo contrario(si no encuentra nada) retorna **undefined**.

Parametros | Descripcion
--- | ---
`filtro` | Aqui deberá de ir el filtro que se usará para buscar y eliminar el datos en la base de datos.
`callback` | Aqui deberá de ir una funcion con un parametro, este parametro tendra como valor el dato eliminado **(objeto)** y en el caso de que no encuentre nada regresará **undefined**


Ejemplo:

```js
NivelModel.remove((f) => f.id == "algunaID", (eliminado) => {
  if(!datos) { //si no se encontró nada
    console.log("No se encontró nada.")
  }
  else { //Si se encontró y se eliminó
    console.log(`Se eliminó los datos del ID ${eliminado.id}, su nivel era: ${eliminado.nivel}`)
  }
})
```

#### save
<a name="save" />

```js
save()
```

Este metodo solo funciona en el valor de retorno del metodo [buildModel](#buildModel) y [findOne](#findOne).

Esto sirve para guardar los nuevos datos y los datos actualizados.

Esto retorna una promesa con el objeto actualizado, en el caso de que ocurra un error retornara el error.

Ejemplo:

```js
<>.save().then(nuevos_datos => console.log(nuevos_datos)).catch(error => console.log(error))
```
