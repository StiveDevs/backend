// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";
import { createOptionHandler, deleteOptionHandler } from "./option";
import { Poll, PollDocument } from "../schemas/poll";

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
	polls: Collection,
	options: Collection
) {
	const body: Poll = request.body;
	const { options: reqOptions, ...reqPoll } = body;
	const pollRes = await polls.insertOne(reqPoll);
	if (!reqOptions || !pollRes.insertedId) {
		return pollRes;
	}
	for (const reqOption of reqOptions) {
		request.body = reqOption;
		createOptionHandler(request, reply, options).then((optionRes) => {
			if (!optionRes.insertedId) return;
			request.params.pollId = pollRes.insertedId;
			request.params.optionId = optionRes.insertedId;
			addPollOptionHandler(request, reply, polls);
		});
	}
	return pollRes;
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
	polls: Collection,
	options: Collection
) {
	const poll: PollDocument = await polls.findOne({
		_id: ObjectId(request.params.pollId),
	});
	const pollRes = polls.deleteOne({
		_id: ObjectId(request.params.pollId),
	});
	if (!poll.optionIds) {
		return pollRes;
	}
	for (const optionId of poll.optionIds) {
		request.params.optionId = optionId;
		deleteOptionHandler(request, reply, options);
	}
	return pollRes;
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
