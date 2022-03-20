// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { ObjectId } from "mongodb";
import { studentSchema } from "../models/student";
import { createdSchema } from "./commonSchemas";

const studentRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const students = fastify.mongo.db.collection("students");

	fastify.get("/", {
		schema: {
			tags: ["Student"],
			response: {
				200: {
					type: "array",
					items: studentSchema,
				},
			},
		},
		handler: async function (request, reply) {
			return students.find().toArray();
		},
	});

	fastify.get("/:studentId", {
		schema: {
			tags: ["Student"],
			response: {
				200: studentSchema,
			},
		},
		handler: async function (request, reply) {
			const studentId = request.params.studentId;
			fastify.log.info(studentId);
			return students.findOne({ _id: ObjectId(studentId) });
		},
	});

	fastify.post("/", {
		schema: {
			tags: ["Student"],
			body: studentSchema,
			response: {
				201: createdSchema,
			},
		},
		handler: async function (request, reply) {
			return students.insertOne(request.body);
		},
	});
};

export default studentRoutes;
