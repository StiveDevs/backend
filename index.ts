import Fastify from "fastify";
import fastifyMongo from "fastify-mongodb";
import fastifySwagger from "fastify-swagger";
import { config } from "dotenv";
import studentRoutes from "./routes/student";
import postRoutes from "./routes/post";
import clubRoutes from "./routes/club";
import { studentSchema } from "./models/student";
import { clubSchema } from "./models/club";
import { postSchema } from "./models/post";
import fastifySensible from "fastify-sensible";

config();

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifySensible);

const dbUsername = encodeURIComponent(process.env.MONGODB_ADMIN_USERNAME!);
const dbPassword = encodeURIComponent(process.env.MONGODB_ADMIN_PASSWORD!);
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
		],
		definitions: {
			Student: studentSchema,
			Club: clubSchema,
			Post: postSchema,
		},
	},
});

fastify.register(studentRoutes, { prefix: "/student" });

fastify.register(postRoutes, { prefix: "/post" });

fastify.register(clubRoutes, { prefix: "/club" });

fastify.listen(3000, (err, address) => {
	if (err) {
		fastify.log.error(err, "Server Start");
		process.exit(1);
	}
});