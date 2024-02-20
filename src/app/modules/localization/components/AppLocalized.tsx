import { Localized, LocalizedProps } from '@fluent/react'
import { forwardRef, isValidElement, cloneElement, Children, CSSProperties } from 'react'
import { StrictOmit } from '../../../lib/lang'
import { getTranslationIdForEnum } from '../localizationLib'
import { TranslationKey } from '../translations'

export type LocalizedStrictProps = Readonly<StrictOmit<LocalizedProps, "id"> & {
    id: TranslationKey
    style?: CSSProperties
}>

export const LocalizedStrict = forwardRef((props: LocalizedStrictProps, ref) => {
    const { id, style, children, ...rest } = props

    const child = Children.only(children)
    const clone = isValidElement(child) ? cloneElement(child, [ref]) : child

    return (
        <Localized id={id} {...rest}>
            {clone}
        </Localized>
    )
})

type LocalizedEnumProps = Readonly<StrictOmit<LocalizedProps, "id"> & {
    base: string
    enumValue: string
    style?: CSSProperties
}>

export const LocalizedEnum = forwardRef((props: LocalizedEnumProps, ref) => {
    const { base, enumValue, style, children, ...rest } = props

    const id = getTranslationIdForEnum(base, enumValue)
    const child = Children.only(children)
    const clone = isValidElement(child) ? cloneElement(child, [ref]) : child

    return (
        <Localized id={id} {...rest}>
            {clone}
        </Localized>
    )
})
