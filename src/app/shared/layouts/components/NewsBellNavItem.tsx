import { forwardRef } from "react"
import { useNavigate } from "react-router-dom"
import { IconButton, SvgIcon } from "@mui/material"
import { faBell } from "@fortawesome/pro-light-svg-icons"
import { makeStyles } from "tss-react/mui"
import { getGoPayNewsRoute } from "../../../constants/routes"

const useStyles = makeStyles()((theme) => ({
    iconButton: {
        color: theme.palette.primary.light,
    },
}))

type FontAwesomeSvgIconProps = {
    icon: any
}

// Hack to properly render FontAwesome icon inside MUI IconButton
// See: https://mui.com/material-ui/icons/#font-awesome
const FontAwesomeSvgIcon = forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>((props, ref) => {
    const { icon } = props

    const {
        icon: [width, height, , , svgPathData],
    } = icon

    return (
        <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
            {typeof svgPathData === "string" ? (
                <path d={svgPathData} />
            ) : (
                /**
                 * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
                 * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
                 * of a duotone icon. 40% is the default opacity.
                 *
                 * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
                 */
                svgPathData.map((d: string, i: number) => <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />)
            )}
        </SvgIcon>
    )
})

type Props = Readonly<{
    urlPrefix: string | undefined
    className?: string
}>

export function NewsBellNavItem({ urlPrefix, className }: Props) {
    const { classes, cx } = useStyles()
    const navigate = useNavigate()

    function handleClick() {
        navigate(getGoPayNewsRoute(urlPrefix))
    }

    return (
        <IconButton onClick={handleClick} size="large" className={cx(classes.iconButton, className)}>
            <FontAwesomeSvgIcon icon={faBell} />
        </IconButton>
    )
}
