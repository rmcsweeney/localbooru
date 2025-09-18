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
                const res = await fetch(baseUrl + `posts/` + "1");
                const data = await res.json();
                setPostData(data)
            } catch (error) {
                console.error('Error fetching post: ', error);
            }
        };
        fetchPost()

    }, []);

    return (
        <>
            <h1>
                Hello {id}!
            </h1>

            <img src={baseUrl + "assets/images" + "/" + postData.FileName + ".png"}></img>

        </>
    )
}