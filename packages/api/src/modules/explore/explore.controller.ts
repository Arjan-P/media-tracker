import type { FastifyRequest } from "fastify";
import { ExploreService } from "./explore.service.js";
import { ok, paginated } from "../../utils/response.js";
import type { SearchQueryType, GetByIdParamsType } from "./explore.schema.js";

const service = new ExploreService();

export class ExploreController {
  search = async (
    request: FastifyRequest<{ Querystring: SearchQueryType }>,
  ) => {
    const { page, limit, ...rest } = request.query;
    const result = await service.search({ page, limit, ...rest });
    return paginated(result.items, {
      page,
      limit,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / limit),
      hasNextPage: page * limit < result.totalItems,
      hasPreviousPage: page > 1,
    });
  };

  getById = async (
    request: FastifyRequest<{ Querystring: GetByIdParamsType }>,
  ) => {
    const { type, providerId } = request.query;
    const item = await service.getById(type, providerId);
    return ok(item);
  };
}
