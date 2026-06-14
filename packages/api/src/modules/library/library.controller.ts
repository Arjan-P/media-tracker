import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LibraryService } from "./library.service.js";
import {
  AddMediaBodyType,
  ListQueryType,
  UpdateMediaBodyType,
} from "./library.schema.js";

import { requireUserId } from "../../utils/auth.js";
import { ok, paginated } from "../../utils/response.js";
import { NotFoundError } from "../../errors/http.errors.js";
import { ActivityType } from "@media-tracker/shared";

export class LibraryController {
  private readonly service: LibraryService;

  constructor(private readonly app: FastifyInstance) {
    this.service = new LibraryService(app);
  }

  async addMedia(
    request: FastifyRequest<{ Body: AddMediaBodyType }>,
    reply: FastifyReply,
  ) {
    const userId = requireUserId(request);
    const item = await this.service.addMedia(userId, request.body);
    const response = ok(item);
    return reply.status(201).send(response);
  }

  async stats(request: FastifyRequest) {
    const userId = requireUserId(request);
    const result = await this.service.getStats(userId);
    return ok(result);
  }

  async updateMedia(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateMediaBodyType;
    }>,
  ) {
    const userId = requireUserId(request);
    const item = await this.service.updateMedia(
      request.params.id,
      userId,
      request.body,
    );

    if (!item) {
      throw new NotFoundError("Media Item not found in library");
    }

    return ok(item);
  }

  async getOne(request: FastifyRequest<{ Params: { id: string } }>) {
    const userId = requireUserId(request);
    const item = await this.service.getById(request.params.id, userId);

    if (!item) {
      throw new NotFoundError("Media Item not found in library");
    }

    return ok(item);
  }

  async list(request: FastifyRequest<{ Querystring: ListQueryType }>) {
    const userId = requireUserId(request);
    const result = await this.service.list(userId, request.query);

    const page = request.query.page;
    const limit = request.query.limit;
    const totalItems = result.total;

    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      count: result.rows.length,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return paginated(result.rows, pagination);
  }

  async remove(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = requireUserId(request);
    const deleted = await this.service.remove(request.params.id, userId);

    if (!deleted) {
      throw new NotFoundError("Media Item not found in library");
    }

    return reply.code(204).send();
  }
}
