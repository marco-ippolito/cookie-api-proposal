# Biscotto - WHATWG Cookie API proposal implementation

Implementation for the [WHATWG Cookie API proposal](https://github.com/whatwg/html/issues/9935).

## Usage

### Constructor

```javascript
const cookie = new Cookie(name, value, options);
```

Cookie options:

- `domain` (optional): The domain of the cookie.
- `path` (optional): The path of the cookie.
- `maxAge` (optional): The maximum age of the cookie in seconds.
- `expires` (optional): The expiration date of the cookie.
- `secure` (optional): Indicates if the cookie should only be sent over secure connections.
- `httpOnly` (optional): Indicates if the cookie should be accessible
only through HTTP requests.
- `sameSite` (optional): The SameSite attribute of the cookie,
accepts a string or boolean.
- `partitioned` (optional): Indicates if the cookie is partitioned.

### Static Methods

#### `Cookie.from`

Parses a string of cookies and returns a map of Cookie instances.

```javascript

const cookies = Cookie.from("foo=bar; Path=/; Secure");

cookies.get("foo").value // bar

cookies.get("foo").path // "/"

cookies.get("foo").secure // true

const multipleCookies = Cookie.from(...["foo=bar", "bar=baz"]);

multipleCookies.get("foo").value // bar

multipleCookies.get("bar").value // baz
```

#### `Cookie.serialize`

Serializes Cookie instances into a single string.

```javascript
Cookie.serialize(new Cookie("foo", "bar")); // "foo=bar"

Cookie.serialize(...[new Cookie("foo", "bar"), new Cookie("bar", "baz")]) // "foo=bar;bar=baz"
```

### Instance Methods

#### `isExpired()`

Checks if the cookie is expired.

```javascript
const cookie = new Cookie("foo", "bar", { expires: new Date('01/01/1970')});
cookie.isExpired(); // true
```

#### `toString()`

Converts the Cookie instance to a string.

```javascript
const cookie = new Cookie("foo", "bar");
cookie.toString(); // "foo=bar"
```

### Examples

#### Creating a Cookie

```javascript
const cookie = new Cookie("username", "john_doe", {
  domain: "example.com",
  path: "/",
  maxAge: 3600,
  expires: new Date("2024-01-03T12:00:00Z"),
  secure: true,
  httpOnly: true,
  sameSite: "strict",
  partitioned: false,
});
```

#### Parsing Cookies

```javascript
const cookieStrings = ["username=john_doe; Path=/", "user_id=123; Path=/"];

const cookies = Cookie.from(...cookieStrings);

cookies.get("username").value // john_doe

cookies.get("user_id").value // user_id
```

#### Serializing Cookies

```javascript
const cookie1 = new Cookie("username", "john_doe", { path: "/" });
const cookie2 = new Cookie("user_id", "123", { path: "/" });

Cookie.serialize(cookie1, cookie2); // "username=john_doe; Path=/; user_id=123; Path=/"
```

## License

This library is licensed under the [Apache 2.0 License](LICENSE).
