import { useCallback } from "react"
import { Logger } from "../../lib/logging"

export function useExternalLinks() {
    const handleClick = useCallback((href: string | undefined) => {
        if (href === undefined) {
            return
        }

        const logger = new Logger("extlinks")

        logger.info(`Opening external link ${href}`)

        // TODO: Add Cordova in-app browsing when available
        logger.info("Opening link in new tab")
        window.open(href, "_blank", "noopener,noreferrer")
    }, [])

    return handleClick
}
