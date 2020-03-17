import { WebAPICallResult } from '@slack/web-api';
import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import { lsApi, startLSSession } from '../../branchBroadcast/liveshare';
import { SlackChannelSession } from '../../channels/channelSession';
import { CancellationError } from '../../errors/CancellationError';
import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import { ISlackIM } from '../../interfaces/ISlackIm';
import { ISlackUser } from '../../interfaces/ISlackUser';
import { getSlackAPI } from '../../slack/api';
import { SLACK_EMOJI_MAP } from '../../slack/constants';

interface ISlackUserWithIM extends ISlackUser {
    im: ISlackIM;
}

const getSlackUserChannel = async (
    allUsers: ISlackUser[],
    ims: ISlackIM[]
): Promise<ISlackUserWithIM> => {
    const users = getUsersWithIms(allUsers, ims);

    if (!users.length) {
        throw new Error('No users with IMs found.');
    }

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

interface ISlackImsWebCallResult extends WebAPICallResult {
    ims: ISlackIM[];
}

const SLACK_USER_CHANNEL_TYPE = 'slack-user';
const SLACK_CHANNEL_CHANNEL_TYPE = 'slack-channel';

type TSlackChannelType =
    | typeof SLACK_USER_CHANNEL_TYPE
    | typeof SLACK_CHANNEL_CHANNEL_TYPE;

interface IChannel {
    type: TSlackChannelType;
    account: IAccountRecord;
}

export interface ISlackUserChannel extends IChannel {
    type: typeof SLACK_USER_CHANNEL_TYPE;
    user: ISlackUserWithIM;
}

export interface ISlackChannelChannel extends IChannel {
    type: typeof SLACK_CHANNEL_CHANNEL_TYPE;
    channel: ISlackChannel;
}

export type TSlackChannel = ISlackUserChannel | ISlackChannelChannel;

// const isGroupExistsForTheUsers = (usergroups: , users: ISlackUser[]) => {

// }

const getUsersWithIms = (
    users: ISlackUser[],
    ims: ISlackIM[]
): ISlackUserWithIM[] => {
    const result: ISlackUserWithIM[] = [];

    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        const hasIm = ims.find((im) => {
            return (
                im.user === currentUser.id &&
                !im.is_user_deleted &&
                !im.is_archived
            );
        });

        if (hasIm) {
            result.push({
                ...currentUser,
                im: hasIm,
            });
        }
    }

    return result;
};

const getSlackAccountChannel = async (
    accountName: string
): Promise<ISlackUserChannel | undefined> => {
    const api = await getSlackAPI(accountName);

    const [usersResponse, imsResponse, channels] = await Promise.all<
        any,
        any,
        any
    >([api.users.list(), api.im.list(), api.channels.list()]);

    const users = usersResponse as ISlackUsersWebCallResult;
    const ims = imsResponse as ISlackImsWebCallResult;

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

    console.log(users, ims, channels);

    if (answer === USER_LABEL) {
        const userForChannel = await getSlackUserChannel(
            users.members,
            ims.ims
        );
        const account = await accountsKeychain.getAccount(accountName);

        if (!account) {
            throw new Error(
                `No account found for channel "${userForChannel.real_name}"`
            );
        }

        return {
            type: 'slack-user',
            user: userForChannel,
            account,
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
    const sessionReadOonluAnswer = await vscode.window.showQuickPick(
        ['Read/Write session', READ_ONLY_BUTTON],
        {
            placeHolder: 'Select session type',
            ignoreFocusOut: true,
        }
    );

    if (!sessionReadOonluAnswer) {
        throw new CancellationError('No session type selected.');
    }

    const isReadOnlySession = sessionReadOonluAnswer === READ_ONLY_BUTTON;

    const accounts = accountsKeychain.getAccountNames();

    // const connectors = connectorRepository.getConnectors();

    const accountOptions = accounts.map((account) => {
        return {
            label: account,
        };
    });

    const selectedAccount = await vscode.window.showQuickPick(accountOptions, {
        placeHolder: 'Select accounts to share into',
        // canPickMany: true,
    });

    if (!selectedAccount) {
        throw new CancellationError('No connectors selected.');
    }

    const slackChannel = await getSlackAccountChannel(selectedAccount.label);
    if (!slackChannel) {
        throw new CancellationError('No slack channel selected.');
    }

    await startLSSession(isReadOnlySession);
    const lsAPI = lsApi();

    const session = new SlackChannelSession(slackChannel, [], lsAPI);

    await session.init();

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
