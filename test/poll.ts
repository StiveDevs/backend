import tap from "tap";
import { build } from "../app";

tap.test("Polls Test", async (t) => {
	const app = build();

	t.teardown(() => app.close());

	t.beforeEach(async (t) => {
		t.context = {
			name: "New Poll",
			maxOptionsPerStudent: 1,
		};
		const res = await app.inject({
			method: "POST",
			url: "/poll",
			payload: t.context,
		});
		t.equal(res.statusCode, 201, "Poll POST Status Check");
		const data = await res.json();
		t.context._id = data.insertedId;
	});

	t.test("Polls GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/poll",
		});
		t.equal(res.statusCode, 200, "Polls GET Status Check");
		const data = await res.json();
		t.has(data[0], t.context, "Polls GET Body Check");
	});

	t.test("Poll GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/poll/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 200, "Poll GET Status Check");
		const data = await res.json();
		t.has(data, t.context, "Poll GET Body Check");
	});

	t.afterEach(async (t) => {
		const res = await app.inject({
			method: "DELETE",
			url: `/poll/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 204, "Poll Delete Status Check");
	});
});
