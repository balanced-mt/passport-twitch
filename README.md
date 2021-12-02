<h1 align="center">Passport Twitch 🔐</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D10-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

#### This package fixes Webpack dependency bundling and unable to find the package.json file and adds 📘 TYPES

> Twitch authentication strategy using Helix for Passport. Supports the April 2020 Twitch changes!

Twitch is a trademark or registered trademark of Twitch Interactive, Inc. in the U.S. and/or other countries. "passport-twitch" is not operated by, sponsored by, or affiliated with Twitch Interactive, Inc. in any way.

[Passport](http://passportjs.org/) strategy for authenticating with [Twitch](http://www.twitch.tv/)
using OAuth 2.0 on Helix (the New Twitch API).

This module lets you authenticate using Twitch in your Node.js applications.
By plugging into Passport, Twitch authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/) style middleware, including
[Express](http://expressjs.com/) and [Koa](http://koajs.com/).

## Prerequisites

- node >=10

## Install

```sh
yarn install @hewmen/passport-twitch
```

## Example

The Twitch OAuth 2.0 authentication strategy authenticates users using a Twitch
account and OAuth 2.0 tokens. The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.


### Configure Strategy
```typescript
import passport from "passport";
import { Strategy as TwitchStrategy, Scope } from "@hewmen/passport-twitch";

const onStrategyCallback = (accessToken: string, refreshToken: string, profile: T, done: (err: Error | null, user?: UserType) => void) => {
    User.findOrCreate({twitchId: profile.id}, (err, user) => {
        done(err, user);
    })
}

const myStrategy = new TwitchStrategy({
    clientID: "twitch_client_id",
    clientSecret: "twitch_client_secret",
    callbackURL: "http://localhost:3000/auth/twitch/callback",
    scope: [Scope.UserReadEmail]
}, onStrategyCallback);

passport.use(myStrategy);
```

### Authenticate Requests
Use `passport.authenticate()`, specifying the `"twitch"` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```typescript
import express from "express";

const app = express();

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/");
});
```

Optionally, the `forceVerify` option can be set to `true` to indicate
that the user should be re-prompted for authorization:
```typescript
app.get("/auth/twitch", passport.authenticate("twitch", {forceVerify: true}));
```

### Complete Example:

```typescript
import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import { Strategy as TwitchStrategy, Scope } from "@hewmen/passport-twitch";

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({secret:"somesecrettokenhere"}));
app.use(passport.initialize());
app.use(express.static("./public"));

passport.use(new twitchStrategy({
    clientID: "098f6bcd4621d373cade4e832627b4f6",
    clientSecret: "4eb20288afaed97e82bde371260db8d8",
    callbackURL: "http://localhost:3000/auth/twitch/callback",
    scope: [Scope.UserReadEmail]
  },
  (accessToken, refreshToken, profile, done) => {
    // Suppose we are using mongo..
    User.findOrCreate({ twitchId: profile.id }, function (err, user) {
      done(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
});

app.listen(3000);
```

## Author

👤 **Hewmen**

* Website: https://hewmen.com
* Github: [@hewmen](https://github.com/hewmen)

## Show your support

Give a ⭐️ if this project helped you!
