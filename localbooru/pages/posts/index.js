import colors from "tailwindcss/colors";
import Image from 'next/image';

export default function Post() {



    return <>
        <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={100} height={100} className={"justify-center"} />
        <p className={"text-orange-700 dark:text-emerald-200"} >
            Welcome to Localbooru!
        </p>
    </>;
}