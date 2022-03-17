export interface Club {
	_id: string;
	name: string;
	description: string;
	logoUrl: string;
	coordinators: string[];
	members: string[];
}

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
			description: "List of ids of the coordinators of the club",
			items: {
				type: "string",
				description: "Id of a coordinator of the club",
				format: "uuid",
			},
		},
		members: {
			type: "array",
			description: "List of ids of the members of the club",
			items: {
				type: "string",
				description: "Id of a member of the club",
				format: "uuid",
			},
		},
	},
};
