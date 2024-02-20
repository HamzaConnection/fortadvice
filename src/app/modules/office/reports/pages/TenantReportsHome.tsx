import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { ComingSoonPlaceholder } from "../../../../shared/components/placeholders/ComingSoonPlaceholder"
import DashboardAnimation from "../../../merchant/merchant/assets/animation_ljyatnb9.json"

export function TenantReportsHome() {
    return (
        <LocalizedStrict id="tenant-reports-home-placeholder" attrs={{ title: true, body: true }}>
            <ComingSoonPlaceholder
                title="Tenant dashboard coming soon"
                body="Your dashboard will show an overview of important key figures, so you always have a good overview of purchases and daily operations."
                lottieAnimation={DashboardAnimation}
            />
        </LocalizedStrict>
    )
}
