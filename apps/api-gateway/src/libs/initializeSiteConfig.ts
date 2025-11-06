import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initializeConfig = async () => {
    try {
        const existingConfig = await prisma.site_config.findFirst()
        if (!existingConfig) {
            await prisma.site_config.create({
                data: {
                    categories: [
                        "electronics",
                        "fashion",
                        "home_appliances",
                        "groceries",
                        "books",
                        "toys",
                        "beauty",
                        "sports",
                        "automotive",
                        "furniture"
                    ],
                    subCategories: {
                        electronics: ["laptop", "tv", "mobile", "camera"],
                        fashion: ["jeans", "shirt", "shoes", "watch"],
                        home_appliances: ["washing_machine", "refrigerator", "microwave"],
                        groceries: ["fruits", "vegetables", "snacks"],
                        books: ["fiction", "non-fiction", "comics"],
                        toys: ["puzzles", "cars", "lego"],
                        beauty: ["makeup", "perfume", "skincare"],
                        sports: ["cricket", "football", "badminton"],
                        automotive: ["car_accessories", "bike_accessories", "tools"],
                        furniture: ["sofa", "chair", "bed"]
                    }
                }
            })
        }
    } catch (error) {
console.log("Error initialize site config error : ",error)
    }
}

export default initializeConfig