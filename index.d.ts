/**
 * Additional options for the cookie.
 */
export type CookieOptions = {
	/**
	 * - The domain of the cookie.
	 */
	domain?: string;
	/**
	 * - The path of the cookie.
	 */
	path?: string;
	/**
	 * - The maximum age of the cookie in seconds.
	 */
	maxAge?: number;
	/**
	 * - The expiration date of the cookie.
	 */
	expires?: Date;
	/**
	 * - Indicates if the cookie should only be sent over secure connections.
	 */
	secure?: boolean;
	/**
	 * - Indicates if the cookie should be accessible only through HTTP requests.
	 */
	httpOnly?: boolean;
	/**
	 * - The SameSite attribute of the cookie.
	 */
	sameSite?: string | boolean;
	/**
	 * - Indicates if the cookie is partitioned.
	 */
	partitioned?: boolean;
};
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
export class Cookie {
	/**
	 * Parses a string of cookies and returns a map of Cookie instances.
	 * @static
	 * @param {...string} args - The cookie strings to parse.
	 * @returns {Map<string,Cookie>} - A map of cookies, where the keys are cookie names, and the values are Cookie instances.
	 * @throws {TypeError} - If the argument is not a string.
	 */
	static from(...args: string[]): Map<string, Cookie>;
	/**
	 * Serializes an array of Cookie instances into a single string.
	 * @static
	 * @param {...Cookie} args - The Cookie instances to serialize.
	 * @returns {string} - A string representing the serialized cookies.
	 * @throws {TypeError} - If the argument is not a Cookie instance.
	 */
	static serialize(...args: Cookie[]): string;
	/**
	 * Creates a new Cookie instance.
	 * @constructor
	 * @param {string} name - The name of the cookie.
	 * @param {string} value - The value of the cookie.
	 * @param {CookieOptions} options - Additional options for the cookie.
	 */
	constructor(name: string, value: string, options?: CookieOptions);
	name: string;
	value: string;
	domain: string;
	path: string;
	maxAge: number;
	expires: Date;
	secure: boolean;
	httpOnly: boolean;
	sameSite: string | boolean;
	partitioned: boolean;
	/**
	 * Checks if the cookie is expired.
	 * @returns {boolean} - True if the cookie is expired, false otherwise.
	 * @throws {TypeError} - If the value of expires is invalid.
	 */
	isExpired(): boolean;
	/**
	 * Converts the Cookie instance to a string.
	 * @returns {string} - A string representation of the Cookie.
	 * @throws {TypeError} - If the name or value is invalid.
	 */
	toString(): string;
}
