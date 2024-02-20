import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Chip, Grid, MenuItem, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { MerchantNewsArticle, MerchantArticleStatus, MerchantArticleType } from '../merchantNewsItemType';
import { Badge } from '../components/Badge';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { FormikDropdown, FormikRichTextEditor, FormikTextField } from '../../../../../shared/components/forms/Formik';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from "yup"
import { Logger } from '../../../../../lib/logging';
import { makeStyles } from 'tss-react/mui';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { createMerchantAdminNews } from '../merchantAdminNewsApi';
import { useDateTime } from '../../../../localization/useDateTime';
import { DateTime } from 'luxon';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useAppSelector } from '../../../../store/storeHooks';
import { useLocationState } from '../../../../../core/router/routerHooks';
import { ImageUploader } from '../components/ImageUploader';
import { ProductIdSearchField, ProductListType } from '../components/ProductIdSearchField';
import { CreateAndPublishSplitButton } from '../components/CreateAndPublishSplitButton';
import { ArticleSettingsPanel } from '../components/ArticleSettingsPanel';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';


export type CreateOrEditMerchantArticleState = Readonly<{
    article: MerchantNewsArticle | undefined
}>

type FormValues = Readonly<{
    title: string,
    newsType: MerchantArticleType
    body?: string
    product?: ProductListType
    image?: string
    permaLink?: string
}>



const BODY_LIMIT = 2000

type FormUpdaterProps = Readonly<{
    articleType: MerchantArticleType
}>

function FormUpdater({ articleType }: FormUpdaterProps) {
    const formik = useFormikContext()
    const logger = new Logger("MerchantNews")

    useEffect(() => {
        logger.info("Resetting form")
        formik.resetForm()
    }, [articleType])

    return null
}


const useStyles = makeStyles()((theme) => ({


    chip: {
        marginLeft: "2rem",
        backgroundColor: grey[600],
        color: theme.palette.common.white
    }
}))




