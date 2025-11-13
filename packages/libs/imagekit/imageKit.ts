import ImageKit from 'imagekit'

const imageKit=new ImageKit({
    publicKey:process.env.PUBLIC_KEY||"",
    privateKey:process.env.PRIVATE_KEY||"",
    urlEndpoint:process.env.IMAGE_KIT_URL||""
})

export default imageKit
