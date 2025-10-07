import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import Image from "next/image";
import Search from "../../components/sidebar/search";

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    const [postData, setPostData] = useState({
        ID: 0,
        FileName: "loading.gif",
        FileType: "images",
        CreatedAt: "",
        Tags: []
    });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
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
            <div>
                <h1>
                    Hello {id}!
                </h1>
            </div>

            <div className={"grid grid-cols-[20%_80%]"}>
                <div>
                    <Search/>
                    <div>
                        <p>
                            Created at: {postData.CreatedAt}
                        </p>
                    </div>
                    {postData.Tags !== null? postData.Tags.map( (tag, index) => {
                        return <div key={index} className={"flex justify-between items-center"}>
                            <p className={"text-left"}>
                                {tag.Name}
                            </p>
                            <p className={"text-right"}>
                                {tag.Count}
                            </p>
                        </div>
                    }): <p>No tags yet!</p>}
                </div>
                <div className={"m-4 border-4 border-b-cyan-700"}>
                    {postData.FileName === "loading.gif"?
                        <Image width={100} height={100}
                            alt={"loading"} src={"/images/loading.gif"}></Image>:
                        <Image width={500} height={500}
                           alt={"post"} src={baseUrl + "assets/images" + "/" + postData.FileName + ".png"}></Image>
                    }
                </div>
            </div>
        </>
    )
}