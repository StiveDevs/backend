// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import {
	addClubCoordinatorHandler,
	addClubMemberHandler,
	addClubPostHandler,
	createClubHandler,
	deleteClubHandler,
	getClubHandler,
	getClubsHandler,
	removeClubCoordinatorHandler,
	removeClubMemberHandler,
	removeClubPostHandler,
} from "../handlers/club";
import { checkIdsHandler } from "../handlers/commonHandlers";
import { clubCreateSchema, clubSchema } from "../schemas/club";
import {
	createdSchema,
	deletedSchema,
	modifiedSchema,
} from "../schemas/commonSchemas";

const clubRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const clubs = fastify.mongo.db.collection("clubs");
	const students = fastify.mongo.db.collection("students");
	const posts = fastify.mongo.db.collection("posts");

	fastify.addHook("onRequest", async (request, reply) => {
		await checkIdsHandler(fastify, request, clubs, students, posts);
	});

	fastify.get("/", {
		schema: {
			summary: "Get details of all the clubs",
			tags: ["Club"],
			response: {
				200: {
					type: "array",
					items: clubSchema,
				},
			},
		},
		handler: async (request, reply) =>
			getClubsHandler(request, reply, clubs),
	});

	fastify.get("/:clubId", {
		schema: {
			summary: "Get details of a single club",
			tags: ["Club"],
			response: {
				200: clubSchema,
			},
		},
		handler: async (request, reply) =>
			getClubHandler(request, reply, clubs),
	});

	fastify.post("/", {
		schema: {
			summary: "Create a new club",
			tags: ["Club"],
			body: clubCreateSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async (request, reply) =>
			createClubHandler(request, reply, clubs),
	});

	fastify.patch("/:clubId/add/member/:studentId", {
		schema: {
			summary: "Add student to the list of members of the club",
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			addClubMemberHandler(request, reply, clubs),
	});

	fastify.patch("/:clubId/add/coordinator/:studentId", {
		schema: {
			summary: "Add student to the list of coordinators of the club",
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			addClubCoordinatorHandler(request, reply, clubs),
	});

	fastify.patch("/:clubId/add/post/:postId", {
		schema: {
			summary: "Add post to the list of posts that belong to the club",
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			addClubPostHandler(request, reply, clubs),
	});

	fastify.delete("/:clubId", {
		schema: {
			summary: "Delete the club",
			tags: ["Club"],
			response: {
				204: deletedSchema,
			},
		},
		handler: async (request, reply) =>
			deleteClubHandler(request, reply, clubs),
	});

	fastify.patch("/:clubId/remove/member/:studentId", {
		schema: {
			summary: "Remove student from the list of members of the club",
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			removeClubMemberHandler(request, reply, clubs),
	});

	fastify.patch("/:clubId/remove/coordinator/:studentId", {
		schema: {
			summary: "Remove student from the list of coordinators of the club",
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			removeClubCoordinatorHandler(request, reply, clubs),
	});

	fastify.patch("/:clubId/remove/post/:postId", {
		schema: {
			summary:
				"Remove post from the list of posts that belong to the club",
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			removeClubPostHandler(request, reply, clubs),
	});
};

export default clubRoutes;
