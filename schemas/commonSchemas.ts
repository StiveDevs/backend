export const createdSchema = {
	type: "object",
	description: "Object creation response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description: "If the object was created",
		},
		insertedId: {
			type: "string",
			description: "Id of the object created",
		},
	},
};

export const modifiedSchema = {
	type: "object",
	description: "Object modification response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description: "If modification happened",
		},
		modifiedCount: {
			type: "number",
			description: "Number of objects modified",
		},
		upsertedId: {
			type: "string",
			description: "Id of the upsert request that the database used",
		},
		upsertedCount: {
			type: "number",
			description: "Number of upserts that happened",
		},
		matchedCount: {
			type: "number",
			description: "Number of objects that matched the query",
		},
	},
};

export const deletedSchema = {
	type: "object",
	description: "Object deletion response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description: "If database acknowledged the delete request",
		},
		deletedCount: {
			type: "number",
			description: "Number of objects deleted",
		},
	},
};
