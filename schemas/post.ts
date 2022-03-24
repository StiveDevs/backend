import { Document, ObjectId } from "mongodb";
import { Poll, pollCreateSchema, pollSchema } from "./poll";

export interface Post {
	title: string;
	description: string;
	imageUrl: string;
	postFrom: Date;
	postTill: Date;
	polls: Poll[];
}

export interface PostDocument extends Document {
	title: string;
	description: string;
	imageUrl: string;
	postFrom: Date;
	postTill: Date;
	pollIds: ObjectId[];
}

export const postCreateSchema = {
	type: "object",
	description: "Post create schema",
	required: ["title", "description"],
	properties: {
		title: {
			type: "string",
			description: "Title of the post",
		},
		description: {
			type: "string",
			description: "Description of the post",
		},
		imageUrl: {
			type: "string",
			description: "Url to the image to show with post",
			format: "uri",
		},
		postFrom: {
			type: "string",
			description: "When to show this post",
			format: "date-time",
		},
		postTill: {
			type: "string",
			description: "When to hide this post",
			format: "date-time",
		},
		polls: {
			type: "array",
			description: "List of polls attached with the post",
			items: pollCreateSchema,
		},
	},
};

export const postSchema = {
	type: "object",
	description: "Post",
	required: ["title", "description"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the post",
		},
		title: {
			type: "string",
			description: "Title of the post",
		},
		description: {
			type: "string",
			description: "Description of the post",
		},
		imageUrl: {
			type: "string",
			description: "Url to the image to show with post",
			format: "uri",
		},
		postFrom: {
			type: "string",
			description: "When to show this post",
			format: "date-time",
		},
		postTill: {
			type: "string",
			description: "When to hide this post",
			format: "date-time",
		},
		polls: {
			type: "array",
			description: "List of polls attached with this post",
			items: pollSchema,
		},
	},
};
