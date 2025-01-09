import Image from "next/image";

export default function Dashboard() {



    return <>
        <div className="p-10">
            <div className="justify-center flex p-1">
                <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={100} height={100} className={"justify-center"} />
            </div>

            <h1 className="text-3xl font-bold text-center text-cyan-800 p-10" >
                Welcome to Localbooru!
            </h1>
        </div>

    </>;
}