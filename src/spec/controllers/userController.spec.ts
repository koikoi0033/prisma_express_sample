import resetDatabase from "../utils/resetDatabase"
import supertest from "supertest"
import app from "../../app"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

describe("userController", () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe("GET /users", () => {
    test("正常系", async () => {
      await prisma.user.create({ data: { id: 1, name: `テスト 太郎`, email: `taro.test@example.com` } })
      await prisma.user.create({ data: { id: 2, name: `テスト 次郎`, email: `jiro.test@example.com` } })
      const response = await supertest(app).get("/users")
      expect(response.status).toBe(200)
      expect(response.body.users.length).toBe(2)
    })
  })
  describe("GET /users/:id", () => {
    test("正常系", async () => {
      const user = await prisma.user.create({ data: { id: 1, name: `テスト 太郎`, email: `taro.test@example.com` } })
      const response = await supertest(app).get("/users/1")
      expect(response.status).toBe(200)
      expect(response.body.user).toEqual(user)
    })
  })

  describe("PUT /users/:id", () => {
    test("正常系", async () => {
      await prisma.user.create({ data: { id: 1, name: `テスト 太郎`, email: `taro.test@example.com` } })

      const requestBody = { name: `テスト 次郎`, email: `jiro.test@example.com` }
      const response = await supertest(app).put("/users/1").send(requestBody)
      expect(response.status).toBe(200)
      expect(response.body.user.name).toEqual(requestBody.name)
      expect(response.body.user.email).toEqual(requestBody.email)

      const user = await prisma.user.findUnique({ where: { id: 1 } })
      expect(user?.name).toEqual("テスト 次郎")
      expect(user?.email).toEqual("jiro.test@example.com")
    })
  })

  describe("DELETE /users/:id", () => {
    test("正常系", async () => {
      await prisma.user.create({ data: { id: 1, name: `テスト 太郎`, email: `taro.test@example.com` } })
      const response = await supertest(app).delete("/users/1")
      expect(response.status).toBe(200)

      const users = await prisma.user.findMany()
      expect(users.length).toBe(0)
    })
  })
})