export function CreateOrEditMerchantArticle() {

    const { l10n } = useAppLocalization()


    const dateTimeFactory = useDateTime()
    const companyId = useAppSelector(selectEffectiveCompanyId)

    let { article } = useLocationState<CreateOrEditMerchantArticleState>({ article: undefined })

    const [expiryDate, setExpiryDate] = useState<DateTime | undefined>(article?.expirationDate ? dateTimeFactory.fromISO(article.expirationDate) : undefined);
    const [publishDate, setPublishDate] = useState<DateTime | undefined>(article?.publishDate ? dateTimeFactory.fromISO(article.publishDate) : undefined);
    const [articleType, setArticleType] = useState<MerchantArticleType>(article?.type ?? MerchantArticleType.NORMAL_ARTICLE)
    const [articleStatus, setArticleStatus] = useState<MerchantArticleStatus>(article?.status ?? MerchantArticleStatus.PUBLISHED)
    const [imageUrl, setImageUrl] = useState<string | null>(article?.imageUrl ?? '');
    const [bodyCharCount, setBodyCharCount] = useState(0)
    const bodyCharCountVar = useRef(0)

    const { classes, cx } = useStyles()

    // const { data: productsQuery } = useApiQuery(getMerchantProducts, {

    // })



    function getInitialValues(articleType: MerchantArticleType, productCatalog?: ProductListType[]): FormValues {
        if (article) {
            switch (article.type) {
                case MerchantArticleType.NORMAL_ARTICLE:
                    return { title: article.subject, newsType: MerchantArticleType.NORMAL_ARTICLE, body: article.body ?? "", }

                case MerchantArticleType.PRODUCT_NEWS:
                    const productId = article.productId
                    // const product = productCatalog.find((p) => p.id === productId)
                    return { title: article.subject, newsType: MerchantArticleType.PRODUCT_NEWS, body: article.body ?? "", }
                // TODO here add product here

                case MerchantArticleType.EXTERNAL_ARTICLE:
                    return { title: article.subject, newsType: MerchantArticleType.EXTERNAL_ARTICLE, permaLink: article.permaLink ?? "", }

                default:
                    return { title: "", newsType: MerchantArticleType.NORMAL_ARTICLE, }
            }
        } else {
            switch (articleType) {
                case MerchantArticleType.NORMAL_ARTICLE:
                    return { title: "", newsType: MerchantArticleType.NORMAL_ARTICLE, body: "", }

                case MerchantArticleType.PRODUCT_NEWS:
                    return { title: "", newsType: MerchantArticleType.PRODUCT_NEWS, product: undefined, body: "", }

                case MerchantArticleType.EXTERNAL_ARTICLE:
                    return { title: "", newsType: MerchantArticleType.EXTERNAL_ARTICLE, permaLink: "", }

                default:
                    return { title: "", newsType: MerchantArticleType.NORMAL_ARTICLE, }
            }
        }
    }

    function getValidationSchema(articleType: MerchantArticleType) {
        switch (articleType) {
            case MerchantArticleType.NORMAL_ARTICLE:
                return Yup.object().shape({
                    title: Yup.string()
                        .required(l10n.getString("validation-title-required")),
                    newsType: Yup.string()
                        .required(l10n.getString("validation-type-required")),
                    body: Yup.string()
                        .required(l10n.getString("validation-body-required"))
                        .test({
                            name: "is-too-long",
                            test: (_value) => bodyCharCountVar.current <= BODY_LIMIT,
                            message: l10n.getString("create-or-edit-merchant-article-body-too-long", { charslimit: BODY_LIMIT }),
                        }),
                })
            case MerchantArticleType.PRODUCT_NEWS:
                return Yup.object().shape({
                    title: Yup.string()
                        .required(),
                    newsType: Yup.string()
                        .required(),
                    product: Yup.object<ProductListType>()
                        .required(),
                    body: Yup.string()
                        .required()
                        .test({
                            name: "is-too-long",
                            test: (_value) => bodyCharCountVar.current <= BODY_LIMIT,
                            message: l10n.getString("create-or-edit-merchant-article-body-too-long", { charslimit: BODY_LIMIT }),
                        }),

                })

            case MerchantArticleType.EXTERNAL_ARTICLE:
                return Yup.object().shape({
                    title: Yup.string()
                        .required(),
                    newsType: Yup.string()
                        .required(),
                    permaLink: Yup.string()
                        .required(),
                })

            default:
                return Yup.object().shape({
                    title: Yup.string()
                        .required(),
                    newsType: Yup.string()
                        .required(),

                })
        }
    }

    const initialValues = useMemo(() => getInitialValues(articleType), [articleType])

    const validationSchema = useMemo(() => getValidationSchema(articleType), [articleType])

    const { mutateAsync: callCreateMerchantAdminNewsDraft } = useApiMutation(createMerchantAdminNews, {})


    function handleSubmit(values: FormValues, _helpers: FormikHelpers<FormValues>) {

        if (!companyId) {
            return;
        }

        if (articleType === MerchantArticleType.NORMAL_ARTICLE) {
            callCreateMerchantAdminNewsDraft({
                merchantId: companyId,
                article: {
                    status: articleStatus,
                    subject: values.title,
                    type: articleType,
                    body: values.body,
                    imageUrl: imageUrl,
                    expirationDate: expiryDate ? expiryDate?.toISODate() : "",
                    publishDate: publishDate ? publishDate?.toISODate() : "",

                }
            })
        } else if (articleType === MerchantArticleType.EXTERNAL_ARTICLE) {
            callCreateMerchantAdminNewsDraft({
                merchantId: companyId,
                article: {
                    status: articleStatus,
                    subject: values.title,
                    type: articleType,
                    permaLink: values.permaLink,
                    imageUrl: imageUrl,
                    expirationDate: expiryDate ? expiryDate?.toISODate() : "",
                    publishDate: publishDate ? publishDate?.toISODate() : "",

                }
            })
        } else if (articleType === MerchantArticleType.PRODUCT_NEWS) {
            callCreateMerchantAdminNewsDraft({
                merchantId: companyId,
                article: {
                    status: articleStatus,
                    subject: values.title,
                    type: articleType,
                    body: values.body,
                    productId: "1", // Todo Hamza
                    expirationDate: expiryDate ? expiryDate?.toISODate() : "",
                    publishDate: publishDate ? publishDate?.toISODate() : "",

                }
            })
        }
    }

    return (
        <Formik<FormValues>
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form onSubmit={() => console.log("Submitted")}>
                <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: "3rem" }}>
                    <Grid sx={{ marginLeft: "1.5rem", marginRight: "5rem", width: "66.6%" }}>
                        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
                            {

                                !article &&
                                <LocalizedStrict id="create-or-edit-merchant-article-create">
                                    <Typography variant="h6" gutterBottom>
                                        Create News Article
                                    </Typography>
                                </LocalizedStrict>

                            }

                            {
                                article &&
                                <LocalizedStrict id="create-or-edit-merchant-article-edit">
                                    <Typography variant="h6" gutterBottom>
                                        Edit Article
                                    </Typography>
                                </LocalizedStrict>

                            }

                            {Badge({ articleStatus, className: classes.chip })}
                        </Grid>

                        <FormUpdater articleType={articleType} />
                        <Grid container rowGap={2} paddingTop="2rem">

                            {articleStatus === MerchantArticleStatus.SCHEDULED &&
                                <Chip icon={<FontAwesomeIcon icon={faCircleInfo} size='xl' />} label={l10n.getString("create-or-edit-merchant-article-info-label-schedule") + publishDate} sx={{ color: grey[700], borderRadius: "0" }} />
                            }


                            {articleStatus === MerchantArticleStatus.DRAFT &&

                                <Chip icon={<FontAwesomeIcon icon={faCircleInfo} size='xl' />
                                } label={l10n.getString("create-or-edit-merchant-article-info-label-draft")} sx={{ color: grey[700], borderRadius: "0" }} />

                            }

                            <FormikDropdown<FormValues> name="newsType" label={l10n.getString("create-or-edit-merchant-article-type")} fullWidth defaultValue={articleType} onChange={(e) => setArticleType(e.target.value as MerchantArticleType)}
                                disabled={!!article}
                            >
                                <MenuItem value={MerchantArticleType.NORMAL_ARTICLE}> {l10n.getString("create-or-edit-merchant-article-normal-article")}</MenuItem>
                                <MenuItem value={MerchantArticleType.EXTERNAL_ARTICLE}>{l10n.getString("create-or-edit-merchant-article-external-article")}</MenuItem>
                                <MenuItem value={MerchantArticleType.PRODUCT_NEWS}>{l10n.getString("create-or-edit-merchant-article-product-news")}</MenuItem>
                            </FormikDropdown>



                            <FormikTextField<FormValues>
                                name="title"
                                label={l10n.getString("create-or-edit-merchant-article-title")}
                                fullWidth
                            />

                            {articleType === MerchantArticleType.EXTERNAL_ARTICLE &&
                                <FormikTextField<FormValues>
                                    name="permaLink"
                                    label="Link"
                                    fullWidth
                                />
                            }
                            {articleType !== MerchantArticleType.EXTERNAL_ARTICLE && (
                                <LocalizedStrict id="create-or-edit-merchant-article-body" attrs={{ placeholder: true, helperText: true }} vars={{ charsRemaining: (BODY_LIMIT - bodyCharCount) }}>
                                    <FormikRichTextEditor<FormValues>
                                        name="body"
                                        placeholder="Body"
                                        helperText={`Characters remaining: ${BODY_LIMIT - bodyCharCount}`}
                                        onCharacterCountChange={(charCount) => {
                                            setBodyCharCount(charCount)
                                            bodyCharCountVar.current = charCount
                                        }}
                                    />
                                </LocalizedStrict>
                            )}

                            {articleType === MerchantArticleType.PRODUCT_NEWS && <>
                                <ProductIdSearchField<FormValues> name="product" />
                            </>
                            }


                            {
                                articleType !== MerchantArticleType.PRODUCT_NEWS &&
                                <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
                            }

                        </Grid>
                    </Grid>

                    <Grid container direction="column" spacing={0.5} paddingTop=".2rem" sx={{ width: "30%", marginRight: "1.5rem" }}>
                        <CreateAndPublishSplitButton articleStatus={articleStatus} setArticleStatus={setArticleStatus} />
                        <ArticleSettingsPanel articleStatus={articleStatus} expiryDate={expiryDate} publishDate={publishDate} setExpiryDate={setExpiryDate} setPublishDate={setPublishDate} />
                    </Grid >
                </Box >
            </Form>
        </Formik>

    )
}
