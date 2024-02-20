import { Editor } from '@tinymce/tinymce-react';
import {
    FormControl,
    FormHelperText,
} from "@mui/material"
// TinyMCE so the global var exists
import tinymce from 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
// import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
// import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';


import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';

export function RichEditor({ placeholder, value, onBlur, onChange, onCharacterCountChange }) {
    const { l10n } = useAppLocalization()

    return (
        <Editor
            onBlur={onBlur}
            onEditorChange={(newValue, editor) => {
                onChange(newValue)
                onCharacterCountChange(editor.plugins.wordcount.body.getCharacterCount())
            }}
            value={value}
            init={{
                skin: false,
                content_css: false,
                content_style:
                    ["body {font-family:Roboto,Helvetica,Arial,sans-serif; font-size:16px;} "].join('\n'),
                height: 'clamp(200px, auto, 500px)',
                width: '100%',
                menubar: false,
                placeholder: placeholder,
                plugins: [
                    'advlist', 'anchor', 'autolink', 'image', 'link', 'lists', 'table', 'wordcount', 'preview', 'fullscreen', 'media', 'emoticons',
                ],
                block_formats: 'Paragraph=p; Header 1=h2; Header 2=h3; Header 3=h4;',

                toolbar: 'undo redo blocks | bold italic underline |' +
                    '  link image | forecolor backcolor | alignleft aligncenter alignright' +
                    'alignright alignjustify bullist numlist |' +
                    'emoticons fullscreen',
                statusbar: false
            }}
        />
    );
}
