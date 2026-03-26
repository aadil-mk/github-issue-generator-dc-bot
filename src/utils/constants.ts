export const CUSTOM_IDS = {
  ISSUE_SELECT_MENU: "openIssueModal_select",
  MODAL_PREFIX: "IssueModal", // full id: `{MODAL_PREFIX}:{type}`
  ATTACHMENT_DONE_BTN: "attachment_done",
  ATTACHMENT_SKIP_BTN: "attachment_skip",
  DUPLICATE_CREATE_ANYWAY_BTN: "duplicate_create_anyway",
  DUPLICATE_CANCEL_BTN: "duplicate_cancel",
} as const;

// Rate limiting, timeouts, and file-size cap — tune here, not in service files.
export const LIMITS = {
  RATE_LIMIT_MAX: 5, // max issues per user per window
  RATE_LIMIT_WINDOW_MS: 60 * 60 * 1_000, // 1 hour
  ATTACHMENT_TIMEOUT_MS: 60_000 * 3, // 3 minutes to upload files
  DUPLICATE_TIMEOUT_MS: 60_000, // 1 minute to respond to duplicate warning
  MAX_ATTACHMENT_BYTES: 10 * 1024 * 1024, // 10 MB
} as const;

// Where attachments are stored in the GitHub repo.
export const GITHUB_ASSETS = {
  FOLDER: "issue-assets",
  COMMIT_MESSAGE: "chore: add issue asset",
} as const;

export const PUBLIC_COMMANDS = ["help", "info"] as const;
