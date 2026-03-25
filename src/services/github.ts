import { Octokit } from "@octokit/rest";
import { ENV } from "../config/env";

const octokit = new Octokit({
  auth: ENV.GT_ACCESS_TOKEN,
  baseUrl: "https://api.github.com",
});

export const createGithubIssue = async (title: string, body: string) => {
  return octokit.rest.issues.create({
    owner: ENV.GT_USERNAME,
    repo: ENV.GT_REPOSITORY,
    title,
    body,
  });
};
