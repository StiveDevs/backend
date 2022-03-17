export const createdSchema = {
	type: "object",
	description: "Response from the Mongo database",
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
