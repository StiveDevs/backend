import { build } from "./app";

const fastify = build();

let address = "";
if (process.env.TS_NODE_DEV || process.env.TAP) {
	address = "127.0.0.1";
} else {
	address = "0.0.0.0";
}

fastify.listen(process.env.PORT!, address, (err, address) => {
	if (err) {
		fastify.log.error(err, "Server Start");
		process.exit(1);
	}
});
