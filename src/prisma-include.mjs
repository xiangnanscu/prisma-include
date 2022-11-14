import fs from "fs"
import { getSchema, printSchema } from '@mrleebo/prisma-ast'


const importStementPattern = /^\s*\/\/\/\s*@import\s+{\s*(.+)\s*}\s+from\s+"(.+)"\s*$/
const includeStatementPattern = /^\s*\/\/\/\s*@include\(\s*(.+)\s*\)\s*$/
const abstractStatementPattern = /^\s*\/\/\/\s*@abstract\s*$/
const copy = o => JSON.parse(JSON.stringify(o))
const loger = (e) => console.log(JSON.stringify(e))
const readSchemaFromPath = (path) => getSchema(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }))
const isImportComment = node => node.type == 'comment' && importStementPattern.exec(node.text)
const getNativeModelMap = (schema) => {
  return Object.fromEntries(schema.list.filter(node => node.type == 'model').map(model => [model.name, model]))
}
const getModelArrayFromImport = (commentText) => {
  const [_, nameToken, pathToken] = importStementPattern.exec(commentText)
  const schema = importSchemaPath(pathToken)
  const importModels = getModelMap(schema)
  const names = nameToken.split(',').map(e => e.trim())
  return names.map(name => [name, importModels[name]])
}
const getImportModelMap = (schema) => {
  const comments = schema.list.filter(isImportComment).map(e => e.text)
  return Object.fromEntries(comments.flatMap(line => getModelArrayFromImport(line)))
}


const getModelMap = (schema) => {
  return { ...getNativeModelMap(schema), ...getImportModelMap(schema) }
}

// const readSchemaWithInclude = (path) => {
//   return expandSchemaWithInclude(readSchemaFromPath(path))
// }

const expandSchemaWithInclude = (schema) => {
  const models = getModelMap(schema)
  for (const model of schema.list.filter(node => node.type == 'model')) {
    const newProps = []
    for (let i = 0; i < model.properties.length; i++) {
      const e = model.properties[i];
      if (e.type == 'comment' && e.text.match(includeStatementPattern)) {
        const [_, includeNameToken] = includeStatementPattern.exec(e.text)
        const names = includeNameToken.split(',').map(e => e.trim())
        newProps.push(e, ...names.flatMap(name => models[name].properties.filter(e => e.type == 'field')))
      } else {
        newProps.push(e)
      }
    }
    model.properties = newProps
  }
  return schema
}

const markSchemaWithAbstract = (schema) => {
  for (const model of schema.list.filter(node => node.type == 'model')) {
    for (let i = 0; i < model.properties.length; i++) {
      const e = model.properties[i];
      if (e.type == 'comment' && e.text.match(abstractStatementPattern)) {
        model.abstract = true
        break
      }
    }
  }
  return schema
}


const replaceImportWithModel = (schema) => {
  const importList = []
  for (const [i, node] of schema.list.entries()) {
    if (isImportComment(node)) {
      const modelsArray = getModelArrayFromImport(node.text)
      for (const [name, model] of modelsArray) {
        if (!model.abstract) {
          importList.push(model)
        }
      }
    }
  }
  const firstModelIndex = schema.list.findIndex(e => e.type == 'model')
  schema.list.splice(firstModelIndex, 0, ...importList)
  return schema
}
const resolveSchema = (schema) => {
  return replaceImportWithModel(expandSchemaWithInclude(markSchemaWithAbstract(schema)))
}
const importSchemaSource = (source) => {
  return resolveSchema(getSchema(source))
}

const importSchemaPath = (path) => {
  return resolveSchema(readSchemaFromPath(path))
}

const expandPrismaFile = (path) => {
  return printSchema(importSchemaPath(path))
}

const expandPrismaString = (source) => {
  return printSchema(importSchemaSource(source))
}

export { expandPrismaString, expandPrismaFile }

