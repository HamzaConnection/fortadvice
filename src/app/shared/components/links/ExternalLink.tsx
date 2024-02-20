import { Link, LinkProps } from "@mui/material"
import { StrictOmit } from "../../../lib/lang"
import { StandardButton, StandardButtonProps } from "../buttons/StandardButton"
import { useExternalLinks } from "../../hooks/useAppLinks"

export type AppLinkProps = StrictOmit<LinkProps, "target">
export type AppButtonProps = StrictOmit<StandardButtonProps, "onClick">

export function ExternalLink(props: AppLinkProps) {
    const { href, onClick, children, ...rest } = props

    const handleExternalLink = useExternalLinks()

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        handleExternalLink(href)
        onClick?.(e) // = if (onClick) onClick(e)
    }

    return (
        <Link onClick={handleClick} {...rest}>{children}</Link>
    )
}

export function ExternalLinkButton(props: AppButtonProps) {
    const { href, children, ...rest } = props

    const handleExternalLink = useExternalLinks()
    const handleClick = () => handleExternalLink(href)

    return (
        <StandardButton onClick={handleClick} {...rest}>{children}</StandardButton>
    )
}
