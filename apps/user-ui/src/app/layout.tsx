import type { Metadata } from "next";
import { Geist, Geist_Mono ,Poppins,Roboto} from "next/font/google";
import "./global.css";
import Header from "./shared/widgets/header/Header";
import Providers from "./Providers";

export const metadata :Metadata= {
  title: 'Shopit',
  description: 'E-commerce',
}

const roboto=Roboto({
  subsets:['latin'],
  weight:['100','300','400','500','600','700','800','900'],
  variable:'--font-roboto'
})

const poppins=Poppins({
  subsets:['latin'],
  weight:['100','300','400','500','600','700','800','900'],
  variable:'--font-poppins'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
         <Providers>
        <Header/>
        {children}
        </Providers>
        </body>
    </html>
  )
}
