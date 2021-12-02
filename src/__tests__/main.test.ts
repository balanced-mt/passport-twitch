import { Strategy as TwitchStrategy, Scope as TwitchScopes } from "../index";

const validOptions = {
	clientID: "fdsfadsffdfadsfdasfd",
	clientSecret: "fdsfdasfsaijfdsaiofjsdifo",
	callbackURL: "http://localhost:8453/auth/callback",
	scope: [TwitchScopes.BitsRead, TwitchScopes.UserReadEmail]
};

const funcs = [
	"authorizationParams",
	"authenticate",
	"parseErrorResponse",
	"tokenParams",
	"userProfile"
	//"error" These methods show as available in the intellisense, but aren't actually able to be used
	//"fail",
	//"pass",
	//"redirect"
];

describe("class constructs properly", function () {
	let twitchStrategy: TwitchStrategy;
	it("constructs without error", () => {
		twitchStrategy = new TwitchStrategy<{ name: String }, { foo: string }>(validOptions, (_a, _b, _c, done) => {
			done(null, {}, {});
		});
	});

	it("has the name of 'twitch'", () => {
		expect(twitchStrategy.name).toEqual("twitch");
	});

	it("has the clientID set", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._clientId).toEqual(validOptions.clientID);
	});

	it("has the client secret set", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._clientSecret).toEqual(validOptions.clientSecret);
	});

	it("has the authorize url set", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._authorizeUrl).toEqual("https://id.twitch.tv/oauth2/authorize");
	});

	it("has the access token url set", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._accessTokenUrl).toEqual("https://id.twitch.tv/oauth2/token");
	});

	it("has the proper access token name", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._accessTokenName).toEqual("access_token");
	});

	it("has the auth method of `Bearer`", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._authMethod).toEqual("Bearer");
	});

	it("has the correct custom header", () => {
		///@ts-ignore
		const headers = twitchStrategy._oauth2._customHeaders;

		expect(headers["Client-ID"]).toEqual(validOptions.clientID);
	});

	it("is using authorization header for `GET`", () => {
		///@ts-ignore
		expect(twitchStrategy._oauth2._useAuthorizationHeaderForGET).toEqual(true);
	});

	it("has the correct callback url set", () => {
		///@ts-ignore
		expect(twitchStrategy._callbackURL).toEqual(validOptions.callbackURL);
	});

	it("has the correct scopes", () => {
		///@ts-ignore
		const _scopes = twitchStrategy._scope as string[];
		validOptions.scope.every((v) => _scopes.includes(v));
	});

	it("has the correct key set", () => {
		///@ts-ignore
		expect(twitchStrategy._key).toEqual("oauth2:id.twitch.tv");
	});

	it("has inherited methods", () => {
		for (const func of funcs) {
			expect(twitchStrategy[func as keyof TwitchStrategy]).toBeInstanceOf(Function);
		}
	});
});
