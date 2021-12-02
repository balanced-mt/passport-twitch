/**
 * Module dependencies.
 */
import OAuth2Strategy, { InternalOAuthError, VerifyCallback } from "passport-oauth2";

type StrategyOptions = {
	pem?: string;
	callbackURL: string;
	scope: string[];
} & OAuth2Strategy.StrategyOptions;

type InputStrategyOptions = Partial<StrategyOptions> &
	Pick<StrategyOptions, "clientID" | "clientSecret" | "scope" | "callbackURL">;

type UserProfile = {
	provider: string;
	id: string;
	username: string;
	displayName: string;
};

class OAuthStrategyWithPEM<T = any, U = any> extends OAuth2Strategy {
	pem?: string;
	constructor(options: StrategyOptions, verify: VerifyFunction<T, U>) {
		super(options, verify);
	}
}
type VerifyFunction<T, U = any> = (
	accessToken: string,
	refreshToken: string,
	profile: T,
	verified: VerifyCallback
) => void;

/**
 * `Strategy` constructor.
 *
 * The Twitch authentication strategy authenticates requests by delegating to
 * Twitch using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Twitch application"s client id
 *   - `clientSecret`  your Twitch application"s client secret
 *   - `callbackURL`   URL to which Twitch will redirect the user after granting authorization
 *   - `pem`           Signing certificate used for decoding a user's OIDC token
 *
 * Examples:
 *
 *     passport.use(new TwitchStrategy({
 *         clientID: "123-456-789",
 *         clientSecret: "shhh-its-a-secret"
 *         callbackURL: "https://www.example.net/auth/twitch/callback"
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user)
 *         })
 *       }
 *     ))
 *
 * @param {InputStrategyOptions} options
 * @param {VerifyFunction} verify
 * @api public
 */
class Strategy<T = any, U = any, Y extends { forceVerify: boolean } = any> extends OAuthStrategyWithPEM<T, U> {
	private readonly __userProfileURL: string;
	constructor(options: InputStrategyOptions, verify: VerifyFunction<T, U>) {
		options = options || {};
		options.authorizationURL = options.authorizationURL || "https://id.twitch.tv/oauth2/authorize";
		options.tokenURL = options.tokenURL || "https://id.twitch.tv/oauth2/token";
		options.customHeaders = options.customHeaders || {};
		options.customHeaders["Client-ID"] = options.clientID;
		super(options as StrategyOptions, verify);

		this.name = "twitch";
		this.pem = options.pem;
		this._oauth2.setAuthMethod("Bearer");
		this._oauth2.useAuthorizationHeaderforGET(true);
		this.__userProfileURL  = "https://api.twitch.tv/helix/users";
	}

	/**
	 * Retrieve user profile from Twitch.
	 *
	 * This function constructs a normalized profile, with the following properties:
	 *
	 *   - `provider`         always set to `twitch`
	 *   - `id`
	 *   - `username`
	 *   - `displayName`
	 *
	 * @param {String} accessToken
	 * @param {((e: InternalOAuthError | null, payload: UserProfile | undefined) => void)} done
	 * @api protected
	 */
	public userProfile(accessToken: string, done: (e: InternalOAuthError | null, payload?: UserProfile) => void) {
		this._oauth2.get(this.__userProfileURL, accessToken, function (err, body, res) {
			if (err) {
				return done(new InternalOAuthError("failed to fetch user profile", err));
			}

			if (body === undefined) {
				return done(new InternalOAuthError("body was empty", new Error("body was empty")));
			}

			let output: string;
			if (typeof body === "string") {
				output = body;
			} else {
				output = body.toString("utf-8");
			}
			try {
				done(null, {
					...JSON.parse(output).data[0],
					provider: "twitch"
				});
			} catch (e: any) {
				done(e);
			}
		});
	}

	public authorizationParams(options: Y): any {
		const params = {} as { force_verify: boolean };
		if (typeof options.forceVerify !== "undefined") {
			params.force_verify = !!options.forceVerify;
		}
		return params;
	}
}

export { Strategy };
