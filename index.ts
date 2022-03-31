import Fastify from "fastify";
import fastifyMongo from "fastify-mongodb";
import fastifySwagger from "fastify-swagger";
import fastifyCors from "fastify-cors";
import { config } from "dotenv";
import studentRoutes from "./routes/student";
import postRoutes from "./routes/post";
import clubRoutes from "./routes/club";
import { studentSchema } from "./schemas/student";
import { clubSchema } from "./schemas/club";
import { postSchema } from "./schemas/post";
import fastifySensible from "fastify-sensible";
import { pollSchema } from "./schemas/poll";
import { optionSchema } from "./schemas/option";
import optionRoutes from "./routes/option";
import pollRoutes from "./routes/poll";

config();

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyCors);

fastify.register(fastifySensible);

const dbUsername = encodeURIComponent(process.env.MONGODB_USERNAME!);
const dbPassword = encodeURIComponent(process.env.MONGODB_PASSWORD!);
const dbName = encodeURIComponent(process.env.MONGODB_DBNAME!);
fastify.register(fastifyMongo, {
	url: `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.fpce1.mongodb.net/${dbName}?retryWrites=true&w=majority`,
});

fastify.register(fastifySwagger, {
	routePrefix: "/docs",
	exposeRoute: true,
	swagger: {
		info: {
			title: "Stive API Documentation",
			description:
				"This is the the api documentation for the Stive app, for helping developers use the Stive API.",
			version: "1.0.0",
		},
		tags: [
			{ name: "Student", description: "Students related end-points" },
			{ name: "Club", description: "Clubs related end-points" },
			{ name: "Post", description: "Posts related end-points" },
			{ name: "Poll", description: "Polls related end-points" },
			{ name: "Option", description: "Options related end-points" },
		],
		definitions: {
			Student: studentSchema,
			Option: optionSchema,
			Poll: pollSchema,
			Post: postSchema,
			Club: clubSchema,
		},
	},
});

fastify.register(studentRoutes, { prefix: "/student" });

fastify.register(optionRoutes, { prefix: "/option" });

fastify.register(pollRoutes, { prefix: "/poll" });

fastify.register(postRoutes, { prefix: "/post" });

fastify.register(clubRoutes, { prefix: "/club" });

fastify.listen(process.env.PORT!, "0.0.0.0", (err, address) => {
	if (err) {
		fastify.log.error(err, "Server Start");
		process.exit(1);
	}
});
