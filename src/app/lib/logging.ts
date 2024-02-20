export class Logger {
    private module: string

    constructor(module: string) {
        this.module = module
    }

    debug(msg: string, ...data: any[]) {
        console.debug(`[${this.module}] ${msg}`, ...data)
    }
    info(msg: string, ...data: any[]) {
        console.info(`[${this.module}] ${msg}`, ...data)
    }
    warn(msg: string, ...data: any[]) {
        console.warn(`[${this.module}] ${msg}`, ...data)
    }
    error(msg: string, ...data: any[]) {
        console.error(`[${this.module}] ${msg}`, ...data)
    }
}