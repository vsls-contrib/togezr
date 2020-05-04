const EmojiConvertor = require('emoji-js');

export const renderColonEmoji = (emoji: string) => {
    if (!emoji) {
        return '';
    }

    const converter = new EmojiConvertor();
    converter.replace_mode = 'unified';
    converter.allow_native = true;

    const renderedEmoji = converter.replace_colons(emoji);

    return renderedEmoji;
};
