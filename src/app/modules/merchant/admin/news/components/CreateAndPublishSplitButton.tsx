import { ButtonGroup, Button, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useFormikContext } from 'formik';
import { MerchantArticleStatus } from '../merchantNewsItemType';
import { TranslationKey } from '../../../../localization/translations';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';





type CreateAndPublishSplitButtonProps = Readonly<{
    articleStatus: MerchantArticleStatus
    setArticleStatus: React.Dispatch<React.SetStateAction<MerchantArticleStatus>>
}>

enum SplitButtonLabel {
    CREATE_DRAFT = "Create-draft",
    PUBLISH = "Publish",
    SAVE = "Save",
    UNPUBLISH = "Unpublish", // draft
    CANCEL_PUBLICATION = "Cancel-publication", // draft
    REPUBLISH = "Republish", // published

}


export function CreateAndPublishSplitButton({ articleStatus, setArticleStatus }: CreateAndPublishSplitButtonProps) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [label, setLabel] = useState<TranslationKey>()

    const { isValid, validateForm, submitForm } = useFormikContext();
    const { l10n } = useAppLocalization()

    l10n.getStringForEnum("create-and-publish-split-button", label ?? SplitButtonLabel.SAVE, label ?? SplitButtonLabel.SAVE)



    useEffect(() => {

        switch (articleStatus) {
            case MerchantArticleStatus.DRAFT:
                setLabel("create-and-publish-split-button-create-draft")
                //setLabel(SplitButtonLabel.CREATE_DRAFT)
                break;

            case MerchantArticleStatus.PUBLISHED:
                setLabel("create-and-publish-split-button-publish")
                // setLabel(SplitButtonLabel.PUBLISH)
                break;

            case MerchantArticleStatus.SCHEDULED:
                setLabel("create-and-publish-split-button-save")
                // setLabel(SplitButtonLabel.SAVE)
                break;

            case MerchantArticleStatus.EXPIRED:
                setLabel("create-and-publish-split-button-save")
                // setLabel(SplitButtonLabel.SAVE)
                break;

            default:
                break;
        }


    }, [articleStatus])


    function getSplitButtonOptions() {

        switch (articleStatus) {
            case MerchantArticleStatus.DRAFT:
                return (
                    [
                        <MenuItem
                            key={SplitButtonLabel.CREATE_DRAFT}
                            selected={0 === selectedIndex}
                            onClick={() => handleMenuItemClick("create-and-publish-split-button-create-draft", 0)}
                        >
                            {l10n.getString("create-and-publish-split-button-create-draft")}

                        </MenuItem>,
                        <MenuItem
                            key={SplitButtonLabel.PUBLISH}
                            selected={1 === selectedIndex}
                            onClick={() => handleMenuItemClick("create-and-publish-split-button-publish", 1)}
                        >
                            {l10n.getString("create-and-publish-split-button-publish")}

                        </MenuItem>
                    ]
                )

            case MerchantArticleStatus.PUBLISHED:
                return (
                    [
                        <MenuItem
                            key={SplitButtonLabel.PUBLISH}
                            selected={0 === selectedIndex}
                            onClick={() => handleMenuItemClick("create-and-publish-split-button-publish", 0)}
                        >
                            {l10n.getString("create-and-publish-split-button-publish")}
                        </MenuItem>,

                        <MenuItem
                            key={SplitButtonLabel.UNPUBLISH}
                            selected={1 === selectedIndex}
                            onClick={() => {
                                validateForm().then(result => {
                                    if (Object.keys(result).length === 0) {
                                        setArticleStatus(MerchantArticleStatus.DRAFT)
                                    }
                                })

                                handleMenuItemClick("create-and-publish-split-button-unpublish", 1)
                            }}
                        >
                            {l10n.getString("create-and-publish-split-button-unpublish")}

                        </MenuItem>
                    ]
                )

            case MerchantArticleStatus.SCHEDULED:
                return (
                    [
                        <MenuItem
                            key={SplitButtonLabel.SAVE}

                            selected={0 === selectedIndex}
                            onClick={() => handleMenuItemClick("create-and-publish-split-button-save", 0)}
                        >
                            {l10n.getString("create-and-publish-split-button-save")}

                        </MenuItem>,

                        <MenuItem
                            key={SplitButtonLabel.CANCEL_PUBLICATION}
                            selected={1 === selectedIndex}
                            onClick={() => {
                                validateForm().then(result => {
                                    if (Object.keys(result).length === 0) {
                                        setArticleStatus(MerchantArticleStatus.DRAFT)
                                    }
                                })
                                handleMenuItemClick("create-and-publish-split-button-cancel-publication", 1)
                            }}
                        >
                            {l10n.getString("create-and-publish-split-button-save")}
                        </MenuItem>
                    ]
                )

            case MerchantArticleStatus.EXPIRED:
                return (
                    [
                        <MenuItem
                            key={SplitButtonLabel.SAVE}
                            selected={0 === selectedIndex}
                            onClick={() => handleMenuItemClick("create-and-publish-split-button-save", 0)}
                        >
                            {SplitButtonLabel.SAVE}
                        </MenuItem>,

                        <MenuItem
                            key={SplitButtonLabel.REPUBLISH}
                            selected={1 === selectedIndex}
                            onClick={() => {
                                validateForm().then(result => {
                                    if (Object.keys(result).length === 0) {
                                        setArticleStatus(MerchantArticleStatus.PUBLISHED)
                                    }
                                })
                                handleMenuItemClick("create-and-publish-split-button-republish", 1)
                            }}
                        >
                            {SplitButtonLabel.REPUBLISH}
                        </MenuItem>
                    ]
                )

            default:
                return (
                    <>

                    </>
                )
        }
    }

    const handleMenuItemClick = (
        buttonLabel: TranslationKey,
        index: number,
    ) => {

        setSelectedIndex(index);
        setLabel(buttonLabel)
        setOpen(false);
        submitForm()
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {/* TODO ask søren how to create a black standard button */}
            <ButtonGroup variant="contained" ref={anchorRef} size='small'>
                <Button fullWidth onClick={() => {
                    submitForm()
                }
                } > {l10n.getString(label ?? "create-and-publish-split-button-save")}</Button>
                <Button
                    size="small"
                    onClick={() => {
                        handleToggle()
                    }}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{
                    width: anchorRef.current?.clientWidth
                }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {getSplitButtonOptions()}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
