import tap from "tap";
import { build } from "../app";

tap.test("Options Test", async (t) => {
	const app = build();

	t.teardown(() => app.close());

	t.beforeEach(async (t) => {
		t.context = {
			name: "New Option",
		};
		const res = await app.inject({
			method: "POST",
			url: "/option",
			payload: t.context,
		});
		t.equal(res.statusCode, 201, "Option POST Status Check");
		const data = await res.json();
		t.context._id = data.insertedId;
	});

	t.test("Options GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/option",
		});
		t.equal(res.statusCode, 200, "Options GET Status Check");
		const data = await res.json();
		t.has(data[0], t.context, "Options GET Body Check");
	});

	t.test("Option GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/option/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 200, "Option GET Status Check");
		const data = await res.json();
		t.has(data, t.context, "Option GET Body Check");
	});

	t.afterEach(async (t) => {
		const res = await app.inject({
			method: "DELETE",
			url: `/option/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 204, "Option Delete Status Check");
	});
});
