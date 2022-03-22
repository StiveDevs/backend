// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";

export async function getOptionsHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	options: Collection
) {
	return options
		.aggregate([
			{
				$lookup: {
					from: "students",
					localField: "selectedByIds",
					foreignField: "_id",
					as: "selectedBy",
				},
			},
		])
		.toArray();
}

export async function getOptionHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	options: Collection
) {
	return options
		.aggregate([
			{
				$match: {
					_id: ObjectId(request.params.optionId),
				},
			},
			{
				$lookup: {
					from: "students",
					localField: "selectedByIds",
					foreignField: "_id",
					as: "selectedBy",
				},
			},
		])
		.next();
}

export async function createOptionHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	options: Collection
) {
	return options.insertOne(request.body);
}

export async function addOptionSelectedByHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	options: Collection
) {
	return options.updateOne(
		{ _id: ObjectId(request.params.optionId) },
		{
			$addToSet: {
				selectedByIds: ObjectId(request.params.studentId),
			},
		}
	);
}

export async function deleteOptionHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	options: Collection
) {
	return options.deleteOne({ _id: ObjectId(request.params.optionId) });
}

export async function removeOptionSelectedByHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	options: Collection
) {
	return options.updateOne(
		{ _id: ObjectId(request.params.optionId) },
		{
			$pull: {
				selectedByIds: ObjectId(request.params.studentId),
			},
		}
	);
}
