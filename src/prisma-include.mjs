import fs from "fs"
import { getSchema, printSchema } from '@mrleebo/prisma-ast'


const importStementPattern = /^\s*\/\/\/\s*@import\s+{\s*(.+)\s*}\s+from\s+"(.+)"\s*$/
const includeStatementPattern = /^\s*\/\/\/\s*@include\(\s*(.+)\s*\)\s*$/
const copy = o => JSON.parse(JSON.stringify(o))
const loger = (e) => console.log(JSON.stringify(e))
const readSchema = (path) => getSchema(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }))

const getNativeFieldsMap = (schema) => {
  return Object.fromEntries(schema.list.filter(node => node.type == 'model').map(node => [node.name, node.properties.filter(e => e.type == 'field')]))
}
const getFieldsArrayFromImport = (commentText) => {
  const [_, nameToken, pathToken] = importStementPattern.exec(commentText)
  const schema = readSchemaWithInclude(pathToken)
  const importMap = getFieldsMap(schema)
  const names = nameToken.split(',').map(e => e.trim())
  return names.map(name => [name, importMap[name]])
}
const getImportFieldsMap = (schema) => {
  const comments = schema.list.filter(node => node.type === "comment" && importStementPattern.exec(node.text)).map(e => e.text)
  return Object.fromEntries(comments.flatMap(line => getFieldsArrayFromImport(line)))
}


const getFieldsMap = (schema) => {
  return { ...getNativeFieldsMap(schema), ...getImportFieldsMap(schema) }
}

const readSchemaWithInclude = (path) => {
  return expandInclude(readSchema(path))
}

const expandInclude = (schema) => {
  const fieldsMap = getFieldsMap(schema)
  for (const model of schema.list.filter(node => node.type == 'model')) {
    const newProps = []
    for (let i = 0; i < model.properties.length; i++) {
      const e = model.properties[i];
      if (e.type == 'comment' && e.text.match(includeStatementPattern)) {
        const [_, includeNameToken] = includeStatementPattern.exec(e.text)
        const names = includeNameToken.split(',').map(e => e.trim())
        newProps.push(e, ...names.flatMap(name => fieldsMap[name]))
      } else {
        newProps.push(e)
      }
    }
    model.properties = newProps
  }
  return schema
}

const prismaInclude = (source) => {
  return printSchema(expandInclude(getSchema(source)))
}

const expandPrismaFile = (path) => {
  return printSchema(readSchemaWithInclude(path))
}
export { prismaInclude, expandPrismaFile }

