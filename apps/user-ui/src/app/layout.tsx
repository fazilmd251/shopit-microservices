import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import "./css/global.css";
import './css/euclid-circular-a-font.css';
import Providers from "./Providers";
import Header from "../components/header/Header";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { ModalProvider } from "./context/QuickViewModalContext";
import { PreviewSliderProvider } from "./context/PreviewSliderContext";
import QuickViewModal from "../components/Common/QuickViewModal";
import CartSidebarModal from "../components/Common/CartSidebarModal";
import PreviewSliderModal from "../components/Common/PreviewSlider";

export const metadata: Metadata = {
  title: 'Shopit',
  description: 'E-commerce',
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto'
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body >
        <Providers>
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Header />
                {children}
                
                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
              </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
        </Providers>
      </body>
    </html>
  )
}
