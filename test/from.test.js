const assert = require("node:assert");
const { describe, it } = require("node:test");
const { Cookie } = require("..");

describe("Cookie.from", () => {
	it("should not throw with no arguments", () => {
		assert.doesNotThrow(Cookie.from.bind());
	});

	it("should throw when not a string", () => {
		assert.throws(Cookie.from.bind(null, 42), /argument must be a string/);
	});

	it("should parse cookie string to object", () => {
		assert.deepStrictEqual(
			Cookie.from("foo=bar"),
			new Map([["foo", new Cookie("foo", "bar")]]),
		);
		assert.deepStrictEqual(
			Cookie.from("foo=123"),
			new Map([["foo", new Cookie("foo", "123")]]),
		);
	});

	it("should ignore OWS", () => {
		assert.deepStrictEqual(
			Cookie.from("FOO    = bar;   baz  =   raz"),
			new Map([
				["FOO", new Cookie("FOO", "bar")],
				["baz", new Cookie("baz", "raz")],
			]),
		);
	});

	it("should parse cookie with empty value", () => {
		assert.deepStrictEqual(
			Cookie.from("foo= ; bar="),
			new Map([
				["foo", new Cookie("foo", "")],
				["bar", new Cookie("bar", "")],
			]),
		);
	});

	it("should URL-decode values", () => {
		assert.deepStrictEqual(
			Cookie.from('foo="bar=123456789&name=Magic+Mouse"'),
			new Map([["foo", new Cookie("foo", '"bar=123456789&name=Magic+Mouse"')]]),
		);

		assert.deepStrictEqual(
			Cookie.from("email=%20%22%2c%3b%2f"),
			new Map([["email", new Cookie("email", ' ",;/')]]),
		);
	});

	it("should return original value on escape error", () => {
		assert.deepStrictEqual(
			Cookie.from("foo=%1;bar=bar"),
			new Map([
				["foo", new Cookie("foo", "%1")],
				["bar", new Cookie("bar", "bar")],
			]),
		);
	});

	it("should ignore cookies without value", () => {
		assert.deepStrictEqual(
			Cookie.from("foo=bar;fizz  ;  buzz"),
			new Map([["foo", new Cookie("foo", "bar")]]),
		);
		assert.deepStrictEqual(
			Cookie.from("  fizz; foo=  bar"),
			new Map([["foo", new Cookie("foo", "bar")]]),
		);
	});

	it("should ignore duplicate cookies", () => {
		assert.deepStrictEqual(
			Cookie.from("foo=%1;bar=bar;foo=boo"),
			new Map([
				["foo", new Cookie("foo", "%1")],
				["bar", new Cookie("bar", "bar")],
			]),
		);
		assert.deepStrictEqual(
			Cookie.from("foo=false;bar=bar;foo=true"),
			new Map([
				["foo", new Cookie("foo", "false")],
				["bar", new Cookie("bar", "bar")],
			]),
		);
		assert.deepStrictEqual(
			Cookie.from("foo=;bar=bar;foo=boo"),
			new Map([
				["foo", new Cookie("foo", "")],
				["bar", new Cookie("bar", "bar")],
			]),
		);
	});
});
