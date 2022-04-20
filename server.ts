import { build } from "./app";

const fastify = build();

let address = "";
if (process.argv[0] === "ts-node") {
	address = "0.0.0.0";
} else {
	address = "127.0.0.1";
}

fastify.listen(process.env.PORT!, address, (err, address) => {
	if (err) {
		fastify.log.error(err, "Server Start");
		process.exit(1);
	}
});
