// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { postCreateSchema, postSchema } from "../schemas/post";
import {
	createdSchema,
	deletedSchema,
	modifiedSchema,
} from "../schemas/commonSchemas";
import { checkIdsHandler } from "../handlers/commonHandlers";
import {
	addPostPollHandler,
	createPostHandler,
	deletePostHandler,
	getPostHandler,
	getPostsHandler,
	removePostPollHandler,
} from "../handlers/post";

const postRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const posts = fastify.mongo.db.collection("posts");
	const polls = fastify.mongo.db.collection("polls");
	const options = fastify.mongo.db.collection("options");

	fastify.addHook("onRequest", async (request, reply) => {
		await checkIdsHandler(fastify, request, posts, polls, options);
	});

	fastify.get("/", {
		schema: {
			summary: "Get details of all the posts",
			tags: ["Post"],
			response: {
				200: {
					type: "array",
					items: postSchema,
					description: "List of all the posts",
				},
			},
		},
		handler: async (request, reply) =>
			getPostsHandler(request, reply, posts),
	});

	fastify.get("/:postId", {
		schema: {
			summary: "Get details of a single post",
			tags: ["Post"],
			response: {
				200: postSchema,
			},
		},
		handler: async (request, reply) =>
			getPostHandler(request, reply, posts),
	});

	fastify.post("/", {
		schema: {
			summary: "Create a new post",
			tags: ["Post"],
			body: postCreateSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async (request, reply) =>
			createPostHandler(request, reply, posts, polls, options),
	});

	fastify.patch("/:postId/add/poll/:pollId", {
		schema: {
			summary: "Add poll to the list of polls attached with the post",
			tags: ["Post"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			addPostPollHandler(request, reply, posts),
	});

	fastify.delete("/:postId", {
		schema: {
			summary: "Delete the post along with its polls and options",
			tags: ["Post"],
			response: {
				204: deletedSchema,
			},
		},
		handler: async (request, reply) =>
			deletePostHandler(request, reply, posts, polls, options),
	});

	fastify.patch("/:postId/remove/poll/:pollId", {
		schema: {
			summary:
				"Remove poll from the list of polls attached with the post",
			tags: ["Post"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			removePostPollHandler(request, reply, posts),
	});
};

export default postRoutes;
