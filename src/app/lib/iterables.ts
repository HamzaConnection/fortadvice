// Functions for working with iterables and generators to create them

export function* empty<T>(): IterableIterator<T> {
    return
}

export function* take<T>(n: number, iterable: Iterable<T>): IterableIterator<T> {
    let toTake = n

    for (const x of iterable) {
        if (toTake <= 0) break
        toTake--
        yield x
    }
}

export function* drop<T>(n: number, iterable: Iterable<T>): IterableIterator<T> {
    let toDrop = n

    for (const x of iterable) {
        if (toDrop > 0) {
            toDrop--
            continue
        }
        yield x
    }
}

export function nth<T>(n: number, iterable: Iterable<T>): T | undefined {
    // We use for-of to get automatic close of iterator
    for (const item of iterable) {
        if (n <= 0)
            return item
        else
            n--
    }

    return undefined
}

export function* before<T>(item: T, iterable: Iterable<T>) {
    yield item
    yield* iterable
}

export function* after<T>(item: T, iterable: Iterable<T>) {
    yield* iterable
    yield item
}

export function* withResult<T, R>(result: R, iterable: Iterable<T>): Generator<T, R, undefined> {
    yield* iterable
    return result
}

export async function toArrayAsync<T>(iterable: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = []

    for await (const item of iterable) {
        result.push(item)
    }

    return result
}
