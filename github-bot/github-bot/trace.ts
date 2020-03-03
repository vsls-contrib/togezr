import { Context } from '@azure/functions'

class Trace {
    private context: Context | null = null;

    public initializeTrace = (c: Context) => {
        this.context = c;
    };

    get log() {
        if (!this.context) {
            throw new Error('Call `initializeTrace` first.');
        }

        return this.context.log;
    }

    get info() {
        if (!this.context) {
            throw new Error('Call `initializeTrace` first.');
        }

        return this.context.log.info;
    }

    get verbose() {
        if (!this.context) {
            throw new Error('Call `initializeTrace` first.');
        }

        return this.context.log.verbose;
    }

    get warn() {
        if (!this.context) {
            throw new Error('Call `initializeTrace` first.');
        }

        return this.context.log.warn;
    }

    get error() {
        if (!this.context) {
            throw new Error('Call `initializeTrace` first.');
        }

        return this.context.log.error;
    }
}

export const trace = new Trace();
