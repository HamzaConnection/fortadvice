import { PropsWithChildren, useCallback, useState } from "react"
import { Outlet, useMatches } from "react-router-dom"
import { Grid } from "@mui/material"
import { isObjectWithProp } from "../../lib/lang"
import { LayoutContainer } from "./components/LayoutContainer"
import { TopBar } from "./TopBar"
import { LeftBar } from "./LeftBar"

type NavLayoutProps = Readonly<PropsWithChildren<{}>>

export function NavLayout({ children }: NavLayoutProps) {
    const [compactNav, setCompactNav] = useState(false)
    const routeMatches = useMatches()

    // Find the user type root route and environment root route among the current route matches
    const userTypeRoutePath = routeMatches.find((match) => isObjectWithProp(match.handle, "userTypeRoot") && Boolean(match.handle.userTypeRoot))?.pathname
    const environmentRoutePath = routeMatches.find((match) => isObjectWithProp(match.handle, "environmentRoot") && Boolean(match.handle.environmentRoot))?.pathname

    const isAdminEnv = routeMatches.find(
        (match) =>
            isObjectWithProp(match.handle, "environmentRoot") &&
            Boolean(match.handle.environmentRoot) &&
            isObjectWithProp(match.handle, "isAdmin") &&
            Boolean(match.handle.isAdmin),
    ) !== undefined

    const handleCompactNavToggle = useCallback(() => {
        setCompactNav((prev) => !prev)
    }, [setCompactNav])

    return (
        <>
            <TopBar
                userTypeRoutePath={userTypeRoutePath}
                environmentRoutePath={environmentRoutePath}
                isAdminEnv={isAdminEnv}
                compactNav={compactNav}
            />
            <Grid container wrap="nowrap">
                <LeftBar compact={compactNav} onCompactToggle={handleCompactNavToggle}>
                    {children}
                </LeftBar>

                <LayoutContainer>
                    <Outlet />
                </LayoutContainer>
            </Grid>
        </>
    )
}
