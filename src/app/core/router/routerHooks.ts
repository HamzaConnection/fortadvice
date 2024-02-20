import { defaults } from "lodash-es"
import { useLocation } from "react-router-dom"

export function useLocationState<T extends object>(defaultObj: T): T {
    let state: unknown
    ({ state } = useLocation())

    return defaults(state, defaultObj)
}

export function useLocationQuery() {
    // Use the URLSearchParams API to extract the query parameters
    // useLocation().search will have the query parameters eg: ?foo=bar&a=b
    return new URLSearchParams(useLocation().search)
  }
