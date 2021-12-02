import { InternalOAuthError } from "passport-oauth2";
import { Scope as TwitchScopes, Strategy as TwitchStrategy } from "../index";
import passport from "passport";
const validOptions = {
	clientID: "fdsfadsffdfadsfdasfd",
	clientSecret: "fdsfdasfsaijfdsaiofjsdifo",
	callbackURL: "http://localhost:8453/auth/callback",
	scope: [TwitchScopes.BitsRead, TwitchScopes.UserReadEmail]
};

const req = {}

const res = {
	statusCode: 0,
	redirectUrl: "",
	headers: {
		Location: undefined as any,
	},
	sendStatus: {} as any,
	status: {} as any,
	setHeader: {} as any,
	end: {} as any,
	json: {} as any,
	send: {} as any,
	sendData: {} as any,
	redirect: {} as any,
}

const store = {
	authenticate: undefined as any,
}

const exampleLogin = async (req: any, res: any) => {
	passport.authenticate("twitch", {session: false},(err, user) => {
		if(err) {
			res.sendStatus(500);
			return;
		}
		res.sendStatus(200);
	})(req, res)
}

beforeAll(() => {
	res.sendStatus = jest.fn((status) => {
		res.status = status;
		return res
	})

	res.setHeader = jest.fn((key, value) =>  {
		Object.defineProperty(res.headers, key, {
			value: value,
			enumerable: true,
			writable: true,
			configurable: true
		})
		return res;
	})

	res.end = jest.fn(() => {
		console.log(`request end`)
		return res;
	})

	res.send = jest.fn((data) => {
		res.sendData = data;
		return res;
	})

	res.json = jest.fn((data) => {
		res.sendData = data;
		return res;
	})

	res.redirect = jest.fn((url: string) => {
		res.redirectUrl = url;
		return res;
	})

	res.status = jest.fn((status: number) => {
		res.statusCode = status;
		return res;
	})
})

describe("integration#passport", () => {
	const strategy = new TwitchStrategy(validOptions, (access, refresh, done) => {
		console.log(`well this ran?`)
		done();
	});

	store.authenticate = passport.authenticate;
	passport.use(strategy);
	it("Should fail to authenticate", async () => {
		///@ts-ignore
		passport.authenticate = jest.fn((authType,options, cb) => () => {
			if(typeof cb === "function") {
				cb('Error doing something', null);
			} else {
				console.log(`it wasnt a function!`)
			}
		});
		await exampleLogin(req, res);
		expect(passport.authenticate).toHaveBeenCalledTimes(1);
		expect(res.sendStatus).toHaveBeenCalledWith(500);
	});

	it("Should pass authentication", async () => {
		///@ts-ignore
		passport.authenticate = jest.fn((authType, options, cb) => () => {
			if(typeof cb === "function") {
				cb(null, {})
			} else {
				console.log("failed to get a function")
			}
		})

		await exampleLogin(req, res);

		expect(passport.authenticate).toHaveBeenCalledTimes(1);
		expect(res.sendStatus).toHaveBeenCalledWith(200);
	})

	it("Should be redirected to the correct URL", async () => {
		passport.authenticate = store.authenticate
		await exampleLogin(req, res);
		expect(res.headers.Location).toBeDefined();
		expect(res.headers.Location).toEqual("https://id.twitch.tv/oauth2/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8453%2Fauth%2Fcallback&scope=bits%3Aread%20user%3Aread%3Aemail&client_id=fdsfadsffdfadsfdasfd");
		expect(res.statusCode).toEqual(302);
	})
});

describe("Get user profile information", () => {
	const strategy = new TwitchStrategy(validOptions, (access, refresh, done) => {
		console.log(`well this ran?`)
		done();
	});

	const createMockGetter = (err: any, payload: any) => {
		return jest.fn((url, accessToken, cb) => {
			cb(err, payload);
		})
	}

	const mockGetter = jest.fn((url, accessToken, cb) => {
		console.log(`getting`, url, accessToken)
		cb()
	});
	it("should throw an error getting the profile", (done) => {
		///@ts-ignore
		strategy._oauth2.get = createMockGetter({}, undefined);
		///@ts-ignore
		strategy.userProfile("fdsa123", (e, payload) => {
			expect(e).toBeInstanceOf(InternalOAuthError);
			expect(e!.message).toEqual("failed to fetch user profile")
			done();
		})
	})

	it("should error because body is completely empty", (done) => {
		///@ts-ignore
		strategy._oauth2.get = createMockGetter(null, undefined);

		strategy.userProfile("fdsa123", (e, payload) => {
			expect(e).toBeInstanceOf(InternalOAuthError);
			expect(e!.message).toEqual("body was empty")
			done();
		})
	})

	it("should error out because the body was invalid", (done) => {
		///@ts-ignore
		strategy._oauth2.get = createMockGetter(null, "")

		strategy.userProfile("fdsa123", (e, payload) => {
			expect(e).toBeInstanceOf(SyntaxError);
			done();
		})
	})

	it("should error out if the root of the body is an object and not an array", (done) => {
		///@ts-ignore
		strategy._oauth2.get = createMockGetter(null, JSON.stringify({test: "value"}))
		strategy.userProfile("fdsa123", (e, payload) => {
			expect(e).toBeInstanceOf(TypeError);
			expect(e!.message).toEqual("Cannot read property '0' of undefined")
			done();
		})
	})

	it("should pass with the user data being a buffer", (done) => {
		const userData = {test: "data", provider: "twitch"}
		const data = JSON.stringify({data: [userData]})
		///@ts-ignore
		strategy._oauth2.get = createMockGetter(null, Buffer.from(data))
		strategy.userProfile("fdsa123", (e, payload) => {
			expect(e).toBe(null);
			expect(payload).toEqual(userData);
			done();
		})
	})

	const expectedProfileProps = [
		"provider",
		"id",
		"username",
		"displayName"
	]

	const invalidUsers = [
		{
			provider: "twitch",
			id: "9494893",
			userName: "test",
			displayName: "test",
			reason: "username is misspelled"
		},
		{
			provider: "twitch",
			reason: "missing everything but `provider`"
		},
		{
			provider: "",
			id: "4948393",
			username: "test",
			displayName: "test",
			reason: "provider is empty"
		},
		{reason: "the object is empty"},
		{
			provider: "twitch",
			ID: "4494993",
			username: "test",
			displayname: "test",
			reason: "id is all caps"
		}
	]

	const validUsers = [
		{
			provider: "twitch",
			id: "4490493",
			username: "test",
			displayName: "test"
		},
		{
			provider: "twitch",
			id: "94598483",
			username: "test2",
			displayName: "test3"
		}
	]

	for(const [i, user] of invalidUsers.entries()) {
		it(`user should fail because ${user.reason}`, () => {
			const hasRequiredProps = expectedProfileProps.every(v => Object.keys(user).includes(v))
			expect(user.provider === "twitch" && hasRequiredProps).toBe(false);
		})
	}

	for(const [i, user] of validUsers.entries()) {
		it("user should pass being valid", () => {
			const hasRequiredProps = expectedProfileProps.every(v => Object.keys(user).includes(v))
			expect(user.provider === "twitch" && hasRequiredProps).toBe(true);
		})
	}
})

export {}
