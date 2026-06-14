import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ActivityListQueryType } from "./activity.schema.js";
import { ActivityService } from "./activity.service.js";
import { requireUserId } from "../../utils/auth.js";
import { paginated } from "../../utils/response.js";

export class ActivityController {
  private readonly service: ActivityService;

  constructor(app: FastifyInstance) {
    this.service = new ActivityService(app);
  }

  async list(
    request: FastifyRequest<{
      Querystring: ActivityListQueryType;
    }>,
  ) {
    const userId = requireUserId(request);

    const { page, limit } = request.query;

    const result = await this.service.list(userId, page, limit);

    const totalPages = Math.ceil(result.total / limit);

    return paginated(result.rows, {
      page,
      limit,
      count: result.rows.length,
      totalItems: result.total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }
}
