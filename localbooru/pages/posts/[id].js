import { useRouter } from "next/router";
import {useEffect, useState} from "react";

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    const [postData, setPostData] = useState({
        ID: 0,
        FileName: "loading.webp",
        FileType: "images",
        CreatedAt: "",
    });
    const baseUrl = 'http://localhost:8080/'

    useEffect(() => {
        const fetchPost = async() => {
            try {
                const res = await fetch(baseUrl + `posts/` + id);
                const data = await res.json();
                setPostData(data)
            } catch (error) {
                console.error('Error fetching post: ', error);
            }
        };
        fetchPost()

    })
    then(r => {
        let mediaReader = r.body.getReader();
        let image = mediaReader.read()
    });

    return (
        <>
            <h1>
                Hello {id}!
            </h1>
            <Image src={baseUrl + postData.FileType + "/" + postData.FileName}></Image>
        </>

    )
}