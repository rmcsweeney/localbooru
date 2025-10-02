import Image from "next/image";
import {useEffect, useState} from "react";
import {router} from "next/client";
import Link from "next/link";
import Search from "../sidebar/search";
import Upload from "../forms/upload";

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
                <Upload></Upload>
            </div>
        </div>

    </>;
}