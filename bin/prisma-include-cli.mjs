#!/usr/bin/env node
import { expandPrismaFile } from '../src/prisma-include.mjs'

const path = process.argv[2]

console.log(expandPrismaFile(path))


