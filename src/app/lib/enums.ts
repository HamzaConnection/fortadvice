export const createEnumChecker = <T extends string, TEnumValue extends string>(
    enumVariable: { [key in T]: TEnumValue }
  ) => {
    const enumValues = Object.values(enumVariable);
    return (value: string | number | boolean | null): value is TEnumValue => {
        if (value === null) return false
        return enumValues.includes(value)
    }
};

export function* iterateStringEnum<T extends string>(enumVariable: { [key in T]: T}) {
    for (const value in enumVariable) {
        yield value
    }
}
