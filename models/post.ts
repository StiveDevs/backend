export interface Post {
	_id: string;
	title: string;
	description: string;
	imageUrl: string;
	postFrom: Date;
	postTill: Date;
}

export const postSchema = {
	type: "object",
	description: "Post",
	required: ["title", "description"],
	properties: {
		_id: {
			type: "string",
			description: "Id of the post",
		},
		title: {
			type: "string",
			description: "Title of the post",
		},
		description: {
			type: "string",
			description: "Description of the post",
		},
		imageUrl: {
			type: "string",
			description: "Url to the image to show with post",
			format: "uri",
		},
		postFrom: {
			type: "string",
			description: "When to show this post",
			format: "date-time",
		},
		postTill: {
			type: "string",
			description: "When to hide this post",
			format: "date-time",
		},
	},
};
