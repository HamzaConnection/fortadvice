import { AdminHomeCard, AdminHomeCardProps } from "../../../admin/components/AdminHomeCard"


type TenantHomeCardProps = AdminHomeCardProps & Readonly<{}>

export function TenantHomeCard(props: TenantHomeCardProps) {
    return (
        <AdminHomeCard {...props} />
    )
}
