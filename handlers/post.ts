// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";
import { Post, PostDocument } from "../schemas/post";
import { createPollHandler, deletePollHandler } from "./poll";

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
	posts: Collection,
	polls: Collection,
	options: Collection
) {
	const body: Post = request.body;
	const { polls: reqPolls, ...reqPost } = body;
	const postRes = await posts.insertOne(reqPost);
	if (!reqPolls || !postRes.insertedId) {
		return postRes;
	}
	for (const reqPoll of reqPolls) {
		request.body = reqPoll;
		createPollHandler(request, reply, polls, options).then((pollRes) => {
			if (!pollRes.insertedId) return;
			request.params.postId = postRes.insertedId;
			request.params.pollId = pollRes.insertedId;
			addPostPollHandler(request, reply, posts);
		});
	}
	return postRes;
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
	posts: Collection,
	polls: Collection,
	options: Collection
) {
	const post: PostDocument = await posts.findOne({
		_id: ObjectId(request.params.postId),
	});
	const postRes = posts.deleteOne({
		_id: ObjectId(request.params.postId),
	});
	if (!post.pollIds) {
		return postRes;
	}
	for (const pollId of post.pollIds) {
		request.params.pollId = pollId;
		deletePollHandler(request, reply, polls, options);
	}
	return postRes;
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
