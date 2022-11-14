# prisma-include
a prisma file preprocessor cli that imports model and mixins fields by @import and @include comments.
### prisma/mixins.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model base {
  ///@abstract
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)
  @@index(ctime)
}

model user {
  ///@include(base)
  name String @unique @default("1") @db.VarChar(10)
}

model user2 {
  ///@include(user)
  name2 String @unique @default("2") @db.VarChar(20)
}
```
### prisma/schema.include.prisma
```prisma
///@import {user, user2, base} from "prisma/mixins.prisma"

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model profile {
  ///@include(user)
  email String @unique @default("") @db.VarChar(100)
}

model profile2 {
  ///@include(profile)
  email2 String @unique @default("2") @db.VarChar(200)
}

model profile3 {
  ///@include(base)
  email3 String @unique @default("3") @db.VarChar(300)
}
```
then run command `prisma-include prisma/schema.include.prisma > prisma/schema.prisma` get:
### prisma/schema.prisma
```prisma
///@import {user, user2, base} from "prisma/mixins.prisma"

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model user {
  ///@include(base)
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)
  name  String    @unique @default("1") @db.VarChar(10)
}

model user2 {
  ///@include(user)
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)
  name  String    @unique @default("1") @db.VarChar(10)
  name2 String    @unique @default("2") @db.VarChar(20)
}

model profile {
  ///@include(user)
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)
  name  String    @unique @default("1") @db.VarChar(10)
  email String    @unique @default("") @db.VarChar(100)
}

model profile2 {
  ///@include(profile)
  id     Int       @id @default(autoincrement())
  ctime  DateTime? @default(now()) @db.Timestamptz(0)
  name   String    @unique @default("1") @db.VarChar(10)
  email  String    @unique @default("") @db.VarChar(100)
  email2 String    @unique @default("2") @db.VarChar(200)
}

model profile3 {
  ///@include(base)
  id     Int       @id @default(autoincrement())
  ctime  DateTime? @default(now()) @db.Timestamptz(0)
  email3 String    @unique @default("3") @db.VarChar(300)
}

```
# install
```sh
npm i @xiangnanscu/prisma-include
```
# usage
prisma-include [filename]
```
prisma-include in.prisma > out.prisma
```
you can add a `prisma` script in your `package.json` like this:
```
"prisma": "prisma-include prisma/schema.include.prisma > prisma/schema.prisma",
```