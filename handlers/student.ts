// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";

export async function getStudentsHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	students: Collection
) {
	return students.find().toArray();
}

export async function getStudentHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	students: Collection
) {
	return students.findOne({ _id: ObjectId(request.params.studentId) });
}

export async function createStudentHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	students: Collection
) {
	return students.replaceOne({ email: request.body.email }, request.body, {
		upsert: true,
	});
}

export async function deleteStudentHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	students: Collection
) {
	return students.deleteOne({ _id: ObjectId(request.params.studentId) });
}
