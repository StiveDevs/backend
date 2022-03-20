export const createdSchema = {
	type: "object",
	description: "Object creation response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description: "If database acknowledged the new insert request",
		},
		insertedId: {
			type: "string",
			description: "Id of the insert request that the database used",
		},
	},
};

export const modifiedSchema = {
	type: "object",
	description: "Object modification response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description: "If database acknowledged the new modify request",
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
