// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";

export async function getPostsHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	posts: Collection
) {
	return posts
		.aggregate([
			{
				$lookup: {
					from: "polls",
					localField: "pollIds",
					foreignField: "_id",
					as: "polls",
					pipeline: [
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
					],
				},
			},
		])
		.toArray();
}

export async function getPostHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	posts: Collection
) {
	return posts
		.aggregate([
			{
				$match: {
					_id: ObjectId(request.params.postId),
				},
			},
			{
				$lookup: {
					from: "polls",
					localField: "pollIds",
					foreignField: "_id",
					as: "polls",
					pipeline: [
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
					],
				},
			},
		])
		.next();
}

export async function createPostHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	posts: Collection
) {
	return posts.insertOne(request.body);
}

export async function addPostPollHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	posts: Collection
) {
	return posts.updateOne(
		{ _id: ObjectId(request.params.postId) },
		{ $addToSet: { pollIds: ObjectId(request.params.pollId) } }
	);
}

export async function deletePostHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	posts: Collection
) {
	return posts.deleteOne({ _id: ObjectId(request.params.postId) });
}

export async function removePostPollHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	posts: Collection
) {
	return posts.updateOne(
		{ _id: ObjectId(request.params.postId) },
		{ $pull: { pollIds: ObjectId(request.params.pollId) } }
	);
}
