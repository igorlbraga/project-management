import { auth, currentUser } from "@clerk/nextjs/server"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { db } from "./db"

interface Props {
    entityId: string
    entityTitle: string
    entityType: ENTITY_TYPE
    action: ACTION
}

export async function createAuditLog(props: Props) {
    try {
        const { orgId } = auth()
        const user = await currentUser()

        if (!user || !orgId) throw new Error("User not found")

        const { entityId, entityTitle, entityType, action } = props

        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user.imageUrl,
                userName: user.fullName || "(no name)"
            }
        })
    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error)
    }
}