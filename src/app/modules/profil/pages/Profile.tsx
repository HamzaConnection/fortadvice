import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { makeStyles } from 'tss-react/mui';
import ProfileAnim from "../assets/17726-user-profile.json"
import { Player } from '@lottiefiles/react-lottie-player';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { useAppSelector } from '../../store/storeHooks';
import { selectAuthenticatedUser } from '../../login/loginSelectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-thin-svg-icons';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { SettingsHeader } from '../../settings/components/SettingsHeader';

const useStyles = makeStyles()((theme) => ({
    profileAnim: {
        height: "4rem",
        width: "auto",
        color: "#000000",
    },

    list: {
        width: '100%',
        px: "0.5rem"
    },

    contentCenter: {
        display: "flex",
        justifyContent: "center",
    }
}))

export const Profile = () => {
    const { classes } = useStyles()
    const user = useAppSelector(selectAuthenticatedUser)
    const { l10n } = useAppLocalization()


    if (!user) {
        return null
    }

    return (
        <Container sx={{ my: 5 }}>

            <SettingsHeader icon={faUser} translationsId='profile-user-info' />

            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} >
                    <TableBody>
                        <TableRow>
                            <LocalizedStrict id='profile-user-type'>
                                <TableCell component="th" scope="row">
                                    User Type
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">{l10n.getStringForEnum("profile-usertype", user.userType, user.userType)} </TableCell>
                        </TableRow>

                        {/* <TableRow>
                            <LocalizedStrict id='profil-location'>
                                <TableCell component="th" scope="row">
                                    Location
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">{user?.companyId}</TableCell>
                        </TableRow> */}

                        {/* <TableRow>
                            <LocalizedStrict id='profil-usergroup-name'>
                                <TableCell component="th" scope="row">
                                    Tenants ( usergroup name)
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">{user?.companyId}</TableCell>
                        </TableRow> */}


                        <TableRow>
                            <LocalizedStrict id='profile-user-id'>
                                <TableCell sx={{ width: "15rem" }} component="th" scope="row">
                                    User Id
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell >{user?.id}</TableCell>
                        </TableRow>

                        <TableRow>
                            <LocalizedStrict id='profile-username'>
                                <TableCell component="th" scope="row">
                                    Username
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">{user?.username}</TableCell>
                        </TableRow>

                        <TableRow>
                            <LocalizedStrict id='profile-display-name'>
                                <TableCell component="th" scope="row">
                                    Name
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">-</TableCell>
                        </TableRow>

                        <TableRow>
                            <LocalizedStrict id='profile-email'>
                                <TableCell component="th" scope="row">
                                    Email
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">-</TableCell>
                        </TableRow>

                        <TableRow>
                            <LocalizedStrict id='profile-phone-number'>
                                <TableCell component="th" scope="row">
                                    Phone number
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">-</TableCell>
                        </TableRow>

                        <TableRow>
                            <LocalizedStrict id='profile-mobil-number'>
                                <TableCell component="th" scope="row">
                                    Mobile number
                                </TableCell>
                            </LocalizedStrict>
                            <TableCell align="left">-</TableCell>
                        </TableRow>
                    </TableBody>

                </Table>
            </TableContainer>
            {/* <Player src={ProfileAnim} autoplay keepLastFrame speed={2} className={classes.profileAnim} />
                <Typography variant="h5" gutterBottom align='center' paddingTop="0.5rem">
                    User Information
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "nowrap", justifyContent: "center" }}>
                    <Box sx={{ width: "18rem", p: 1 }}>
                        <TextField
                            sx={{ my: "0.5rem" }}
                            label="User Id"
                            value={user?.id}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                            sx={{ my: "0.5rem" }}
                            label="Display Initials"
                            value={user?.displayInitials}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                            sx={{ my: "0.5rem" }}
                            label="Username"
                            value={user?.username}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                            sx={{ my: "0.5rem" }}
                            label="User Type"
                            value={user?.userType}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />

                    </Box>
                    <Box sx={{ width: "18rem", p: 1 }}>
                        <TextField
                            sx={{ my: "0.5rem" }}

                            label="User Type ID"
                            value={user?.userTypeId}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                            sx={{ my: "0.5rem" }}

                            label="Company Id"
                            value={user?.companyId}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />

                        <TextField
                            sx={{ my: "0.5rem" }}

                            label="UID"
                            value={user?.uid}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />

                        <TextField
                            sx={{ my: "0.5rem" }}

                            label="User Group ID"
                            value={user?.userGroupId}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                    </Box>
                </Box> */}
        </Container >
    );
};

