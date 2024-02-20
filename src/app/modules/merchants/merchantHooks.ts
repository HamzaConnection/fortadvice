import { selectEffectiveCompanyId } from "../context/contextSelectors";
import { useAppSelector } from "../store/storeHooks";

export function useMerchant() {
    const merchantId = useAppSelector(selectEffectiveCompanyId)

    if (!merchantId) {
        throw new Error("Invalid state: effective merchant id not found")
    }

    return {
        merchantId
    }
}
