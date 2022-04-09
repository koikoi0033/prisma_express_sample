import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const taro = await prisma.user.upsert({
    where: { email: "taro@example.com" },
    update: {},
    create: {
      email: "taro@example.com",
      name: "taro",
    },
  })

  const jiro = await prisma.user.upsert({
    where: { email: "jiro@example.com" },
    update: {},
    create: {
      email: "jiro@example.com",
      name: "jiro",
    },
  })
  console.log({ taro, jiro })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
