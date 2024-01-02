const assert = require("node:assert");
const { describe, it } = require("node:test");
const { Cookie } = require("..");

describe("Cookie.isExpired", () => {
	it("should evaluate expired values correctly", () => {
		const cookie = new Cookie("foo", "bar", { expires: new Date("01/01/1970") });
		assert.deepStrictEqual(cookie.isExpired(), true);
	});

	it("should throw on invalid expires", () => {
		const cookie = new Cookie("foo", "bar", { expires: "foo" });
		assert.throws(() => cookie.isExpired());
	});
});
