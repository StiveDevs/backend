import { ObjectId } from "mongodb";
import { studentSchema } from "./student";

export interface Option {
	name: string;
}

export const optionCreateSchema = {
	type: "object",
	description: "Option",
	required: ["name"],
	properties: {
		name: {
			type: "string",
			description: "Name of the option",
		},
	},
};

export const optionSchema = {
	type: "object",
	description: "Option",
	required: ["name"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the option",
		},
		name: {
			type: "string",
			description: "Name of the option",
		},
		selectedBy: {
			type: "array",
			description: "List of students who selected the option",
			items: studentSchema,
			uniqueItems: true,
		},
	},
};
