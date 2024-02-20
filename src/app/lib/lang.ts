import { Logger } from "./logging"

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Unpromisify<T> = T extends Promise<infer R> ? R : T

// Used when you only want the string keys of an object
// See: https://stackoverflow.com/questions/51808160/keyof-inferring-string-number-when-key-is-only-a-string
export type StringKeyOf<T extends object> = Extract<keyof T, string>

// Used to make all props of T: 1) required 2) not null 3) not undefined
// See: https://stackoverflow.com/questions/53050011/remove-null-or-undefined-from-properties-of-a-type
export type RequiredNonNullProps<T> = { [P in keyof Required<T>]: NonNullable<T[P]> }

/**
 * To be thrown in default case of switch statement when you want to ensure that
 * it is exhaustive (that you have handled all cases explicitly).
 * @see https://stackoverflow.com/a/52913382/567000
 */
export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${JSON.stringify(val)}`)
    }
}

export function objectHas<K extends string>(key: K, x: object): x is { [key in K]: unknown } {
    return key in x
}

export function isObjectWithProp<K extends string>(value: unknown, key: K): value is { [key in K]: unknown } {
    return (typeof value === "object" && value !== null && key in value)
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof(value) === "string" && value.length > 0
}

export function sleep(millis: number): Promise<undefined> {
    return new Promise(resolve => setTimeout(resolve, millis))
}

export function parseBool(value: string): boolean | undefined {
    const truePattern = /true/i
    const falsePattern = /false/i

    if (truePattern.test(value)) return true
    if (falsePattern.test(value)) return false

    return undefined
}

export function safeParseInt(value: string | null | undefined) {
    if (value === null || value === undefined) return null
    const number = Number(value)
    return Number.isNaN(number) ? null : number
}

export function safeParseFromJson(jsonValue: string | null | undefined, logger: Logger): unknown {
    if (!jsonValue) return undefined

    try {
        return JSON.parse(jsonValue)
    } catch (e: unknown) {
        logger.warn("Failed to parse value as JSON", e)
        return undefined
    }
}

export function falsyToUndefined<T>(value: T) {
    return value ? value : undefined
}
