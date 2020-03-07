class Trace {
    get log() {
        return console.log;
    }

    get info() {
        return console.info;
    }

    get verbose() {
        return console.info;
    }

    get warn() {
        return console.warn;
    }

    get error() {
        return console.error;
    }
}

export const trace = new Trace();
