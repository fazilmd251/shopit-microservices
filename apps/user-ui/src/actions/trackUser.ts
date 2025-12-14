"use server"
import kafka from "../../../../packages/utils/kafka/index"

 const producer=kafka.producer()

 type EventData={
    userId?:string
    productId?:string
    shopId?:string
    action:string
    device?:string
    country?:string
    city?:string
 }

 export async function sendKafkaEvents(eventData:EventData){
    try {
        await producer.connect()
        await producer.send({
            topic:"user-events",
            messages:[{value:JSON.stringify(eventData)}]
        })
    } catch (error) {
        console.log(error)
    }finally{
        await producer.disconnect()
    }
 }
