import fetch from 'node-fetch';
import * as vscode from 'vscode';
import {
    connectorRepository,
    ISlackConnector,
} from '../../connectorRepository/connectorRepository';
import { CancellationError } from '../../errors/CancellationError';
import { IConnectorRegistrationIitializer } from '../../interfaces/IConnectorRegitrationInitializer';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import * as keytar from '../../keytar';

export class SlackConnectorRegistrationInitializer
    implements IConnectorRegistrationIitializer {
    public getData = async (id: string) => {
        const connector = connectorRepository.getConnector(
            id
        ) as ISlackConnector;

        if (!connector) {
            throw new Error('No connector found.');
        }

        const token = await keytar.get(connector.accessTokenKeytarKey);
        if (!token) {
            throw new Error('No connector token found.');
        }

        const channelsResponse = await fetch(
            'https://slack.com/api/channels.list',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const allChannels: {
            ok: boolean;
            channels: ISlackChannel[];
        } = await channelsResponse.json();

        if (!allChannels.ok) {
            throw new Error('Cannot retrieve info about the channels.');
        }

        const allowedChannels = allChannels.channels.filter((ch) => {
            return ch.is_member === true;
        });

        if (!allowedChannels.length) {
            throw new Error(
                '@tgzr bot is not a member of any channel, please mention it in the channel you want to add and try again.'
            );
        }

        const selectedChannels = allowedChannels.map((ch) => {
            return {
                label: ch.name,
                description: ch.purpose.value,
                channelData: ch,
            };
        });

        const selectedChannel = await vscode.window.showQuickPick(
            selectedChannels,
            {
                ignoreFocusOut: true,
                canPickMany: false,
            }
        );

        if (!selectedChannel) {
            throw new CancellationError('No Slack channel selected.');
        }

        const value = `${connector.name}#${selectedChannel.channelData.name}`;
        const name = await vscode.window.showInputBox({
            prompt: 'What is the name of this Slack channel connection?',
            ignoreFocusOut: true,
            value,
            valueSelection: [0, value.length],
        });

        if (!name) {
            throw new CancellationError(
                'No Slack channel connection name specified.'
            );
        }

        return {
            channelConnectionName: name,
            channel: selectedChannel.channelData,
        };
    };
}
