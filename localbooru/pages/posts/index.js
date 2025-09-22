import Image from 'next/image';
import {useEffect, useState} from "react";

export default function Post() {


    const [postData, setPostData] = useState([]);

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

    useEffect(() => {
        fetchPost();
    }, []);


    return <>
        <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={100} height={100} className={"justify-center"} />
        <p className={"text-orange-700 dark:text-emerald-200"} >
            Welcome to Localbooru!
        </p>
        <div className={"grid"}>
            <input defaultValue={"Enter tags..."}></input>
        </div>
        <div>
            <button onClick={fetchPost}> Click to load {loadSize} image{loadSize === 1 ? "" : "s"}</button>
            <div className={"grid-cols-4 grid"} >
                {postData.map( (post, index) => {
                    return <Image className={"flex-auto"} width={300} height={300} src={baseUrl + "assets/images" + "/" + post?.FileName + "." + post?.FileType} key={index} alt={post?.FileName} />
                })}
            </div>
        </div>

    </>;
}