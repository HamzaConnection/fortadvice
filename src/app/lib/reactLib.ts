import { JSXElementConstructor, PropsWithChildren, ReactElement, ReactNode, isValidElement } from "react"
import { objectHas } from "./lang"
import flattenChildren from "react-keyed-flatten-children"

export function isForwardRef(node: ReactNode): node is ReactElement<PropsWithChildren<unknown>> {
    if (isValidElement(node)) {
        const elementType = node.type as unknown
        if (typeof elementType === "object" && elementType !== null) {
            if (objectHas("$$typeof", elementType)) {
                return elementType.$$typeof === Symbol.for("react.forward_ref")
            }
        }
    }

    return false
}

export function isElementWithChildren(node: ReactNode): node is ReactElement<PropsWithChildren<unknown>> {
    return isValidElement(node) && objectHas("children", node.props)
}

export function innerElementType(element: ReactNode, unwrap: JSXElementConstructor<PropsWithChildren<unknown>>[]): string | JSXElementConstructor<unknown> {
    if (isValidElement(element)) {
        if (typeof element.type === "string") {
            return element.type
        } else if (isForwardRef(element)) {
            const children = element.props.children
            return innerElementType(children, unwrap)
        } else if (unwrap.some(c => c === element.type)) {
            if (isElementWithChildren(element)) {
                return innerElementType(element.props.children, unwrap)
            }
            else throw Error(`Element type should be unwrapped but it does not have children: ${element.type}`)
        }
        return element.type
    } else {
        return typeof element
    }
}

export function childrenByElementType(children: ReactNode, unwrap: JSXElementConstructor<PropsWithChildren<unknown>>[]) {
    const flattened = flattenChildren(children)

    return flattened.reduce<Map<string | JSXElementConstructor<any>, ReactNode[]>>((map, child) => {
        const elementType = innerElementType(child, unwrap)
        const elements = map.get(elementType)

        if (elements) elements.push(child)
        else map.set(elementType, [child])

        return map
    }, new Map<string | JSXElementConstructor<any>, ReactNode[]>())
}
