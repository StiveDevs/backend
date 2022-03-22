// @ts-nocheck
import { FastifyRequest, FastifyInstance } from "fastify";
import { Collection } from "mongodb";
import { ObjectId } from "fastify-mongodb";

export async function checkIdsHandler(
	fastify: FastifyInstance,
	request: FastifyRequest,
	...collections: Collection[]
) {
	if (request.params) {
		for (const collection of collections) {
			let name = collection.collectionName;
			name = name.slice(0, name.length - 1);
			const id = request.params[`${name}Id`];
			if (id) {
				if (!ObjectId.isValid(id)) {
					throw fastify.httpErrors.badRequest(
						`${id} is not a valid ${name} Id`
					);
				}
				if (!(await collection.find({ _id: ObjectId(id) }).hasNext())) {
					throw fastify.httpErrors.notFound(
						`${name} with Id ${id} not found`
					);
				}
			}
		}
	}
}
