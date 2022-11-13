#!/usr/bin/env node
import { expandPrismaFile } from '../src/prisma-include.mjs'

const fn = process.argv[2]

console.log(expandPrismaFile(fn))


