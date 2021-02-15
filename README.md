# [MySQL Workbench Exporter](https://github.com/mysql-workbench-schema-exporter/mysql-workbench-schema-exporter) / [Node Exporter](https://github.com/molaux/node-exporter) generated model loader example

This extract was written for node / ECMAScript module (with `--experimental-specifier-resolution=node`) but it is
transposable to CommonJS.

it expects the following file structure :

```
/
  .env
  package.json
  config/
    model.json
  src/
    models/
      index.js
      database1/
        extensions/
          Model2.cjs
        Model1.cjs
        Model2.cjs
        ...
      database2/
        Model1.cjs
        Model2.cjs
        ...
```

### **`model.json` example**
```json
{
  "database1": {
    "development": {
      "username": "...",
      "password": "...",
      "database": "...",
      "host": "...",
      "dialect": "...",
      "dialectOptions": {
        ...
      }
    },
    "production": {
      ...
    }
  },
  "database2": {
    "development": {
      ...
    },
    "production": {
      ...
    }
  }
}
```

### **`index.js`**
[here](index.js)

## Example
```javascript
import initModels from './models'

const databases = await initModels()

// access database1 sequelize instance
databases.database1.sequelize.sync({force: true})

// access database2 model instance
const model2s = await databases.database2.models.Model2.findAll()
```