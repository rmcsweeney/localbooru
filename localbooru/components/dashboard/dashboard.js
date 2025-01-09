import Image from "next/image";

export default function Dashboard() {



    return <>
        <div className="max-w-7xl mx-auto align-middle">
            <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={200} height={200} />
            <h1 className="text-3xl font-bold text-center text-cyan-800" >
                Welcome to Localbooru!
            </h1>
        </div>

    </>;
}