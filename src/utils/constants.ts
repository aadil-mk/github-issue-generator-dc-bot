/**
 * Shared Discord interaction custom ID constants.
 * Centralised here to avoid magic strings scattered across files.
 */
export const CUSTOM_IDS = {
  /** customId for the issue type select menu posted by /setup-ticket */
  ISSUE_SELECT_MENU: "openIssueModal_select",

  /** Prefix for all issue modal customIds — full id is `{MODAL_PREFIX}:{type}` */
  MODAL_PREFIX: "IssueModal",
} as const;
