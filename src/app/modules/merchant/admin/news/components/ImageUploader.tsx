import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp } from '@fortawesome/pro-solid-svg-icons';
import { ImagePreviewer } from './ImagePreviewer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';



type ImageUploaderProps = Readonly<{
    imageUrl: string | null
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>
}>

export function ImageUploader({ imageUrl, setImageUrl }: ImageUploaderProps) {

    const { l10n } = useAppLocalization()

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result?.toString() ?? "");
        };

        reader.readAsDataURL(file);
    };

    const [isExpanded, setIsExpanded] = useState(imageUrl ? true : false)



    return (
        <>
            <>
                <Accordion expanded={isExpanded} elevation={0} sx={{ border: "1px solid #c4c4c4", height: '100%', width: "100%" }} onChange={() => setIsExpanded(!isExpanded)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <LocalizedStrict id='image-uploader-button-label'>
                            <Typography>Upload Image</Typography>
                        </LocalizedStrict>
                    </AccordionSummary>
                    <AccordionDetails sx={{ height: 'auto', width: '100%' }}>
                        {imageUrl && <ImagePreviewer imageUrl={imageUrl} setImageUrl={setImageUrl} />}

                        {!imageUrl && <Box sx={{ display: 'block', border: " 0.12rem dashed", borderRadius: "1rem", color: "#287faf", height: "300px", width: "100%" }} component="label">

                            <FontAwesomeIcon icon={faFileArrowUp} style={{
                                position: 'relative', left: '50%', top: '35%',
                                transform: 'translate(-50%, -50%)'
                            }} size='3x' />

                            <Box sx={{
                                position: 'relative', left: '50%', top: '40%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            >
                                <LocalizedStrict id="image-uploader-drag-and-drop">
                                    <Typography variant="subtitle1" gutterBottom align='center'>
                                        Drag and Drop Browse
                                    </Typography>
                                </LocalizedStrict>


                                <LocalizedStrict id="image-uploader-file-support">
                                    <Typography variant="body2" color="text.secondary" align='center' flexWrap={'wrap'}>
                                        File types supported: JPG, PNG, GIF SVG, Max size: 2 mb
                                    </Typography>
                                </LocalizedStrict>
                            </Box>
                            <input
                                id="upload-image"
                                accept="image/*"
                                type="file"
                                onChange={handleFileUpload}
                                style={{
                                    opacity: 0, textAlign: "center", height: "100%", width: "100%", cursor: "pointer", position: "relative", left: "50%", top: '15%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        </Box >
                        }
                    </AccordionDetails>
                </Accordion>
            </>
        </>
    );
}
