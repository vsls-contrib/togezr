export function* matchAll(str, regexp) {
    const flags = regexp.global ? regexp.flags : regexp.flags + 'g';
    const re = new RegExp(regexp, flags);
    let match;
    while (match = re.exec(str)) {
        yield match;
    }
}
