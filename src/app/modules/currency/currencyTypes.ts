export type MonetaryAmount = Readonly<{
    amount: number
    scale: number
    currency: string
    formatted?: string
}>
