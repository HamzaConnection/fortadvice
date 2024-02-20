import { Button } from '@mui/material'
import { faChevronLeft, faEllipsisV } from '@fortawesome/pro-light-svg-icons'
import { useNavigate } from 'react-router-dom';
import { StandardButton } from './StandardButton';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <LocalizedStrict id='back-button-label'>
            <StandardButton
                onClick={() => navigate(-1)}
                fullWidth
                color='inherit'
                variant="outlined"
                sx={{ marginTop: 0, marginBottom: 2 }}        >
                Back
            </StandardButton>
        </LocalizedStrict>
    )
}

