import Image from 'next/image';
import {useState} from "react";

export default function Post() {


    const [postData, setPostData] = useState([]);

    const baseUrl = 'http://localhost:8080/'
    
    // Images to load per click
    const loadSize=4
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


    return <>
        <Image src="/images/Al_Sneed.png" alt={"Sneedem Feedem!"} width={100} height={100} className={"justify-center"} />
        <p className={"text-orange-700 dark:text-emerald-200"} >
            Welcome to Localbooru!
        </p>
        <button onClick={fetchPost}> Click to load {loadSize} image{loadSize == 1 ? "" : "s"}</button>
        <div style={{ display:"flex",flexDirection:"row"}}>
            {postData.map( (post, index) => {
               return <img src={baseUrl + "assets/images" + "/" + post?.FileName + ".png"} key={index} />   
            })}
        </div>
    </>;
}