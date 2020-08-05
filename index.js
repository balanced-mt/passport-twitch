/**
 * Module dependencies.
 */
var OAuth2Strategy = require("./oauth2");

/**
 * Framework version.
 */
module.exports.version = require("./package.json").version;

/**
 * Expose constructors.
 */
exports.Strategy =
exports.OAuth2Strategy = OAuth2Strategy;
