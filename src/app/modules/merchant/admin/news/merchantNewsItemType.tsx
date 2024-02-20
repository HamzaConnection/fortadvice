
export type MerchantNewsArticle = NormalMerchantNewsArticle | ExternalMerchantNewsArticle | MerchantProductNewsArticle


export type BaseMerchantNewsArticle = Readonly<{
    id: number,
    type: MerchantArticleType,
    status: MerchantArticleStatus
    subject: string,
    imageUrl?: string | null,
    created?: string,
    updated?: string,
    publishDate?: string,
    expirationDate?: string,
}>


export type NormalMerchantNewsArticle = BaseMerchantNewsArticle & Readonly<{
    type: MerchantArticleType.NORMAL_ARTICLE,
    body?: string,
}>

export type ExternalMerchantNewsArticle = BaseMerchantNewsArticle & Readonly<{
    type: MerchantArticleType.EXTERNAL_ARTICLE,
    permaLink?: string,

}>

export type MerchantProductNewsArticle = BaseMerchantNewsArticle & Readonly<{
    type: MerchantArticleType.PRODUCT_NEWS,
    productId?: string
    body?: string
}>




export enum MerchantArticleType {
    NORMAL_ARTICLE = "NORMAL_ARTICLE",
    EXTERNAL_ARTICLE = "EXTERNAL_ARTICLE",
    PRODUCT_NEWS = "PRODUCT_NEWS",
}

export enum MerchantArticleStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    SCHEDULED = "SCHEDULED",
    EXPIRED = "EXPIRED",
}
