<div align="center">
  <h1>bsonDB</h1>
  <p>Base de datos usando bson basado en modelos.</p>
</div>

# Instalación:
```shell
npm install bsondb --save
```

# Tabla de Contenidos
* [Introducción](#Introducción)
* [Documentación](#Documentación)
  * [Schema](#Schema)
  * [Model](#Model)
    * [buildModel](#buildModel)
		 * [`save`](#save)
    * [`findOne`](#findOne)
    * [`filter`](#filter)
    * [`remove`](#remove)
* [Notas](#Notas)

# Introducción
<a name="Introducción"></a>

**bsonDB** usa JSON binario y se desarrolla entorno a modelos **(estructuras lógicas)** para realizar acciones dentro de la base de datos.
Por ahora sólo cuenta con bases de datos locales pero se tiene pensado implementar una base de datos en red al igual que implementar más métodos.

**Antes de usar bsonDB se recomienda tener conocimiento sobre los [tipos de datos primitivos de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures).**

# Documentación
<a name="Documentación"></a>

A continuación está la documentación de bsonDB. Para poder explicar de mejor manera la documentación, se asumirá que usted tiene definido a bsonDB así:

```js
const DB = require('bsondb');
```

## **Schema**
<a name="Schema"></a>

```js
new DB.Schema(schema);
```

Este constructor crea la estructura (propiedades y tipos de valores[*](#TDV) de éstas) de los datos que se almacenarán.

| Parametro | Tipo | Opcional | Descripción |
| :---: | :-----: | :---: | :--- |
| **`schema`** | Object | No | Un **objeto** con el nombre de las propiedades y sus respectivos tipos de valores que almacenará. |




### **Ejemplos**

```js
const DB = require('bsondb');

let SchemaNivel = new DB.Schema({
  id: String,
  nivel: Number,
  xp: Number
});
```
```js
const DB = require('bsondb');

let SchemaPerfil = new DB.Schema({
  id: String,
  nivel: Number,
  monedas: Number,
  medallas: {
    type: Object,
    cantidad: Number,
    nombres: Array
  }
});
```
```js
const DB = require('bsondb');

let SchemaGuild = new DB.Schema({
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
});
```

**@ Valor de Retorno** ── Un Schema que sera usado en el constructor [Model](#Model).


## **Model**
<a name="Model"></a>

```js
new DB.Model(nombreDB, schema, directorio)
```

Este constructor crea un modelo que se utilizará para guardar (o hacer cualquier otra acción) en/con la base de datos con su [Schema](#Schema) (estructura) respectivo.

| Parametro | Tipo | Opcional | Descripción |
| :---: | :---: | :---: | :--- |
| `nombreDB` | String | No | Nombre de la base de datos. |
| `schema` | [Schema](#Schema) | No | El [Schema](#Schema) que usará el modelo. |
| `directorio` | String | Sí | Nombre del directorio donde se guardará la base de datos. Si el directorio no existe, se creará una carpeta llamada **bsonDB** y dentro de esa carpeta estará la base de datos que indicaste en **nombreDB**. |

### **Ejemplo**

```js
const DB = require('bsondb');

let SchemaNivel = new DB.Schema({
  id: String,
  nivel: Number,
  xp: Number
});

// Si quieres exportar el modelo.
module.exports = new DB.Model('Niveles', SchemaNivel);

// Si quieres utilizarlo dentro del mismo archivo.
const NivelModel = new DB.Model('Niveles', SchemaNivel);

/**
 * Se creará un archivo llamado "Niveles.bson" en la carpeta que especificaste.
 * Si no especificaste una carpeta, se guardará en la carpeta "bsonDB".
 * /
```

**@ Valor de Retorno** ── Una clase con los métodos que se verán a continuación.

### Model#buildModel
<a name="buildModel"></a>

```js
Model.buildModel(objeto);
```

Crea un nuevo modelo basado en las propiedades y tipos de valores que especificaste en su [Schema](#Schema).
El objeto tiene que tener las mismas propiedades que hay en el Schema del modelo, y los valores de las propiedades tienen que tener el mismo tipo de valor especificado en el Schema.

Puede ocurrir un error en los siguientes casos:

- No colocas una(s) propiedad(es) del Schema.
- Colocas una(s) propiedad(es) extra(s) (que no están en el Schema).
- Si el tipo de valor de una propiedad es diferente al tipo de valor que especificaste en el Schema.

| Parametro | Tipo | Opcional | Descripción |
| :---: | :---: | :---: | :--- |
| `objeto` | Object | No | Un objeto basado en el Schema. |


### **Ejemplo**

```js
const DB = require('bsondb');

let SchemaReporte = new DB.Schema({
  id: String,
  usuario: String,
	razon: String,
	autor: {
		type: Object,
		id: String,
		usuario: String
	}
});

const ReporteModel = new DB.Model('Reportes', SchemaReporte);

let NuevoReporte = ReporteModel.buildModel({
	id: '292092693377712128',
	usuario: 'MegaStar',
	razon: 'wapo',
	autor: {
		id: '372466760848244736',
		usuario: 'iBisho'
	}
});

console.log(NuevoReporte); // { id: "292092693377712128", usuario... }
```

**@ Valor de Retorno** ── El objeto creado con un método [`save`](#Save).

### **Modelo#save()**
<a name="save"></a>

```js
Modelo.save();
```

Sirve para guardar o actualizar datos en la base de datos. Sólo funciona en el valor de retorno del métodos [Model#buildModel](#buildModel) y [Model#findOne](#findOne).

#### **Ejemplo**

```js
const DB = require('bsondb');

let SchemaReporte = new DB.Schema({
  id: String,
  usuario: String,
	razon: String,
	autor: {
		type: Object,
		id: String,
		usuario: String
	}
});

const ReporteModel = new DB.Model('Reportes', SchemaReporte);

let NuevoReporte = ReporteModel.buildModel({
	id: '292092693377712128',
	usuario: 'MegaStar',
	razon: 'wapo',
	autor: {
		id: '372466760848244736',
		usuario: 'iBisho'
	}
});

NuevoReporte.save()
  .then(data => console.log(data)) // Regresa el objeto guardado.
  .catch(error => console.log(error)); // Si no se guardaron los datos y hubo un error.
```

**@ Promesa**
**@ Valor de Retorno** ── Promesa. Si los datos fueron guardados correctamente, retorna los datos guardados (then). Si ocurrió un error, retorna un error (catch).

### Model#findOne
<a name="findOne"></a>

```js
Model.findOne(filtro, callback);
```

Este metodo te permite buscar un dato especifico en la base de datos, el dato encontrado puede ser modificado y guardado.

| Parametro | Tipo | Opcional | Descripcion |
| :---: | :---: | :---: | :--- |
| `filtro` | Function | No | El filtro que se usará para buscar el modelo en la base de datos. |
| `callback` | Function | No | Una función que se usará cuando se complete la búsqueda, tiene sólo 1 argumento. Si se encontró el modelo, el argumento será los datos del modelo. En el caso contrario será **undefined**. |

Puedes modificar los valores del objeto retornado (si es que hay) del callback, pero sólo las que hay en el Schema, respetando los tipos de valores y propiedades.

Puede ocurrir un error en los siguientes casos:

- Creas una(s) propiedad(es) extra(s) (que no están en el Schema)
- El tipo de valor de la propiedad que actualizas es diferente al tipo de valor que especificaste en el Schema.

El valor del argumento del callback cuenta con el método [**`save()`**](#save).

#### **Ejemplo**

```js
const DB = require('bsondb');

let SchemaNivel = new DB.Schema({
  id: String,
  nivel: Number,
  xp: Number
});

let NivelModel = new DB.Model('Niveles', SchemaNivel)
let randomXP = Math.floor(Math.random() * 10) + 1;

NivelModel.findOne((modelo) => modelo.id == 'algunaID', (datos) => {
  // Creamos el modelo si no se encontró nada.
  if (!datos) {
    let NuevoModelo = NivelModel.buildModel({
      id: 'algunaID',
      nivel: 1,
      xp: randomxp
    });
		
    NuevoModelo.save().catch(error => console.log(error)); // Lo guardamos en la base de datos.
  //Si se encontró.
  } else {
    if ((datos.xp + randomxp) >= 30) {
      ++datos.nivel; //Le damos +1 a su nivel.
      datos.xp = 0; //Actualizamos su xp a 0.
      datos.save(); //Guardamos los cambios en la base de datos.
        .then(nuevosDatos => console.log(`¡Subiste al nivel ${nuevosDatos.nivel}!`))
        .catch(error => console.log(error));
    //Si el xp ganado no es suficiente para subir de nivel, sólo le aumentamos el xp.
    } else {
      datos.xp += randomxp;
      datos.save().catch(error => console.log(error)) //Guardamos los cambios en la base de datos.
    }
  }
});
```

**@ Valor de Retorno** ── Nada, es un callback.

### Model#filter
<a name="filter"></a>

```js
Model.filter(filtro, callback)
```

Busca todos los modelos que coincidan con lo que especificaste en el filtro.

| Parametro | Tipo | Opcional | Descripcion |
| :---: | :---: | :---: | :--- |
| `filtro` | Function | No | El filtro que se usará para buscar los modelos en la base de datos. |
| `callback` | Function | No | Una función que se usará cuando se complete la búsqueda, tiene sólo 1 argumento. Si se encontraron modelos, el argumento será un **Array** de modelos coincidentes. En el caso contrario será **undefined**.

Cada modelo dentro del Array cuenta con el método [`save`](#save).

#### **Ejemplo**

```js
NivelModel.filter((modelo) => modelo.nivel > 1, (datos) => { // Filtra niveles mayores a 1.
  // Si no se encontró nada.
  if (!datos) {
    console.log('No se encontró nada.');
  } else { // Si se encontró. ([{...},{...},{...},...])
    let usuarios = [];
    for (let x = 0; x < datos.length; x++) {
      usuarios.push(`ID: ${datos[x].id}, Nivel: ${datos[x].nivel}, XP: ${datos[x].xp}`);
    }
    console.log(usuarios.join("\n"));
  }
});
```

**@ Valor de Retorno** ── Nada, es un callback.

### Model#remove
<a name="remove"></a>

```js
Model.remove(filtro, callback);
```

Elimina un modelo (que coincida con el filtro) de la base de datos.

| Parametro | Tipo | Opcional | Descripcion |
| :---: | :---: | :---: | :--- |
| `filtro` | Function | No | El filtro que se usará para buscar el modelo en la base de datos. |
| `callback` | Function | No | Una función que se usará cuando se complete la búsqueda, tiene sólo 1 argumento. Si se encontró un modelo, el argumento será el modelo eliminado. En el caso contrario será **undefined**.


#### **Ejemplo**

```js
NivelModel.remove((modelo) => modelo.id == 'algunaID', (eliminado) => {
  // Si no se encontró nada.
  if (!eliminado) {
    console.log('No se encontró nada para borrar.');
  // Si se encontró y se eliminó.
  } else {
    console.log(`Se eliminó el modelo con ID ${eliminado.id}, su nivel era: ${eliminado.nivel}`);
  }
})
```
**@ Valor de Retorno** ── Nada, es un callback.