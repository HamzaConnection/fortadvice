import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp } from '@fortawesome/pro-solid-svg-icons';
import { Stack } from '@mui/system';
import { grey } from '@mui/material/colors';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';


type ImagePreviewerProps = Readonly<{
    imageUrl: string | null
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>
}>


export function ImagePreviewer({ imageUrl, setImageUrl }: ImagePreviewerProps) {

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result?.toString() ?? "");
        };

        reader.readAsDataURL(file);
    };

    const { l10n } = useAppLocalization()

    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            {imageUrl && <img src={imageUrl} alt="Uploaded Image" height="300" />}

            <Stack justifyContent="center" paddingTop="1rem" direction="row" spacing={2}>

                <Button disableElevation size='small' variant="outlined" color='primary' component="label"
                    endIcon={<FontAwesomeIcon icon={faFileArrowUp} />}>
                    {l10n.getString("image-previewer-button-label")}
                    <input
                        id="upload-image"
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                    />
                </Button>

                <Button disableElevation size='small' color='error' variant="outlined" onClick={() => setImageUrl(null)} endIcon={<DeleteIcon />}>
                    {l10n.getString("image-previewer-button-delete")}
                </Button>


            </Stack>





        </Box>
    )
}
