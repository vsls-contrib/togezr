import { WebAPICallResult } from '@slack/web-api';
import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import { CancellationError } from '../../errors/CancellationError';
import { ISlackUser } from '../../interfaces/ISlackUser';
import { getSlackAPI } from '../../slack/api';
import { SLACK_EMOJI_MAP } from '../../slack/constants';

const getSlackUserChannel = async (
    users: ISlackUser[]
): Promise<ISlackUser> => {
    const options = users
        .map((user) => {
            const { profile } = user;

            const description = `${SLACK_EMOJI_MAP[profile.status_emoji]} ${
                profile.status_text
            }`;

            return {
                label: user.real_name,
                description,
                user,
            };
        })
        .filter((user) => {
            // && !user.user.is_bot
            return !!user.label;
        });

    const selectedUser = await vscode.window.showQuickPick(options, {
        // canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: 'Select users to share with',
    });

    if (!selectedUser) {
        throw new CancellationError();
    }

    return selectedUser.user;
};

interface ISlackUsersWebCallResult extends WebAPICallResult {
    members: ISlackUser[];
}

interface IUsersChannelResponse {
    type: 'user';
    user: ISlackUser;
}

// const isGroupExistsForTheUsers = (usergroups: , users: ISlackUser[]) => {

// }

const getSlackAccountChannel = async (
    accountName: string
): Promise<IUsersChannelResponse | undefined> => {
    const api = await getSlackAPI(accountName);

    const [usersResponse, usergroups, channels] = await Promise.all<
        any,
        any,
        any
    >([api.users.list(), api.usergroups.list(), api.channels.list()]);

    const users = usersResponse as ISlackUsersWebCallResult;

    const channelOptions = [];

    const USER_LABEL = 'User';
    // const USER_GROUPS_LABEL = 'User Groups';
    const CHANNELS_LABEL = 'Channels';

    if (users.ok && users.members.length) {
        channelOptions.push(USER_LABEL);
    }

    // if (usergroups.ok && usergroups.usergroups.length) {
    //     channelOptions.push(USER_GROUPS_LABEL);
    // }

    if (channels.ok && channels.channels.length) {
        channelOptions.push(CHANNELS_LABEL);
    }

    const answer = await vscode.window.showQuickPick(channelOptions, {
        ignoreFocusOut: true,
        placeHolder: 'Where do you want to post?',
    });

    if (!answer) {
        throw new CancellationError('No channel selected.');
    }

    console.log(users, usergroups, channels);

    if (answer === USER_LABEL) {
        const userForChannel = await getSlackUserChannel(users.members);

        return {
            type: 'user',
            user: userForChannel,
        };
    }

    // members, usergroups, channels

    // return users;
};

export const shareIntoAccountCommand = async () => {
    if (!vscode.workspace.rootPath) {
        throw new Error('Please open a project to share.');
    }

    const READ_ONLY_BUTTON = 'Read-only session';
    const answer = await vscode.window.showQuickPick(
        ['Read/Write session', READ_ONLY_BUTTON],
        {
            placeHolder: 'Select session type',
            ignoreFocusOut: true,
        }
    );

    if (!answer) {
        throw new CancellationError('No session type selected.');
    }

    // const isReadOnlySession = answer === READ_ONLY_BUTTON;

    const accounts = accountsKeychain.getAccountNames();

    // const connectors = connectorRepository.getConnectors();

    const accountOptions = accounts.map((account) => {
        return {
            label: account,
        };
    });

    const selectedAccount = await vscode.window.showQuickPick(accountOptions, {
        placeHolder: 'Select conenctors to share into',
        // canPickMany: true,
    });

    if (!selectedAccount) {
        throw new CancellationError('No connectors selected.');
    }

    await getSlackAccountChannel(selectedAccount.label);

    // const connectorsData: IConnectorData[] = [];
    // for (let { connector } of selectedConnectors) {
    //     const init = getConnectorRegistrationInitializer(connector.type);

    //     if (!init) {
    //         connectorsData.push(connector);
    //         continue;
    //     }

    //     const data = await init.getData(connector.id, true);

    //     connectorsData.push({ ...connector, data });
    // }

    // let repo: Repository | undefined;
    // let branch: Branch | undefined;
    // try {
    //     repo = getCurrentRepo();
    //     branch = getCurrentBranch();
    // } catch {}

    // const registryData = await registerBranch({
    //     repoId: repo && repo.rootUri.toString(),
    //     branchName: branch && branch.name,
    //     connectorsData,
    //     isReadOnly: isReadOnlySession,
    //     isTemporary: true,
    //     repoRootPath: vscode.workspace.rootPath.toString(),
    // });

    // await startLiveShareSession(registryData.id);
};
