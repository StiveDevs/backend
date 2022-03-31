// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { studentCreateSchema, studentSchema } from "../schemas/student";
import { deletedSchema, modifiedSchema } from "../schemas/commonSchemas";
import { checkIdsHandler } from "../handlers/commonHandlers";
import {
	createStudentHandler,
	deleteStudentHandler,
	getStudentHandler,
	getStudentsHandler,
} from "../handlers/student";

const studentRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const students = fastify.mongo.db.collection("students");

	fastify.addHook("onRequest", async (request, reply) => {
		checkIdsHandler(request, reply, students);
	});

	fastify.get("/", {
		schema: {
			summary: "Get details of all the students",
			tags: ["Student"],
			response: {
				200: {
					type: "array",
					items: studentSchema,
					description: "List of all the students",
				},
			},
		},
		handler: async (request, reply) =>
			getStudentsHandler(request, reply, students),
	});

	fastify.get("/:studentId", {
		schema: {
			summary: "Get details of a single student",
			tags: ["Student"],
			response: {
				200: studentCreateSchema,
			},
		},
		handler: async (request, reply) =>
			getStudentHandler(request, reply, students),
	});

	fastify.post("/", {
		schema: {
			summary: "Create a new student",
			tags: ["Student"],
			body: studentCreateSchema,
			response: {
				201: modifiedSchema,
			},
		},
		handler: async (request, reply) =>
			createStudentHandler(request, reply, students),
	});

	fastify.delete("/:studentId", {
		schema: {
			summary: "Delete the student",
			tags: ["Student"],
			response: {
				204: deletedSchema,
			},
		},
		handler: async (request, reply) =>
			deleteStudentHandler(request, reply, students),
	});
};

export default studentRoutes;
