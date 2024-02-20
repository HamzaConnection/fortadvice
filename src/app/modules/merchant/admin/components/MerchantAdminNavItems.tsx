import { faHome, faBuildings, faNewspaper, faShop, faBurger, faList, faPlateUtensils } from "@fortawesome/pro-light-svg-icons"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { MERCHANT_ADMIN_ROUTE, MERCHANT_ADMIN_CUSTOMERS_ROUTE, MERCHANT_NEWS_ROUTE, MERCHANT_ADMIN_SHOPS_ROUTE, MERCHANT_ADMIN_PRODUCTS_ROUTE, MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE, MERCHANT_ADMIN_PRICE_LIST_ROUTE } from "../../../../constants/routes"
import { NavMenuItem } from "../../../../shared/layouts/components/NavMenuItem"
import { MatchEnvironment } from "../../../environment/components/MatchEnvironment"
import { EnvironmentType } from "../../../environment/envTypes"

type Props = Readonly<{}>

export function MerchantAdminNavItems({ }: Props) {
    return (
        <>
            <LocalizedStrict id="merchant-nav-item-home">
                <NavMenuItem icon={faHome} dest={MERCHANT_ADMIN_ROUTE}>Home</NavMenuItem>
            </LocalizedStrict>
            <LocalizedStrict id="merchant-nav-item-customer-access">
                <NavMenuItem icon={faBuildings} dest={MERCHANT_ADMIN_CUSTOMERS_ROUTE}>Customer Access</NavMenuItem>
            </LocalizedStrict>
            <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                <LocalizedStrict id="merchant-nav-item-merchant-news">
                    <NavMenuItem icon={faNewspaper} dest={MERCHANT_NEWS_ROUTE}>Merchant News</NavMenuItem>
                </LocalizedStrict>
                <LocalizedStrict id="merchant-admin-home-shop">
                    <NavMenuItem icon={faShop} dest={MERCHANT_ADMIN_SHOPS_ROUTE}>Shops</NavMenuItem>
                </LocalizedStrict>
                <LocalizedStrict id="merchant-admin-home-products">
                    <NavMenuItem icon={faBurger} dest={MERCHANT_ADMIN_PRODUCTS_ROUTE}>Products</NavMenuItem>
                </LocalizedStrict>
                <LocalizedStrict id="merchant-admin-home-product-groups">
                    <NavMenuItem icon={faPlateUtensils} dest={MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE}>Product group</NavMenuItem>
                </LocalizedStrict>
                <LocalizedStrict id="merchant-admin-home-price-list">
                    <NavMenuItem icon={faList} dest={MERCHANT_ADMIN_PRICE_LIST_ROUTE}>Price list</NavMenuItem>
                </LocalizedStrict>
            </MatchEnvironment>
        </>
    )
}
