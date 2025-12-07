import prisma from "@packages/libs/prisma/prisma";
import cron from 'node-cron'


cron.schedule("0 * * * *",async()=>{
    try {
        const now=new Date()
        await prisma.product.deleteMany({
            where:{
                isDeleted:true,deletedAt:{lte:now}
            }
        })
        //console.log(`${deletedProducts.count} expired products permanently deleted`)
    } catch (error){
        console.log(error)
    }
})