import { type PropsWithChildren } from "react"
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom"
import { Breadcrumbs, Link, TypographyProps, type LinkProps, Typography } from "@mui/material"
import { NavigateNext } from "@mui/icons-material"

type BreadcrumbLinkProps = LinkProps & RouterLinkProps

export function BreadcrumbLink(props: BreadcrumbLinkProps) {
    return (
        <Link component={RouterLink} {...props} />
    )
}

type BreadcrumbProps = TypographyProps

export function Breadcrumb(props: TypographyProps) {
    return (
        <Typography {...props} />
    )
}

type BreadcrumbsProps = Readonly<PropsWithChildren<{}>>

export function StandardBreadcrumbs({ children }: BreadcrumbsProps) {
    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
            {children}
        </Breadcrumbs>
    )
}
