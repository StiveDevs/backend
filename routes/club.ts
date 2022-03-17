// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { clubSchema } from "../models/club";
import { createdSchema } from "./commonSchemas";

const clubRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const clubs = fastify.mongo.db.collection("clubs");

	fastify.get("/", {
		schema: {
			tags: ["Club"],
			response: {
				200: {
					type: "array",
					items: clubSchema,
				},
			},
		},
		handler: async function (request, reply) {
			return clubs.find().toArray();
		},
	});

	fastify.post("/", {
		schema: {
			tags: ["Club"],
			body: clubSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async function (request, reply) {
			return clubs.insertOne(request.body);
		},
	});
};

export default clubRoutes;
