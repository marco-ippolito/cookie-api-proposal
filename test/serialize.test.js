const assert = require("node:assert");
const { describe, it } = require("node:test");
const { Cookie } = require("..");

describe("Cookie.serialize(new Cookie(name, value))", () => {
	it("should serialize without argument", () => {
		assert.deepStrictEqual(Cookie.serialize(), "");
	});

	it("should serialize name and value", () => {
		assert.deepStrictEqual(Cookie.serialize(new Cookie("foo", "bar")), "foo=bar");
	});

	it("should URL-encode value", () => {
		assert.deepStrictEqual(
			Cookie.serialize(new Cookie("foo", "bar +baz")),
			"foo=bar%20%2Bbaz",
		);
	});

	it("should serialize empty value", () => {
		assert.deepStrictEqual(Cookie.serialize(new Cookie("foo", "")), "foo=");
	});

	it("should throw for invalid name", () => {
		assert.throws(
			Cookie.serialize.bind(Cookie, new Cookie("foo\n", "bar")),
			/argument name is invalid/,
		);
		assert.throws(
			Cookie.serialize.bind(Cookie, new Cookie("foo\u280a", "bar")),
			/argument name is invalid/,
		);
	});

	it("should throw for invalid value", () => {
		assert.throws(
			Cookie.serialize.bind(Cookie, new Cookie("foo", 1234)),
			/argument value is invalid/,
		);
		assert.throws(
			Cookie.serialize.bind(Cookie, new Cookie("foo", {})),
			/argument value is invalid/,
		);
	});
});

describe("Cookie.serialize(new Cookie(name, value, options))", () => {
	describe('with "domain" option', () => {
		it("should serialize domain", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { domain: "example.com" })),
				"foo=bar; Domain=example.com",
			);
		});

		it("should throw for invalid value", () => {
			assert.throws(
				Cookie.serialize.bind(
					Cookie,
					new Cookie("foo", "bar", { domain: "example.com\n" }),
				),
				/option domain is invalid/,
			);
		});
	});

	describe('with "expires" option', () => {
		it("should throw on non-Date value", () => {
			assert.throws(
				Cookie.serialize.bind(Cookie, new Cookie("foo", "bar", { expires: 42 })),
				/option expires is invalid/,
			);
		});

		it("should throw on invalid date", () => {
			assert.throws(
				Cookie.serialize.bind(
					Cookie,
					new Cookie("foo", "bar", { expires: new Date(NaN) }),
				),
				/option expires is invalid/,
			);
		});

		it("should set expires to given date", () => {
			assert.deepStrictEqual(
				Cookie.serialize(
					new Cookie("foo", "bar", {
						expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
					}),
				),
				"foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT",
			);
		});
	});

	describe('with "httpOnly" option', () => {
		it("should include httpOnly flag when true", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { httpOnly: true })),
				"foo=bar; HttpOnly",
			);
		});

		it("should not include httpOnly flag when false", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { httpOnly: false })),
				"foo=bar",
			);
		});

		it("should throw if httpOnly is not a boolean", () => {
			assert.throws(() => {
				Cookie.serialize(new Cookie("foo", "bar", { httpOnly: "buzz" }));
			}, /option httpOnly is invalid/);
		});
	});

	describe('with "maxAge" option', () => {
		it("should throw when not a number", () => {
			assert.throws(() => {
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: "buzz" }));
			}, /option maxAge is invalid/);
		});

		it("should throw when Infinity", () => {
			assert.throws(() => {
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: Infinity }));
			}, /option maxAge is invalid/);
		});

		it("should set max-age to value", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: 1000 })),
				"foo=bar; Max-Age=1000",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: "1000" })),
				"foo=bar; Max-Age=1000",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: 0 })),
				"foo=bar; Max-Age=0",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: "0" })),
				"foo=bar; Max-Age=0",
			);
		});

		it("should set max-age to integer value", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: 3.14 })),
				"foo=bar; Max-Age=3",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: 3.99 })),
				"foo=bar; Max-Age=3",
			);
		});

		it("should not set when null", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { maxAge: null })),
				"foo=bar",
			);
		});
	});

	describe('with "partitioned" option', () => {
		it("should include partitioned flag when true", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { partitioned: true })),
				"foo=bar; Partitioned",
			);
		});

		it("should throw for invalid value", () => {
			assert.throws(
				Cookie.serialize.bind(Cookie, new Cookie("foo", "bar", { partitioned: "foo" })),
				/option partitioned is invalid/,
			);
		});

		it("should not include partitioned flag when false", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { partitioned: false })),
				"foo=bar",
			);
		});

		it("should not include partitioned flag when not defined", () => {
			assert.deepStrictEqual(Cookie.serialize(new Cookie("foo", "bar", {})), "foo=bar");
		});
	});

	describe('with "path" option', () => {
		it("should serialize path", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { path: "/" })),
				"foo=bar; Path=/",
			);
		});

		it("should throw for invalid value", () => {
			assert.throws(
				Cookie.serialize.bind(Cookie, new Cookie("foo", "bar", { path: "/\n" })),
				/option path is invalid/,
			);
		});
	});

	describe('with "sameSite" option', () => {
		it("should throw on invalid sameSite string value", () => {
			assert.throws(() => {
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "foo" }));
			}, /option sameSite is invalid/);
		});

		it("should throw on invalid sameSite", () => {
			assert.throws(() => {
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: 1234 }));
			}, /option sameSite is invalid/);
		});

		it("should set sameSite strict", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "Strict" })),
				"foo=bar; SameSite=Strict",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "strict" })),
				"foo=bar; SameSite=Strict",
			);
		});

		it("should set sameSite lax", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "Lax" })),
				"foo=bar; SameSite=Lax",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "lax" })),
				"foo=bar; SameSite=Lax",
			);
		});

		it("should set sameSite none", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "None" })),
				"foo=bar; SameSite=None",
			);
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: "none" })),
				"foo=bar; SameSite=None",
			);
		});

		it("should set sameSite strict when true", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: true })),
				"foo=bar; SameSite=Strict",
			);
		});

		it("should not set sameSite when false", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { sameSite: false })),
				"foo=bar",
			);
		});
	});

	describe('with "secure" option', () => {
		it("should include secure flag when true", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { secure: true })),
				"foo=bar; Secure",
			);
		});

		it("should throw on invalid secure string value", () => {
			assert.throws(() => {
				Cookie.serialize(new Cookie("foo", "bar", { secure: "foo" }));
			}, /option secure is invalid/);
		});

		it("should not include secure flag when false", () => {
			assert.deepStrictEqual(
				Cookie.serialize(new Cookie("foo", "bar", { secure: false })),
				"foo=bar",
			);
		});
	});
});

describe("Cookie.serialize invalid values", () => {
	it("should throw for non cookie value", () => {
		assert.throws(
			Cookie.serialize.bind(Cookie, "foo", "bar"),
			/argument must be a Cookie/,
		);
		assert.throws(
			Cookie.serialize.bind(Cookie, { name: "foo", value: "bar" }),
			/argument must be a Cookie/,
		);

		assert.throws(
			Cookie.serialize.bind(Cookie, new Cookie("foo", "bar"), "foo"),
			/argument must be a Cookie/,
		);
	});
});
