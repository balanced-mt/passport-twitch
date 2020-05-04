# passport-twitch

Twitch is a trademark or registered trademark of Twitch Interactive, Inc. in the U.S. and/or other countries. "passport-twitch" is not operated by, sponsored by, or affiliated with Twitch Interactive, Inc. in any way.

[Passport](http://passportjs.org/) strategies for authenticating with [Twitch](http://www.twitch.tv/)
using OAuth 2.0 on the New Twitch API.

This module lets you authenticate using Twitch in your Node.js applications.
By plugging into Passport, Twitch authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/) and [Koa](http://koajs.com/).

## Install
```bash
$ npm install @d-fischer/passport-twitch
```
## Usage of OAuth 2.0

#### Configure Strategy

The Twitch OAuth 2.0 authentication strategy authenticates users using a Twitch
account and OAuth 2.0 tokens. The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```javascript
var passport       = require("passport");
var twitchStrategy = require("passport-twitch-new").Strategy;

passport.use(new twitchStrategy({
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ twitchId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `"twitch"` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
```

Optionally, the `forceVerify` option can be set to `true` to indicate
that the user should be re-prompted for authorization:

```javascript
app.get("/auth/twitch", passport.authenticate("twitch", {forceVerify: true}));
```

## Example

```javascript
var express        = require("express");
var bodyParser     = require("body-parser");
var cookieParser   = require("cookie-parser");
var cookieSession  = require("cookie-session");
var passport       = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;

var app = express();

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
    callbackURL: "http://127.0.0.1:3000/auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    // Suppose we are using mongo..
    User.findOrCreate({ twitchId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

app.listen(3000);
```

## License

The MIT License (MIT)

Full text in LICENSE file
