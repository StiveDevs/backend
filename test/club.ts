import tap from "tap";
import { build } from "../app";

tap.test("Clubs Test", async (t) => {
	const app = build();

	t.teardown(() => app.close());

	t.beforeEach(async (t) => {
		t.context = {
			name: "New Club",
			description: "New Club Description",
		};
		const res = await app.inject({
			method: "POST",
			url: "/club",
			payload: t.context,
		});
		t.equal(res.statusCode, 201, "Club POST Status Check");
		const data = await res.json();
		t.context._id = data.insertedId;
	});

	t.test("Clubs GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/club",
		});
		t.equal(res.statusCode, 200, "Clubs GET Status Check");
		const data = await res.json();
		t.has(data[0], t.context, "Clubs GET Body Check");
	});

	t.test("Club GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/club/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 200, "Club GET Status Check");
		const data = await res.json();
		t.has(data, t.context, "Club GET Body Check");
	});

	t.afterEach(async (t) => {
		const res = await app.inject({
			method: "DELETE",
			url: `/club/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 204, "Club Delete Status Check");
	});
});
