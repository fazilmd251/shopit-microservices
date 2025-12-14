import kafka from "@packages/utils/kafka";
import {updateUserAnalytics}from "./service/analytics.service"

const consumer=kafka.consumer({ groupId: 'user-events-group' })

const eventQueue: any[] = []

const processQueue = async () => {
  if (eventQueue.length === 0) return
  const events = [...eventQueue]
  eventQueue.length = 0

  for (const event of events) {
    if (event.action === 'shop_visit') {
      continue//update shop analytics
    }

    //rest of actions
    const validActions = [
      "add_to_cart",
      "remove_from_cart",
      "add_to_wishlist",
      "product_view",
      "remove_from_wishlist"
    ]
    if (!event.action||!validActions.includes(event.action)) continue

    try {
      await updateUserAnalytics(event)
    } catch (error) {
      
    }
  }
}

setInterval(processQueue,3000) //calls function every 3 sec

//kafka consumer
const consumeKafkaMessage=async()=>{
//connect to kafka broker
await consumer.connect()
await consumer.subscribe({topic:"user-events",fromBeginning:false})
await consumer.run({
  eachMessage:async ({message})=>{
    if(!message.value)return
    const event=JSON.parse(message.value.toString())
    eventQueue.push(event)
  }
})
}

consumeKafkaMessage().catch(console.error)
