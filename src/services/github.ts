import { Octokit } from "@octokit/rest";
import { ENV } from "../utils/constants";

const octokit = new Octokit({
    auth: ENV.GITHUB_ACCESS_TOKEN,
    baseUrl: "https://api.github.com",
});

export const createGithubIssue = async (title: string, body: string) => {
    return octokit.rest.issues.create({
        owner: ENV.GITHUB_USERNAME,
        repo: ENV.GITHUB_REPOSITORY,
        title,
        body,
    });
};
