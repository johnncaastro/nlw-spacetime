import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/memories", async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        content: memory.content,
        isPublic: memory.isPublic,
        createdAt: memory.createdAt,
      };
    });
  });

  app.get("/memories/:id", async (request, reply) => {
    // const { id } = request.params

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      createdAt: z.string(),
    });

    const { coverUrl, content, isPublic, createdAt } = bodySchema.parse(
      request.body
    );

    const memory = await prisma.memory.create({
      data: {
        coverUrl,
        content,
        isPublic,
        createdAt,
        userId: request.user.sub,
      },
    });

    return memory;
  });

  app.put("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      createdAt: z.string(),
    });

    const { coverUrl, content, isPublic, createdAt } = bodySchema.parse(
      request.body
    );

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        coverUrl,
        content,
        isPublic,
        createdAt,
      },
    });

    return memory;
  });

  app.delete("/memories/:id", async (request, reply) => {
    // const { id } = request.params

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
