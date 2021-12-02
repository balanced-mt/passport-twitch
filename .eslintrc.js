module.exports = {
	extends: ["eslint:recommended", "plugin:eslint-comments/recommended"],
	root: true,
	parserOptions: {
		ecmaVersion: 2017,
		project: ["./tsconfig.json"]
	},
	env: {
		es6: true,
		browser: true,
		commonjs: true,
		node: true
	},
	settings: {
		// eslint-plugin-import Settings
		"import/extensions": [".js"],
		"import/parsers": { "@typescript-eslint/parser": [".ts"] }
	},
	rules: {}
};
