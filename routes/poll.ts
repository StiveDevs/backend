// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { checkIdsHandler } from "../handlers/commonHandlers";
import {
	addPollOptionHandler,
	createPollHandler,
	deletePollHandler,
	getPollHandler,
	getPollsHandler,
	removePollOptionHandler,
} from "../handlers/poll";
import {
	createdSchema,
	deletedSchema,
	modifiedSchema,
} from "../schemas/commonSchemas";
import { pollCreateSchema, pollSchema } from "../schemas/poll";

const pollRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const polls = fastify.mongo.db.collection("polls");
	const options = fastify.mongo.db.collection("options");

	fastify.addHook("onRequest", async (request, reply) => {
		await checkIdsHandler(fastify, request, polls, options);
	});

	fastify.get("/", {
		schema: {
			summary: "Get details of all the polls",
			tags: ["Poll"],
			response: {
				200: {
					type: "array",
					items: pollSchema,
					description: "List of all the polls",
				},
			},
		},
		handler: async (request, reply) =>
			getPollsHandler(request, reply, polls),
	});

	fastify.get("/:pollId", {
		schema: {
			summary: "Get details of a single poll",
			tags: ["Poll"],
			response: {
				200: pollSchema,
			},
		},
		handler: async (request, reply) =>
			getPollHandler(request, reply, polls),
	});

	fastify.post("/", {
		schema: {
			summary: "Create a new poll",
			tags: ["Poll"],
			body: pollCreateSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(201);
			return createPollHandler(request, reply, polls, options);
		},
	});

	fastify.patch("/:pollId/add/option/:optionId", {
		schema: {
			summary:
				"Add option to the list of options availaible for the poll",
			tags: ["Poll"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(204);
			return addPollOptionHandler(request, reply, polls);
		},
	});

	fastify.delete("/:pollId", {
		schema: {
			summary: "Delete the poll and its options",
			tags: ["Poll"],
			response: {
				204: deletedSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(204);
			return deletePollHandler(request, reply, polls, options);
		},
	});

	fastify.patch("/:pollId/remove/option/:optionId", {
		schema: {
			summary:
				"Remove option from the list of options availaible for the poll",
			tags: ["Poll"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(204);
			return removePollOptionHandler(request, reply, polls);
		},
	});
};

export default pollRoutes;
