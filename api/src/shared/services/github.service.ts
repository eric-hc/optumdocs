import { Logger } from '@nestjs/common';
import * as shellJs from 'shelljs';
import simpleGit from 'simple-git';
import * as url from 'url';

export class GitHubService {
    public git = simpleGit();
    private _logger = new Logger();

    async buildgithubUrl(repo: string) {
        let gitHubUserName = null;
        let gitHubPassword = null;

        this.git.addConfig('user.email', 'email@email.net');
        this.git.addConfig('user.name', 'emailname');
        if (
            process.env.barista_github_username &&
            process.env.barista_github_token
        ) {
            gitHubPassword = process.env.barista_github_token;
            gitHubUserName = process.env.barista_github_username;
            const urlParts = url.parse(repo);
            urlParts.auth = `${gitHubUserName}:${gitHubPassword}`;

            return url.format(urlParts);
        }
    }
    async checkoutBranch(repo: string, branch: string, gitTmpDir: string) {
        const gitUrl = await this.buildgithubUrl(repo);

        await shellJs.cd(gitTmpDir);
        try {
            const gitOptions = [];
            gitOptions.push('--branch');
            gitOptions.push(branch);

            await this.git
                .clone(gitUrl, gitTmpDir)
                .cwd(gitTmpDir)
                .checkout(['source-branch']);
        } catch (e) {
            this._logger.error(e);
        }

        this._logger.log('temp dir = ' + gitTmpDir);
        return gitTmpDir;
    }
    async gitCommitandPush(
        repo: string,
        gitFolder: string,
        commitMessage: string,
    ) {
        const gitUrl = await this.buildgithubUrl(repo);

        const gitOptions = [];
        gitOptions.push('--no-verify');
        process.chdir(gitFolder);
        await this.git
            .pull(gitFolder, 'source-branch')
            .add('./*')
            .commit(commitMessage, gitOptions)
            .push(gitUrl, 'source-branch');
    }
}
