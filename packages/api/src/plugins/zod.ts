import fp from "fastify-plugin";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from "@fastify/type-provider-zod";

export const zodPlugin = fp(async (fastify) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.withTypeProvider<ZodTypeProvider>();
});
