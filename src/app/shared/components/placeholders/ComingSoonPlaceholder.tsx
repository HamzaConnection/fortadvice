import { IPlayerProps, Player } from '@lottiefiles/react-lottie-player';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';




type ComingSoonPlaceholderProps = {
    lottieAnimation?: IPlayerProps["src"]
    title: string,
    body: string,
}

export function ComingSoonPlaceholder({ lottieAnimation, title, body }: ComingSoonPlaceholderProps) {
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom sx={{ marginTop: "6.0rem", textAlign: "center" }}>
                    {title}
                </Typography>

                <Typography variant='body1' gutterBottom sx={{ marginBottom: "3rem" }}>
                    {body}
                </Typography>

                {lottieAnimation && <Box sx={{ width: "60%" }}>
                    <Player src={lottieAnimation} autoplay loop speed={1} />
                </Box>}
            </Box>
        </>
    )
}
