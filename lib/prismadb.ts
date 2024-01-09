//! We create this lib because next.js have a hot reload in development whenever a save a file or changes on the project it will run the hot reload and everytime our next app will hot reload it will create many prisma client instance it will overload

import { PrismaClient } from '@prisma/client'

//! The reason we store it in (globalThis) is because (globalThis) is not affected by hot reload
declare global {
  var prisma: PrismaClient | undefined
}

//! if the hor reload will fire on the next changes on the project it will check if it has (PrismaClient) already initialized in globalThis and then it's going to use (gloablThis.prisma) otherwise if we are running it for the first time it's going to just initialize a single (new PrismaClient)
export const prismadb = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb
