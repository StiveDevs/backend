import { Document, ObjectId } from "mongodb";
import { Option, optionCreateSchema, optionSchema } from "./option";

export interface Poll {
	name: string;
	maxOptionsPerStudent: number;
	options: Option[];
}

export interface PollDocument extends Document {
	name: string;
	maxOptionsPerStudent: number;
	optionIds: ObjectId[];
}

export const pollCreateSchema = {
	type: "object",
	description: "Poll create schema",
	required: ["name", "maxOptionsPerStudent"],
	properties: {
		name: {
			type: "string",
			description: "Name of the poll",
		},
		maxOptionsPerStudent: {
			type: "number",
			description:
				"Maximum number of options a student is allowed to select",
		},
		options: {
			type: "array",
			description: "List of options availaible with the poll",
			items: optionCreateSchema,
			uniqueItems: true,
		},
	},
};

export const pollSchema = {
	type: "object",
	description: "Poll",
	required: ["name"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the poll",
		},
		name: {
			type: "string",
			description: "Name of the poll",
		},
		maxOptionsPerStudent: {
			type: "number",
			description:
				"Maximum number of options a student is allowed to select",
		},
		options: {
			type: "array",
			description: "List of options availaible with the poll",
			items: optionSchema,
			uniqueItems: true,
		},
	},
};
