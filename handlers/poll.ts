// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";

export async function getPollsHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	polls: Collection
) {
	return polls
		.aggregate([
			{
				$lookup: {
					from: "options",
					localField: "optionIds",
					foreignField: "_id",
					as: "options",
					pipeline: [
						{
							$lookup: {
								from: "students",
								localField: "selectedByIds",
								foreignField: "_id",
								as: "selectedBy",
							},
						},
					],
				},
			},
		])
		.toArray();
}

export async function getPollHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	polls: Collection
) {
	return polls
		.aggregate([
			{
				$match: {
					_id: ObjectId(request.params.pollId),
				},
			},
			{
				$lookup: {
					from: "options",
					localField: "optionIds",
					foreignField: "_id",
					as: "options",
					pipeline: [
						{
							$lookup: {
								from: "students",
								localField: "selectedByIds",
								foreignField: "_id",
								as: "selectedBy",
							},
						},
					],
				},
			},
		])
		.next();
}

export async function createPollHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	polls: Collection
) {
	return polls.insertOne(request.body);
}

export async function addPollOptionHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	polls: Collection
) {
	return polls.updateOne(
		{ _id: ObjectId(request.params.pollId) },
		{ $addToSet: { optionIds: ObjectId(request.params.optionId) } }
	);
}

export async function deletePollHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	polls: Collection
) {
	return polls.deleteOne({ _id: ObjectId(request.params.pollId) });
}

export async function removePollOptionHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	polls: Collection
) {
	return polls.updateOne(
		{ _id: ObjectId(request.params.pollId) },
		{ $pull: { optionIds: ObjectId(request.params.optionId) } }
	);
}
