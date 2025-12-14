import prisma from "@packages/libs/prisma/prisma";

export const updateUserAnalytics = async (event: any) => {
    try {
        const existingData = await prisma.userAnalytics.findUnique({
            where: { userId: event.userId },
        })
        let updatedAction: any = existingData?.actions || []

        const actionExists = updatedAction.some((entry: any) => {
            return entry.productId === event.ProductId && entry.action === event.action
        })

        //always store product view action
        if (event.action === 'product_view') {
            updatedAction.push({
                productId: event?.productId,
                shopId: event.shopId,
                action: "product_view",
                timeStamp: new Date()
            })
        }
        else if (["add_to_cart", "add_to_wishlist"].includes(event.action) && !actionExists) {
            updatedAction.push({
                productId: event?.productId,
                shopId: event?.shopId,
                action: event?.action,
                timeStamp: new Date()
            })
        }
        //remove add to cart , when remove from cart is triggered
        else if (event.action === 'remove_from_cart') {
            updatedAction = updatedAction.filter((entry: any) => {
                !(entry?.productId === event?.productId && entry.action === 'add_to_cart')
            })
        }

        //keep only the last 100 actions
        if (updatedAction.length > 100) {
            updatedAction.shift()
        }

        const extraFields: Record<string, any> = {}

        if (event.country)
            extraFields.country = event.country
        if (event.city)
            extraFields.city = event.city
        if (event.device)
            extraFields.device = event.device

        await prisma.userAnalytics.upsert({
            where: {  userId: event.userId,},
            update: {
                userId: event.userId,
                lastVisited: new Date(),
                actions: updatedAction,
                ...extraFields,
            },
            create: {
                userId: event.userId,
                lastVisited: new Date(),
                actions: updatedAction,
                ...extraFields,
            },
        })
        //update product analytics
        await updateProductAnalytics(event)
    } catch (error) {
        console.log("Error in user analytics", error)
    }
}

const updateProductAnalytics = async (event: any) => {
    try {
        if (!event.productId || !event.action) return

        const updateFields: any = {}
        const now = new Date()

        switch (event.action) {
            case 'product_view':
                updateFields.views = { increment: 1 }
                updateFields.lastViewedAt = now
                break

            case 'add_to_cart':
                updateFields.cartAdds = { increment: 1 }
                break

            case 'remove_from_cart':
                updateFields.cartAdds = { decrement: 1 }
                break

            case 'add_to_wishlist':
                updateFields.wishListAdds = { increment: 1 }
                break

            case 'remove_from_wishlist':
                updateFields.wishListAdds = { decrement: 1 }
                break

            case 'purchase':
                updateFields.purchases = { increment: 1 }
                break

            default:
                return
        }

        await prisma.productAnalytics.upsert({
            where: { productId: event.productId },
            update: updateFields,
            create: {
                productId: event.productId,
                shopId: event.shopId ?? null,
                views: event.action === 'product_view' ? 1 : 0,
                cartAdds: event.action === 'add_to_cart' ? 1 : 0,
                wishListAdds: event.action === 'add_to_wishlist' ? 1 : 0,
                purchases: event.action === 'purchase' ? 1 : 0,
                lastViewedAt: event.action === 'product_view' ? now : null
            }
        })
    } catch (error) {
        console.error("Error updating product analytics", error)
    }
}
