export interface Student {
	name: string;
	rollNo: string;
	email: string;
	profilePicUrl: string;
}

export const studentCreateSchema = {
	type: "object",
	description: "Student create schema",
	required: ["email"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the student",
		},
		name: {
			type: "string",
			description: "Name of student",
		},
		rollNo: {
			type: "string",
			description: "Roll no of student",
		},
		email: {
			type: "string",
			description: "Institute mail of student",
			format: "email",
		},
		profilePicUrl: {
			type: "string",
			description: "Url to the profile picture of student",
			format: "uri",
		},
	},
};

export const studentSchema = {
	type: "object",
	description: "Student",
	required: ["email"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the student",
		},
		name: {
			type: "string",
			description: "Name of student",
		},
		rollNo: {
			type: "string",
			description: "Roll no of student",
		},
		email: {
			type: "string",
			description: "Institute mail of student",
			format: "email",
		},
		profilePicUrl: {
			type: "string",
			description: "Url to the profile picture of student",
			format: "uri",
		},
	},
};
