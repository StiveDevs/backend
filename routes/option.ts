// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { checkIdsHandler } from "../handlers/commonHandlers";
import {
	addOptionSelectedByHandler,
	createOptionHandler,
	deleteOptionHandler,
	getOptionHandler,
	getOptionsHandler,
	removeOptionSelectedByHandler,
} from "../handlers/option";
import {
	createdSchema,
	deletedSchema,
	modifiedSchema,
} from "../schemas/commonSchemas";
import { optionCreateSchema, optionSchema } from "../schemas/option";

const optionRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const options = fastify.mongo.db.collection("options");
	const students = fastify.mongo.db.collection("students");

	fastify.addHook("onRequest", async (request, reply) => {
		await checkIdsHandler(fastify, request, options, students);
	});

	fastify.get("/", {
		schema: {
			summary: "Get details of all the options",
			tags: ["Option"],
			response: {
				200: {
					type: "array",
					items: optionSchema,
					description: "List of all the options",
				},
			},
		},
		handler: async (request, reply) =>
			getOptionsHandler(request, reply, options),
	});

	fastify.get("/:optionId", {
		schema: {
			summary: "Get details of a single option",
			tags: ["Option"],
			response: {
				200: optionSchema,
			},
		},
		handler: async (request, reply) =>
			getOptionHandler(request, reply, options),
	});

	fastify.post("/", {
		schema: {
			summary: "Create a new option",
			tags: ["Option"],
			body: optionCreateSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(201);
			return createOptionHandler(request, reply, options);
		},
	});

	fastify.patch("/:optionId/add/selectedBy/:studentId", {
		schema: {
			summary:
				"Add student to the list of students who have selected the option",
			tags: ["Option"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(204);
			return addOptionSelectedByHandler(request, reply, options);
		},
	});

	fastify.delete("/:optionId", {
		schema: {
			summary: "Delete the option",
			tags: ["Option"],
			response: {
				204: deletedSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(204);
			return deleteOptionHandler(request, reply, options);
		},
	});

	fastify.patch("/:optionId/remove/selectedBy/:studentId", {
		schema: {
			summary:
				"Remove student from the list of students who have selected the option",
			tags: ["Option"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) => {
			reply.status(204);
			return removeOptionSelectedByHandler(request, reply, options);
		},
	});
};

export default optionRoutes;
