/**
 * Additional options for the cookie.
 * @typedef {Object} CookieOptions
 * @property {string} [domain] - The domain of the cookie.
 * @property {string} [path] - The path of the cookie.
 * @property {number} [maxAge] - The maximum age of the cookie in seconds.
 * @property {Date} [expires] - The expiration date of the cookie.
 * @property {boolean} [secure] - Indicates if the cookie should only be sent over secure connections.
 * @property {boolean} [httpOnly] - Indicates if the cookie should be accessible only through HTTP requests.
 * @property {string|boolean} [sameSite] - The SameSite attribute of the cookie.
 * @property {boolean} [partitioned] - Indicates if the cookie is partitioned.
 */

/**
 * HTTP cookie.
 * @class
 */
class Cookie {
	/**
	 * Creates a new Cookie instance.
	 * @constructor
	 * @param {string} name - The name of the cookie.
	 * @param {string} value - The value of the cookie.
	 * @param {CookieOptions} options - Additional options for the cookie.
	 */
	constructor(name, value, options = {}) {
		this.name = name;
		this.value = value;

		this.domain = options.domain;
		this.path = options.path;
		this.maxAge = options.maxAge;
		this.expires = options.expires;
		this.secure = options.secure;
		this.httpOnly = options.httpOnly;
		this.sameSite = options.sameSite;
		this.partitioned = options.partitioned;
	}

	/**
	 * Parses a string of cookies and returns a map of Cookie instances.
	 * @static
	 * @param {...string} args - The cookie strings to parse.
	 * @returns {Map<string,Cookie>} - A map of cookies, where the keys are cookie names, and the values are Cookie instances.
	 * @throws {TypeError} - If the argument is not a string.
	 */
	static from(...args) {
		const cookies = new Map();

		function tryDecode(str) {
			try {
				return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
			} catch (e) {
				return str;
			}
		}

		for (const input of args) {
			if (typeof input !== "string") {
				throw new TypeError("argument must be a string");
			}

			let index = 0;

			while (index < input.length) {
				// find first =
				const eqIdx = input.indexOf("=", index);

				if (eqIdx === -1) {
					break;
				}

				// find first ;
				let endIdx = input.indexOf(";", eqIdx);
				// if no ; found match to end of the string
				endIdx = endIdx === -1 ? input.length : endIdx;

				// match from start to first equal
				let key = input.slice(index, eqIdx).trim();

				// in case is malformed (example: fizz;foo=bar) ignore everything before ;
				const malformed = key.indexOf(";");
				if (malformed !== -1) {
					key = key.slice(malformed + 1).trim();
				}

				const val = input.slice(eqIdx + 1, endIdx).trim();

				if (!cookies.has(key)) {
					const cookieObj = {
						name: key,
						value: tryDecode(val),
					};

					if (input.charAt(endIdx) === ";") {
						let propStartIdx = endIdx + 1;
						let propEndIdx = input.indexOf("=", propStartIdx);

						while (propEndIdx !== -1) {
							const propName = input.slice(propStartIdx, propEndIdx).trim();
							propStartIdx = propEndIdx + 1;

							propEndIdx = input.indexOf("=", propStartIdx);
							const propValue = input
								.slice(propStartIdx, propEndIdx !== -1 ? propEndIdx : undefined)
								.trim();
							propStartIdx = propEndIdx !== -1 ? propEndIdx + 1 : input.length;

							cookieObj[propName] = tryDecode(propValue);
						}
					}
					cookies.set(key, new Cookie(cookieObj.name, cookieObj.value, cookieObj));
				}

				index = endIdx + 1;
			}
		}

		return cookies;
	}

	/**
	 * Serializes an array of Cookie instances into a single string.
	 * @static
	 * @param {...Cookie} args - The Cookie instances to serialize.
	 * @returns {string} - A string representing the serialized cookies.
	 * @throws {TypeError} - If the argument is not a Cookie instance.
	 */
	static serialize(...args) {
		let cookie = "";
		for (const input of args) {
			if (!(input instanceof Cookie)) {
				throw new TypeError("argument must be a Cookie");
			}
			cookie += input.toString();
		}
		return cookie;
	}

	/**
	 * Checks if the cookie is expired.
	 * @returns {boolean} - True if the cookie is expired, false otherwise.
	 * @throws {TypeError} - If the value of expires is invalid.
	 */
	isExpired() {
		if (!this.expires) return false;

		const isDate =
			Object.prototype.toString.call(this.expires) === "[object Date]" ||
			this.expires instanceof Date;

		if (!isDate || Number.isNaN(this.expires.valueOf())) {
			throw new TypeError("value of expires is invalid");
		}

		return new Date() > this.expires;
	}

	/**
	 * Converts the Cookie instance to a string.
	 * @returns {string} - A string representation of the Cookie.
	 * @throws {TypeError} - If the name or value is invalid.
	 */
	toString() {
		if (
			typeof this.name !== "string" ||
			!/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/.test(this.name)
		) {
			throw new TypeError("argument name is invalid");
		}

		const encodedValue = encodeURIComponent(this.value);
		if (
			typeof this.value !== "string" ||
			(encodedValue && !/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/.test(encodedValue))
		) {
			throw new TypeError("argument value is invalid");
		}

		let cookie = `${this.name}=${encodedValue}`;

		if (this.domain) {
			if (
				typeof this.domain !== "string" ||
				!/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/.test(this.domain)
			) {
				throw new TypeError("option domain is invalid");
			}
			cookie += `; Domain=${this.domain}`;
		}

		if (this.path) {
			if (!/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/.test(this.path)) {
				throw new TypeError("option path is invalid");
			}
			cookie += `; Path=${this.path}`;
		}

		if (null != this.maxAge) {
			const maxAge = this.maxAge - 0;
			if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
				throw new TypeError("option maxAge is invalid");
			}
			cookie += `; Max-Age=${Math.floor(maxAge)}`;
		}

		if (this.expires) {
			const isDate =
				Object.prototype.toString.call(this.expires) === "[object Date]" ||
				this.expires instanceof Date;
			if (!isDate || Number.isNaN(this.expires.valueOf())) {
				throw new TypeError("option expires is invalid");
			}
			cookie += `; Expires=${this.expires.toUTCString()}`;
		}

		if (this.secure) {
			if (typeof this.secure !== "boolean") {
				throw new TypeError("option secure is invalid");
			}
			cookie += "; Secure";
		}

		if (this.partitioned) {
			if (typeof this.partitioned !== "boolean") {
				throw new Error("option partitioned is invalid");
			}
			cookie += "; Partitioned";
		}

		if (this.sameSite) {
			if (typeof this.sameSite !== "string" && typeof this.sameSite !== "boolean") {
				throw new Error("option sameSite is invalid");
			}
			const sameSite =
				typeof this.sameSite === "string" ? this.sameSite.toLowerCase() : this.sameSite;
			switch (sameSite) {
				case true:
					cookie += "; SameSite=Strict";
					break;
				case "lax":
					cookie += "; SameSite=Lax";
					break;
				case "strict":
					cookie += "; SameSite=Strict";
					break;
				case "none":
					cookie += "; SameSite=None";
					break;
				default:
					throw new TypeError("option sameSite is invalid");
			}
		}

		if (this.httpOnly) {
			if (typeof this.httpOnly !== "boolean") {
				throw new TypeError("option httpOnly is invalid");
			}
			cookie += "; HttpOnly";
		}

		return cookie;
	}
}

module.exports = {
	Cookie,
};
