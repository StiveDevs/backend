import { Document, ObjectId } from "mongodb";
import { Post, postSchema } from "./post";
import { Student, studentSchema } from "./student";

export interface Club {
	name: string;
	description: string;
	logoUrl: string;
	coordinators: Student[];
	members: Student[];
	posts: Post[];
}

export interface ClubDocument extends Document {
	name: string;
	description: string;
	logoUrl: string;
	coordinatorIds: ObjectId[];
	memberIds: ObjectId[];
	postIds: ObjectId[];
}

export const clubCreateSchema = {
	type: "object",
	description: "Club create schema",
	required: ["name", "description"],
	properties: {
		name: {
			type: "string",
			description: "Name of the club",
		},
		description: {
			type: "string",
			description: "Description of the club",
		},
		logoUrl: {
			type: "string",
			description: "Url to the logo of the club",
			format: "uri",
		},
	},
};

export const clubSchema = {
	type: "object",
	description: "Club",
	required: ["name", "description"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the club",
		},
		name: {
			type: "string",
			description: "Name of the club",
		},
		description: {
			type: "string",
			description: "Description of the club",
		},
		logoUrl: {
			type: "string",
			description: "Url to the logo of the club",
			format: "uri",
		},
		coordinators: {
			type: "array",
			description: "List of the coordinators of the club",
			items: studentSchema,
			uniqueItems: true,
		},
		members: {
			type: "array",
			description: "List of the members of the club",
			items: studentSchema,
			uniqueItems: true,
		},
		posts: {
			type: "array",
			description: "List of the posts of the club",
			items: postSchema,
		},
	},
};
