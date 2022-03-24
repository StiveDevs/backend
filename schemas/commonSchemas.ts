export const createdSchema = {
	type: "object",
	description: "Document creation response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description:
				"True if the operation ran with write concern or false if write concern was disabled",
		},
		insertedId: {
			type: "string",
			description: "Id of the inserted document",
		},
	},
};

export const modifiedSchema = {
	type: "object",
	description: "Document modification response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description:
				"True if the operation ran with write concern or false if write concern was disabled",
		},
		modifiedCount: {
			type: "number",
			description: "Number of documents modified",
		},
		upsertedId: {
			type: "string",
			description: "Id of the upserted document",
		},
		upsertedCount: {
			type: "number",
			description: "Number of upserted documents",
		},
		matchedCount: {
			type: "number",
			description: "Number of documents that matched the query",
		},
	},
};

export const deletedSchema = {
	type: "object",
	description: "Document deletion response from MongoDB",
	properties: {
		acknowledged: {
			type: "boolean",
			description:
				"True if the operation ran with write concern or false if write concern was disabled",
		},
		deletedCount: {
			type: "number",
			description: "Number of documents deleted",
		},
	},
};
