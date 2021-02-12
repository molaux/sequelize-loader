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
      repository1/
        extensions/
          Model2.cjs
        Model1.cjs
        Model2.cjs
        ...
      repository2/
        Model1.cjs
        Model2.cjs
        ...
```

### **`model.json` example**
```json
{
  "repository1": {
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
  "repository2": {
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
import buildDatabasesRepositories from './models'

const databases = await buildDatabasesRepositories()

// access repository1 sequelize instance
databases.repository1.sequelize.sync({force: true})

// access repository2 model instance
const model2s = await databases.repository2.Model2.findAll()
```