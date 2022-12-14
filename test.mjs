import {expandPrismaString} from './src/prisma-include.mjs'


console.log(expandPrismaString(`
model base {
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)

  @@index([dwmc])
}

model user {
  ///@include(base)
  name String? @unique @default("") @db.VarChar(10)
}

`))