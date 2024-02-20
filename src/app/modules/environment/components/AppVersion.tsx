import { useEffect } from "react"
import { Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { Logger } from "../../../lib/logging"
import { useEnvironment } from "../envHooks"

const bannerSpeed = [
    "    ________            ____________________                    _____ ",
    "    ___  __/_____ _________(_)__  /__(_)_  /_____  _______________  /_",
    "    __  /_ _  __ `/  ___/_  /__  /__  /_  __/_  / / /_  __ \\  _ \\  __/",
    "    _  __/ / /_/ // /__ _  / _  / _  / / /_ _  /_/ /_  / / /  __/ /_  ",
    "    /_/    \\__,_/ \\___/ /_/  /_/  /_/  \\__/ _\\__, / /_/ /_/\\___/\\__/  ",
    "                                        /____/                    "
]

const bannerOgre = [
    "     __            _ _ _ _                    _   ",
    "    / _| __ _  ___(_) (_) |_ _   _ _ __   ___| |_ ",
    "   | |_ / _` |/ __| | | | __| | | | '_ \\ / _ \\ __|",
    "   |  _| (_| | (__| | | | |_| |_| | | | |  __/ |_ ",
    "   |_|  \\__,_|\\___|_|_|_|\\__|\\__, |_| |_|\\___|\\__|",
    "                             |___/                "
]

const gopayBannerDoom = [
    "     _____      ______           ",
    "    |  __ \\     | ___ \\          ",
    "    | |  \\/ ___ | |_/ /_ _ _   _ ",
    "    | | __ / _ \\|  __/ _` | | | |",
    "    | |_\\ \\ (_) | | | (_| | |_| |",
    "     \\____/\\___/\\_|  \\__,_|\\__, |",
    "                            __/ |",
    "                           |___/ ",
]

const gopayBannerBulbhead = [
    "     ___  _____  ____   __   _  _ ",
    "    / __)(  _  )(  _ \\ /__\\ ( \\/ )",
    "   ( (_-. )(_)(  )___//(__)\\ \\  / ",
    "    \\___/(_____)(__) (__)(__)(__) "
]

const gopayBannerGraceful = [
    "     ___   __  ____   __   _  _ ",
    "    / __) /  \\(  _ \\ / _\\ ( \\/ )",
    "   ( (_ \\(  O )) __//    \\ )  / ",
    "    \\___/ \\__/(__)  \\_/\\_/(__/  "
]

const gopayBannerSlant = [
    "       ______      ____                 ",
    "      / ____/___  / __ \\____ ___  __    ",
    "     / / __/ __ \\/ /_/ / __ `/ / / /    ",
    "    / /_/ / /_/ / ____/ /_/ / /_/ /     ",
    "    \\____/\\____/_/    \\__,_/\\__, /      ",
    "                           /____/       "
]

const readyBannerDoom = [
    "    ______           _           ______               _       ",
    "    |  _  \\         (_)          | ___ \\             | |      ",
    "    | | | |_____   ___  ___ ___  | |_/ /___  __ _  __| |_   _ ",
    "    | | | / _ \\ \\ / / |/ __/ _ \\ |    // _ \\/ _` |/ _` | | | |",
    "    | |/ /  __/\\ V /| | (_|  __/ | |\\ \\  __/ (_| | (_| | |_| |",
    "    |___/ \\___| \\_/ |_|\\___\\___| \\_| \\_\\___|\\__,_|\\__,_|\\__, |",
    "                                                         __/ |",
    "                                                        |___/ "
]

function pickBanner(banners: string[][]) {
    const index = Math.floor(Math.random() * banners.length)
    return banners[index]
}

export const useLogVersionBanner = () => {
    const { currentEnv } = useEnvironment()

    const logger = new Logger("boot")

    useEffect(() => {
        const banner = pickBanner([gopayBannerDoom, gopayBannerBulbhead, gopayBannerGraceful, gopayBannerSlant])

        for (const bannerLine of banner) {
            logger.info(bannerLine)
        }

        const prefix = (currentEnv.webapp?.versionFull === "LIVE") ? "" : "v"

        logger.info(`GoPay Manager web ${prefix}${currentEnv.webapp?.versionFull ?? "???"}`)
        logger.info("Environment:", currentEnv)
    }, [])
}

const useStyles = makeStyles()((theme) => ({
    versionLabel: {
        color: theme.palette.grey.A200,
        fontSize: `calc(${theme.typography.body2.fontSize}*0.75)`
    }
}))

type AppVersionProps = Readonly<{
    className?: string
    onClick?: () => void
}>

export function AppVersion({ className, onClick }: AppVersionProps) {
    const { classes, cx } = useStyles()
    const { currentEnv } = useEnvironment()

    const prefix = (currentEnv.webapp?.version === "LIVE") ? "" : "v. "
    const webappVersion = currentEnv.webapp?.version ?? "???"

    return (
        <Typography variant="body2" align="right" className={cx(className, classes.versionLabel)} onClick={onClick}>{prefix}{webappVersion}</Typography>
    )
}
