'use strict'
import dotenv from 'dotenv'

import fs from 'fs'
import Sequelize from 'sequelize'

import configData from '../../config/model.json'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const Op = Sequelize.Op
const env = process.env.NODE_ENV || 'development'

const initModels = async () => {
  const isDirectory = source => fs.lstatSync(source).isDirectory()
  const getDirectories = source =>
    fs.readdirSync(source)
      .map(name => path.join(source, name))
      .filter(source => isDirectory(source) && source.indexOf('.') !== 0)

  const dbs = {}
  for (const dbDirName of getDirectories(__dirname)) {
    const dbName = path.basename(dbDirName)
    console.log(`Loading ${dbName} database repo...`)
    const config = Object.assign({}, {
      operatorsAliases: Op
    }, configData[dbName][env])

    let sequelize
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config)
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config)
    }

    const db = await Promise.all(fs
      .readdirSync(dbDirName)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-4) === '.cjs')
      })
      .map(async file => await Promise.all([
          import(path.join(dbDirName, file)),
          fs.existsSync(path.join(dbDirName, 'extensions', file))
            ? import(path.join(dbDirName, 'extensions', file))
            : Promise.resolve({ default: sequelize => o => o })
        ])
      )
    ).then(modules => modules.reduce((o, [ module, extend ]) => {
      const model = module.default(sequelize, extend.default(sequelize))
      return ({ ...o, [model.name]: model })
    }, {}))

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    })

    db.sequelize = sequelize

    dbs[dbName] = db
  }
  return dbs
}
export default initModels
