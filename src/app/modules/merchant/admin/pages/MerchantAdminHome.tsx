import { useNavigate } from "react-router-dom"
import { makeStyles } from "tss-react/mui"
import { MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE, MERCHANT_ADMIN_CUSTOMERS_ROUTE, MERCHANT_ADMIN_PRICE_LIST_ROUTE, MERCHANT_ADMIN_PRODUCTS_ROUTE, MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE, MERCHANT_ADMIN_SHOPS_ROUTE, MERCHANT_NEWS_ROUTE } from "../../../../constants/routes"
import { MatchEnvironment } from "../../../environment/components/MatchEnvironment"
import { EnvironmentType } from "../../../environment/envTypes"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { AdminHomeCard, AdminHomeCardGroup, AdminHomeCardGroups } from "../../../admin/components/AdminHomeCard"

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
}))

type Props = Readonly<{}>

export function MerchantAdminHomePage({ }: Props) {
    const { classes } = useStyles()
    const navigate = useNavigate()

    return (
        <div className={classes.page}>
            <AdminHomeCardGroups>

                <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                    <LocalizedStrict id="merchant-admin-home-communication-group" attrs={{ title: true }}>
                        <AdminHomeCardGroup title="Communication">

                            <LocalizedStrict id="merchant-admin-home-merchant-news-card" attrs={{ title: true, description: true }}>
                                <AdminHomeCard
                                    title="Merchant News"
                                    description="Manage your news to your customers"
                                    onShowAllClick={() => navigate(MERCHANT_NEWS_ROUTE)}
                                />
                            </LocalizedStrict>

                        </AdminHomeCardGroup>
                    </LocalizedStrict>
                </MatchEnvironment>

                <LocalizedStrict id="merchant-admin-home-customers-group" attrs={{ title: true }}>
                    <AdminHomeCardGroup title="Customers">

                        <LocalizedStrict id="merchant-admin-home-customers-card" attrs={{ title: true, description: true }}>
                            <AdminHomeCard
                                title="Customers"
                                description="Manage customer access to your merchant"
                                onShowAllClick={() => navigate(MERCHANT_ADMIN_CUSTOMERS_ROUTE)}
                            />
                        </LocalizedStrict>

                    </AdminHomeCardGroup>
                </LocalizedStrict>

                <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                    <LocalizedStrict id="merchant-admin-home-shop" attrs={{ title: true }}>
                        <AdminHomeCardGroup title="Shops">

                            <LocalizedStrict id="merchant-admin-home-products" attrs={{ title: true, description: true }}>
                                <AdminHomeCard onCreateClick={() => navigate(MERCHANT_ADMIN_PRODUCTS_ROUTE)}
                                    title="Products"
                                    description=""
                                    onShowAllClick={() => navigate(MERCHANT_ADMIN_PRODUCTS_ROUTE)}
                                />
                            </LocalizedStrict>

                            <LocalizedStrict id="merchant-admin-home-product-groups" attrs={{ title: true, description: true }}>
                                <AdminHomeCard onCreateClick={() => navigate(MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE)}
                                    title="Product groups"
                                    description=""
                                    onShowAllClick={() => navigate(MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE)}
                                />
                            </LocalizedStrict>

                            <LocalizedStrict id="merchant-admin-home-price-list" attrs={{ title: true, description: true }}>
                                <AdminHomeCard onCreateClick={() => navigate(MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE)}
                                    title="Price list"
                                    description=""
                                    onShowAllClick={() => navigate(MERCHANT_ADMIN_PRICE_LIST_ROUTE)}
                                />
                            </LocalizedStrict>

                            <LocalizedStrict id="merchant-admin-home-shop" attrs={{ title: true, description: true }}>
                                <AdminHomeCard onCreateClick={() => navigate(MERCHANT_ADMIN_SHOPS_ROUTE)}
                                    title="Shops"
                                    description=""
                                    onShowAllClick={() => navigate(MERCHANT_ADMIN_SHOPS_ROUTE)}
                                />
                            </LocalizedStrict>

                        </AdminHomeCardGroup>
                    </LocalizedStrict>
                </MatchEnvironment>
            </AdminHomeCardGroups>
        </div>
    )
}
