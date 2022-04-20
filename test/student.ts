import tap from "tap";
import { build } from "../app";

tap.test("Students Test", async (t) => {
	const app = build();

	t.teardown(() => app.close());

	t.beforeEach(async (t) => {
		t.context = {
			email: "new.student@iiitg.ac.in",
		};
		const res = await app.inject({
			method: "POST",
			url: "/student",
			payload: t.context,
		});
		t.equal(res.statusCode, 201, "Student POST Status Check");
		const data = await res.json();
		t.context._id = data.upsertedId;
	});

	t.test("Students GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/student",
		});
		t.equal(res.statusCode, 200, "Students GET Status Check");
		const data = await res.json();
		t.has(data[0], t.context, "Students GET Body Check");
	});

	t.test("Student GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/student/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 200, "Student GET Status Check");
		const data = await res.json();
		t.has(data, t.context, "Student GET Body Check");
	});

	t.afterEach(async (t) => {
		const res = await app.inject({
			method: "DELETE",
			url: `/student/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 204, "Student Delete Status Check");
	});
});
