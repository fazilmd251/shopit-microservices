import { Metadata } from "next"
import Home from "../components/home/Home"

export const metadata :Metadata= {
  title: 'Shopit',
  description: 'E-commerce',
}

const page = () => {
  return (
    <>
    <Home/>
    </>
  )
}

export default page