import Image from "next/image";
import Link from "next/link";
import Search from "../sidebar/search";
import UploadPost from "../forms/uploadPost";
import UploadTag from "../forms/uploadTag";

export default function Dashboard() {

    return <>
        <div className="p-10 grid grid-rows-[40%_60%]">
            <div className="justify-center flex p-1">
                <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={100} height={100} className={"justify-center"} />
            </div>

            <h1 className="text-3xl font-bold text-center text-cyan-800 p-10" >
                Welcome to Localbooru!
            </h1>
            <div className="justify-center grid grid-rows-2 p-1">
                <Search></Search>
                <Link href={"/posts"} className={"border-4 border-b-cyan-700"}>
                    <p className={"text-center"}>Go to all Posts</p>
                </Link>
                <UploadPost></UploadPost>
                <UploadTag></UploadTag>
            </div>
        </div>

    </>;
}