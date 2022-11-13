# prisma-include
a prisma file preprocessor cli that mixins fields by @import and @include comments.
## prisma/mixins.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model base {
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)
}

model user {
  ///@include(base)
  name String @unique @default("") @db.VarChar(10)
}
```
## prisma/schema.include.prisma
```prisma
///@import {user} from "prisma/mixins.prisma"

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
```
## prisma-include prisma/schema.include.prisma > prisma/schema.prisma
```prisma
///@import {base, user} from "prisma/mixins.prisma"

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model profile {
  ///@include(user)
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)
  name  String    @unique @default("") @db.VarChar(10)
  email String    @unique @default("") @db.VarChar(100)
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