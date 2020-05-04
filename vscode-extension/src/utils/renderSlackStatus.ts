import { renderColonEmoji } from './renderColonEmoji';

export const renderSlackStatus = (emoji: string, text: string) => {
    if (!emoji) {
        return text;
    }
    const renderedEmoji = renderColonEmoji(emoji);
    return `${renderedEmoji} ${text}`;
};
