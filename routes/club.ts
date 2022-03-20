// @ts-nocheck
import { FastifyPluginAsync } from "fastify";
import { ObjectId } from "mongodb";
import { clubSchema } from "../models/club";
import { createdSchema, modifiedSchema } from "./commonSchemas";

const clubRoutes: FastifyPluginAsync = async function (fastify, opts) {
	const clubs = fastify.mongo.db.collection("clubs");
	const students = fastify.mongo.db.collection("students");

	fastify.addHook("onRequest", async (request, reply) => {
		const studentId = request.params.studentId;
		if (
			studentId &&
			!(await students.countDocuments({ _id: ObjectId(studentId) }))
		) {
			throw fastify.httpErrors.notFound(
				`Student with Id ${studentId} not found`
			);
		}
		const clubId = request.params.clubId;
		if (
			clubId &&
			!(await clubs.countDocuments({ _id: ObjectId(clubId) }))
		) {
			throw fastify.httpErrors.notFound(
				`Club with Id ${clubId} not found`
			);
		}
	});

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
			return clubs
				.aggregate([
					{
						$lookup: {
							from: "students",
							localField: "coordinatorIds",
							foreignField: "_id",
							as: "coordinators",
						},
					},
					{
						$lookup: {
							from: "students",
							localField: "memberIds",
							foreignField: "_id",
							as: "members",
						},
					},
				])
				.toArray();
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

	fastify.patch("/:clubId/add/member/:studentId", {
		schema: {
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async function (request, reply) {
			return clubs.updateOne(
				{ _id: ObjectId(request.params.clubId) },
				{ $addToSet: { memberIds: ObjectId(request.params.studentId) } }
			);
		},
	});

	fastify.patch("/:clubId/add/coordinator/:studentId", {
		schema: {
			tags: ["Club"],
			response: {
				204: modifiedSchema,
			},
		},
		handler: async function (request, reply) {
			return clubs.updateOne(
				{ _id: ObjectId(request.params.clubId) },
				{
					$addToSet: {
						coordinatorIds: ObjectId(request.params.studentId),
					},
				}
			);
		},
	});
};

export default clubRoutes;
