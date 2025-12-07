import { Metadata } from "next"

export const metadata :Metadata= {
  title: 'Shopit',
  description: 'E-commerce',
}

const page = () => {
  return (
    <div className="text-3xl font-bold">page</div>
  )
}

export default page