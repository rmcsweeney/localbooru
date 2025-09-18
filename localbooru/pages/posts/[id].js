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
                // For some reason, this always happens once but we succeed after that
                if (id === null || id === undefined) {
                    throw (new Error("ID was null or undefined"));
                }

                const res = await fetch(baseUrl + `posts/` + id);
                const data = await res.json();
                setPostData(data)
            } catch (error) {
                console.log('Error fetching post: ', error);
            }
        };
        fetchPost()

    }, [id]);

    return (
        <>
            <h1>
                Hello {id}!
            </h1>

            <img src={baseUrl + "assets/images" + "/" + postData.FileName + ".png"}></img>

        </>
    )
}