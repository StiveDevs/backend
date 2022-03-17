// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { postSchema } from "../models/post";
import { createdSchema } from "./commonSchemas";

const postRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const posts = fastify.mongo.db.collection("posts");

	fastify.get("/", {
		schema: {
			tags: ["Post"],
			response: {
				200: {
					type: "array",
					items: postSchema,
				},
			},
		},
		handler: async function (request, reply) {
			return posts.find().toArray();
		},
	});

	fastify.post("/", {
		schema: {
			tags: ["Post"],
			body: postSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async function (request, reply) {
			return posts.insertOne(request.body);
		},
	});
};

export default postRoutes;
