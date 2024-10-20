import { auth } from "@clerk/nextjs/server"
import { db } from "./db"

const DAY_IN_MS = 86400000

export async function checkIfSubscriptionIsActive(): Promise<boolean> {
    const { orgId } = auth()

    if (!orgId) return false

    const orgSubscription = await db.orgSubscription.findUnique({
        where: { orgId },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true
        }
    })

    if (!orgSubscription) return false

    const stripeCurrentPeriodEnd = orgSubscription.stripeCurrentPeriodEnd?.getTime() || 0

    const isValid = orgSubscription.stripePriceId && stripeCurrentPeriodEnd + DAY_IN_MS > Date.now()

    return !!isValid
}