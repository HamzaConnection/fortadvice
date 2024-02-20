import { ComingSoonPlaceholder } from "../../../../shared/components/placeholders/ComingSoonPlaceholder"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import DashboardAnimation from "../../../merchant/merchant/assets/animation_ljyatnb9.json"

type HomeProps = Readonly<{}>

export function SupplierReportsHome({}: HomeProps) {
    return (
        <LocalizedStrict id="supplier-home-placeholder" attrs={{ title: true, body: true }}>
            <ComingSoonPlaceholder
                title="Supplier dashboard coming soon"
                body="Your sales dashboard will show an overview of important key figures, so you always have a good overview of sales and daily operations."
                lottieAnimation={DashboardAnimation}
            />
        </LocalizedStrict>
    )
}
