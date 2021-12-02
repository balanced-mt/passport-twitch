import { Strategy as TwitchStrategy } from "../src";

const ts = new TwitchStrategy(
	{
		clientSecret: "fdsfadfsafddfas",
		clientID: "fdsafdasffadsfsa",
		callbackURL: "fdsfadfsdafdsa",
		scope: []
	},
	(a, b, c) => {
		c(null);
	}
);

ts.error("fdsa");
