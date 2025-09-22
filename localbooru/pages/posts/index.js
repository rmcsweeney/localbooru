import Image from 'next/image';
import {useEffect, useState} from "react";
import Link from "next/link";
import ThemeSwitcher from "../../components/buttons/themeswitcher";

export default function Post() {


    const [postData, setPostData] = useState([]);

    //TODO: figure out how to move the below & similar to a config/env file?
    const baseUrl = 'http://localhost:8080/'
    
    // Images to load per click
    const loadSize=6
    // Number of images loaded so far
    const [loadOffset, setLoadOffset] = useState(0);
    
    const fetchPost = async() => {
        try {
            const res = await fetch(baseUrl + `posts/` + loadSize + '/' + loadOffset);
            const data = await res.json();
            const newPostData = postData.concat(data);
            setPostData(newPostData) //TODO handle no more images case better
            setLoadOffset(loadOffset+loadSize)
        } catch (error) {
            console.log('Error fetching post: ', error);
        }
    };

    //Calls fetchPost to populate the page at load time once (empty deps array).
    useEffect(() => {
        fetchPost();
    }, []);


    return <>
        <div className={"grid grid-cols-[10%_90%] dark:bg-slate-800"}>
            <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={100} height={100} className={"justify-center"} />
            <p className={"text-orange-700 dark:text-emerald-200"} >
                Welcome to Localbooru!
            </p>
        </div>
        <div className={"grid grid-cols-[20%_80%]"}>
            <div className={"m-1"}>
                <button className={"border-4 border-b-cyan-700 mb-1"} onClick={fetchPost}> Click to load {loadSize} image{loadSize === 1 ? "" : "s"}</button>
                <input className={"max-w-[100%]"} defaultValue={"Enter tags..."}></input>
            </div>
            <div>
                <div className={"grid-cols-4 grid"} >
                    {postData.map( (post, index) => {
                        return <Link href={"/posts/" + post?.ID} key={post?.ID}
                        className={"m-1 rounded"}>
                            <Image className={"flex-auto"} width={300} height={300} src={baseUrl + "assets/images" + "/" + post?.FileName + "." + post?.FileType} key={index} alt={post?.FileName} />
                        </Link>
                    })}
                </div>
            </div>

        </div>

        <ThemeSwitcher></ThemeSwitcher>
    </>;
}