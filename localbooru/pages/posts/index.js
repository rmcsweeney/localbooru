import colors from "tailwindcss/colors";
import Image from 'next/image';

export default function Post() {



    return <>
        <Image src="Al_Sneed.png" alt={"Sneedem Feedem!"}/>
        <h1 color={colors.fuchsia} >
            Welcome to Localbooru!
        </h1>
    </>;
}