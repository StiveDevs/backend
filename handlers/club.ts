// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";

export async function getClubsHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
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
			{
				$lookup: {
					from: "posts",
					localField: "postIds",
					foreignField: "_id",
					as: "posts",
					pipeline: [
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
														localField:
															"selectedByIds",
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
					],
				},
			},
		])
		.toArray();
}

export async function getClubHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs
		.aggregate([
			{
				$match: {
					_id: ObjectId(request.params.clubId),
				},
			},
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
			{
				$lookup: {
					from: "posts",
					localField: "postIds",
					foreignField: "_id",
					as: "posts",
					pipeline: [
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
														localField:
															"selectedByIds",
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
					],
				},
			},
		])
		.next();
}

export async function createClubHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.insertOne(request.body);
}

export async function addClubMemberHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.updateOne(
		{ _id: ObjectId(request.params.clubId) },
		{ $addToSet: { memberIds: ObjectId(request.params.studentId) } }
	);
}

export async function addClubCoordinatorHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.updateOne(
		{ _id: ObjectId(request.params.clubId) },
		{
			$addToSet: {
				coordinatorIds: ObjectId(request.params.studentId),
			},
		}
	);
}

export async function addClubPostHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.updateOne(
		{ _id: ObjectId(request.params.clubId) },
		{
			$addToSet: {
				postIds: ObjectId(request.params.postId),
			},
		}
	);
}

export async function deleteClubHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.deleteOne({ _id: ObjectId(request.params.clubId) });
}

export async function removeClubMemberHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.updateOne(
		{ _id: ObjectId(request.params.clubId) },
		{ $pull: { memberIds: ObjectId(request.params.studentId) } }
	);
}

export async function removeClubCoordinatorHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.updateOne(
		{ _id: ObjectId(request.params.clubId) },
		{
			$pull: {
				coordinatorIds: ObjectId(request.params.studentId),
			},
		}
	);
}

export async function removeClubPostHandler(
	request: FastifyRequest,
	reply: FastifyReply,
	clubs: Collection
) {
	return clubs.updateOne(
		{ _id: ObjectId(request.params.clubId) },
		{
			$pull: {
				postIds: ObjectId(request.params.postId),
			},
		}
	);
}
