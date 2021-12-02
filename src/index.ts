/**
 * Module dependencies.
 */
import { Strategy as OAuth2Strategy } from "./oauth2";
import * as packageJSON from "../package.json";

/**
 * Framework version.
 */
const version = packageJSON.version;

/**
 * An enum to provide quick access to the various OAuth scopes.
 * refer to [Twitch Developer](https://dev.twitch.tv/docs/authentication#scopes)
 */
export enum Scope {
	/**
	 * View analytics data for the Twitch Extensions owned by the authenticated account.
	 * @type {Scope.AnalyticsReadExtensions}
	 */
	AnalyticsReadExtensions = "analytics:read:extensions",
	/**
	 * View analytics data for the games owned by the authenticated account.
	 * @type {Scope.AnalyticsReadGames}
	 */
	AnalyticsReadGames = "analytics:read:games",
	/**
	 * View Bits information for a channel.
	 * @type {Scope.BitsRead}
	 */
	BitsRead = "bits:read",
	/**
	 * Run commercials on a channel.
	 * @type {Scope.ChannelEditCommercial}
	 */
	ChannelEditCommercial = "channel:edit:commercial",
	/**
	 * Manage a channel’s broadcast configuration, including updating channel configuration and managing stream markers and stream tags.
	 * @type {Scope.ChannelManageBroadcast}
	 */
	ChannelManageBroadcast = "channel:manage:broadcast",
	/**
	 * Manage a channel’s Extension configuration, including activating Extensions.
	 * @type {Scope.ChannelManageExtensions}
	 */
	ChannelManageExtensions = "channel:manage:extensions",
	/**
	 * Manage a channel’s polls.
	 * @type {Scope.ChannelManagePolls}
	 */
	ChannelManagePolls = "channel:manage:polls",
	/**
	 * Manage of channel’s Channel Points Predictions
	 * @type {Scope.ChannelManagePredictions}
	 */
	ChannelManagePredictions = "channel:manage:predictions",
	/**
	 * Manage Channel Points custom rewards and their redemptions on a channel.
	 * @type {Scope.ChannelManageRedemptions}
	 */
	ChannelManageRedemptions = "channel:manage:redemptions",
	/**
	 * Manage a channel’s stream schedule.
	 * @type {Scope.ChannelManageSchedule}
	 */
	ChannelManageSchedule = "channel:manage:schedule",
	/**
	 * Manage a channel’s videos, including deleting videos.
	 * @type {Scope.ChannelManageVideos}
	 */
	ChannelManageVideos = "channel:manage:videos",
	/**
	 * View a list of users with the editor role for a channel.
	 * @type {Scope.ChannelReadEditors}
	 */
	ChannelReadEditors = "channel:read:editors",
	/**
	 * View Creator Goals for a channel.
	 * @type {Scope.ChannelReadGoals}
	 */
	ChannelReadGoals = "channel:read:goals",
	/**
	 * View Hype Train information for a channel.
	 * @type {Scope.ChannelReadHypetrain}
	 */
	ChannelReadHypetrain = "channel:read:hype_train",
	/**
	 * View a channel’s polls.
	 * @type {Scope.ChannelReadPolls}
	 */
	ChannelReadPolls = "channel:read:polls",
	/**
	 * View a channel’s Channel Points Predictions.
	 * @type {Scope.ChannelReadPredictions}
	 */
	ChannelReadPredictions = "channel:read:predictions",
	/**
	 * View Channel Points custom rewards and their redemptions on a channel.
	 * @type {Scope.ChannelReadRedemptions}
	 */
	ChannelReadRedemptions = "channel:read:redemptions",
	/**
	 * View an authorized user’s stream key.
	 * @type {Scope.ChannelReadStreamKey}
	 */
	ChannelReadStreamKey = "channel:read:stream_key",
	/**
	 * View a list of all subscribers to a channel and check if a user is subscribed to a channel.
	 * @type {Scope.ChannelReadSubscriptions}
	 */
	ChannelReadSubscriptions = "channel:read:subscriptions",
	/**
	 * Manage Clips for a channel.
	 * @type {Scope.ClipsEdit}
	 */
	ClipsEdit = "clips:edit",
	/**
	 * View a channel’s moderation data including Moderators, Bans, Timeouts, and Automod settings.
	 * @type {Scope.ModerationRead}
	 */
	ModerationRead = "moderation:read",
	/**
	 * Ban and unban users.
	 * @type {Scope.ModeratorManageBannedUsers}
	 */
	ModeratorManageBannedUsers = "moderator:manage:banned_users",
	/**
	 * View a broadcaster’s list of blocked terms.
	 * @type {Scope.ModeratorReadBlockedTerms}
	 */
	ModeratorReadBlockedTerms = "moderator:read:blocked_terms",
	/**
	 * Manage a broadcaster’s list of blocked terms.
	 * @type {Scope.ModeratorManageBlockedTerms}
	 */
	ModeratorManageBlockedTerms = "moderator:manage:blocked_terms",
	/**
	 * Manage messages held for review by AutoMod in channels where you are a moderator.
	 * @type {Scope.ModeratorManageAutomod}
	 */
	ModeratorManageAutomod = "moderator:manage:automod",
	/**
	 * View a broadcaster’s AutoMod settings.
	 * @type {Scope.ModeratorReadAutomodSettings}
	 */
	ModeratorReadAutomodSettings = "moderator:read:automod_settings",
	/**
	 * Manage a broadcaster’s AutoMod settings.
	 * @type {Scope.ModeratorManageAutmodSettings}
	 */
	ModeratorManageAutmodSettings = "moderator:manage:automod_settings",
	/**
	 * View a broadcaster’s chat room settings.
	 * @type {Scope.ModeratorReadChatSettings}
	 */
	ModeratorReadChatSettings = "moderator:read:chat_settings",
	/**
	 * Manage a broadcaster’s chat room settings.
	 * @type {Scope.ModeratorManageChatSettings}
	 */
	ModeratorManageChatSettings = "moderator:manage:chat_settings",
	/**
	 * Manage a user object.
	 * @type {Scope.UserEdit}
	 */
	UserEdit = "user:edit",
	/**
	 * @deprecated
	 * Deprecated. Was previously used for “Create User Follows” and “Delete User Follows.”
	 * @type {Scope.UserEditFollows}
	 */
	UserEditFollows = "user:edit:follows",
	/**
	 * Manage the block list of a user.
	 * @type {Scope.UserManageBlockedUsers}
	 */
	UserManageBlockedUsers = "user:manage:blocked_users",
	/**
	 * View the block list of a user.
	 * @type {Scope.UserReadBlockedUsers}
	 */
	UserReadBlockedUsers = "user:read:blocked_users",
	/**
	 * View a user’s broadcasting configuration, including Extension configurations.
	 * @type {Scope.UserReadBroadcast}
	 */
	UserReadBroadcast = "user:read:broadcast",
	/**
	 * View a user’s email address.
	 * @type {Scope.UserReadEmail}
	 */
	UserReadEmail = "user:read:email",
	/**
	 * View the list of channels a user follows.
	 * @type {Scope.UserReadFollows}
	 */
	UserReadFollows = "user:read:follows",
	/**
	 * View if an authorized user is subscribed to specific channels.
	 * @type {Scope.UserReadSubscriptions}
	 */
	UserReadSubscriptions = "user:read:subscriptions"
}

/**
 * Expose constructors.
 */
export { version, OAuth2Strategy, OAuth2Strategy as Strategy };
