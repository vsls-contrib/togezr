import * as memento from '../../memento';

export interface IChannelRegistryData {
    url: string;
    name: string;
}

interface IChannelsRegistryData {
    channels: IChannelRegistryData[];
}

const defaultChannelsRegistryData: IChannelsRegistryData = {
    channels: [],
};

const CHANNELS_MEMENTO_KEY = 'livehsare.branch.channels.registry';

export const getChannels = (): IChannelsRegistryData => {
    const data = (memento.get(CHANNELS_MEMENTO_KEY) ||
        defaultChannelsRegistryData) as IChannelsRegistryData;
    return { ...data, channels: [...data.channels] };
};

export const setChannels = (channels: IChannelsRegistryData) => {
    if (!memento) {
        throw new Error('initialize memento first.');
    }

    return memento.set(CHANNELS_MEMENTO_KEY, channels);
};

export const getChannel = (name: string): IChannelRegistryData | undefined => {
    const channelsData = getChannels();

    const channel = channelsData.channels.find((ch) => {
        return ch.name === name;
    });

    return channel;
};

export const getChannelByUrl = (
    url: string
): IChannelRegistryData | undefined => {
    const channelsData = getChannels();

    const channel = channelsData.channels.find((ch) => {
        return ch.url === url;
    });

    return channel;
};

export const removeChannel = (name: string) => {
    const channelsData = getChannels();

    const newChannels = channelsData.channels.filter((ch) => {
        return ch.name !== name;
    });

    channelsData.channels = newChannels;

    setChannels(channelsData);
};

export const addChannel = (name: string, url: string) => {
    const channel = getChannel(name);

    if (channel) {
        removeChannel(name);
    }

    const channelsData = getChannels();
    channelsData.channels.push({ name, url });
    setChannels(channelsData);
};
