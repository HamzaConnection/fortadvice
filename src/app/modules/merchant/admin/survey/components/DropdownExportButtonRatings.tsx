


import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { MRT_Row } from 'material-react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';





import { TableRatingsReport } from '../surveyTypes';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';


interface DropdownExportButtonRatingsProps {
    rowsIsSelected: boolean
    containsRows: boolean
    allRowsWithFilter: MRT_Row<TableRatingsReport>[]
    seletecRows: MRT_Row<TableRatingsReport>[]
    chosenStartDate: string
    chosenEndDate: string
}

export const DropdownExportButtonRatings = ({ allRowsWithFilter, rowsIsSelected, seletecRows, containsRows, chosenStartDate, chosenEndDate }: DropdownExportButtonRatingsProps) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const csvOptions = mkConfig({
        fieldSeparator: ';',
        quoteStrings: true,
        decimalSeparator: '.',
        useBom: true,
        useKeysAsHeaders: true,
        filename: `GoPay-ratings-${chosenStartDate}_${chosenEndDate}`
    });





    const { l10n } = useAppLocalization()


    const handleExportRows = (rows: MRT_Row<TableRatingsReport>[]) => {

        const rowData = rows.map((row) => row.original)

        const exportRows = rowData.map(rating => {
            return (
                {
                    "From": rating.startDate,
                    "To": rating.endDate,
                    "Rating id": rating.id,
                    "Survey name": rating.survey.title,
                    "Question": rating.question.title,
                    "Comment": rating.question.smiley.comment ?? ""
                })
        })

        const csv = generateCsv(csvOptions)(exportRows);
        download(csvOptions)(csv)
    };

    return (
        <div>
            <StandardExportButton onClick={handleClick} endIcon={<ArrowDropDownIcon />} />

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <LocalizedStrict id='export-button-export-all-with-filter'>
                    <MenuItem disabled={containsRows} onClick={() => handleExportRows(allRowsWithFilter)}>Export all with filter</MenuItem>
                </LocalizedStrict>
                <LocalizedStrict id='export-button-export-selected-rows'>
                    <MenuItem disabled={rowsIsSelected} onClick={() => handleExportRows(seletecRows)}>Export Selected rows</MenuItem>
                </LocalizedStrict>
            </Menu>
        </div >
    );
}
