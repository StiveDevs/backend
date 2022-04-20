import tap from "tap";
import { build } from "../app";

tap.test("Posts Test", async (t) => {
	const app = build();

	t.teardown(() => app.close());

	t.beforeEach(async (t) => {
		t.context = {
			title: "New Post",
			description: "New Post Description",
		};
		const res = await app.inject({
			method: "POST",
			url: "/post",
			payload: t.context,
		});
		t.equal(res.statusCode, 201, "Post POST Status Check");
		const data = await res.json();
		t.context._id = data.insertedId;
	});

	t.test("Posts GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/post",
		});
		t.equal(res.statusCode, 200, "Posts GET Status Check");
		const data = await res.json();
		t.has(data[0], t.context, "Posts GET Body Check");
	});

	t.test("Post GET", async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/post/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 200, "Post GET Status Check");
		const data = await res.json();
		t.has(data, t.context, "Post GET Body Check");
	});

	t.afterEach(async (t) => {
		const res = await app.inject({
			method: "DELETE",
			url: `/post/${encodeURIComponent(t.context._id)}`,
		});
		t.equal(res.statusCode, 204, "Post Delete Status Check");
	});
});
