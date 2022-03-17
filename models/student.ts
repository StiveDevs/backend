export interface Student {
	_id: string;
	name: string;
	rollNo: string;
	email: string;
}

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
	},
};
