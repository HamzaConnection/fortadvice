import { Menu, MenuItem, Typography } from '@mui/material'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons';
import { MerchantNewsArticle } from '../merchantNewsItemType';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { CreateOrEditMerchantArticleState } from '../pages/CreateOrEditMerchantArticle';
import { MERCHANT_CREATE_NEWS_ROUTE } from '../../../../../constants/routes';




type CardDropdownMenuProps = Readonly<{
    article: MerchantNewsArticle
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
}>

export const CardDropdownMenu = ({ article, setShowDeleteModal }: CardDropdownMenuProps) => {



    const navigate = useNavigate();

    const [dropDownAnchorEl, setdropDownAnchorEl] = useState<null | HTMLElement>(null);


    const open = Boolean(dropDownAnchorEl);

    const handledropDownClick = (event: React.MouseEvent<HTMLElement>) => {
        setdropDownAnchorEl(event.currentTarget);
    };

    const handledropDownClose = () => {
        setdropDownAnchorEl(null);
    };

    return (
        <>
            <Typography sx={{
                paddingRight: "0.3rem",
                paddingLeft: "1rem"
            }} variant="h6" fontWeight={400} onClick={handledropDownClick}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </Typography>


            <Menu
                anchorEl={dropDownAnchorEl}
                open={open}
                onClose={handledropDownClose}
            >
                <LocalizedStrict id='news-edit'>
                    <MenuItem onClick={() => {
                        handledropDownClose()
                        const navState: CreateOrEditMerchantArticleState = { article }
                        navigate(MERCHANT_CREATE_NEWS_ROUTE, { state: navState })
                    }}>Edit</MenuItem>
                </LocalizedStrict>

                <LocalizedStrict id='news-delete'>
                    <MenuItem onClick={() => {
                        setdropDownAnchorEl(null);
                        setShowDeleteModal(true)
                    }}>Delete</MenuItem>
                </LocalizedStrict>
            </Menu >
        </>
    )
}

