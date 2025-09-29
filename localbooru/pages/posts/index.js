import Image from 'next/image';
import {useEffect, useState} from "react";
import Link from "next/link";
import ThemeSwitcher from "../../components/buttons/themeswitcher";
import {useSearchParams} from "next/navigation";
import {router} from "next/client";

export default function Post() {

    const searchParams = useSearchParams();

    //TODO: figure out how to move the below & similar to a config/env file?
    const baseUrl = 'http://localhost:8080/'

    // The posts currently loaded for display
    const [postData, setPostData] = useState([]);
    // Workaround flag to reset the page data after searching for an empty string
    const [shouldReset,setShouldReset] = useState(false);
    // The inputted search query
    const [query, setQuery] = useState("");
    // The last query successfully searched
    const [lastQuery, setLastQuery] = useState("");
    // The top tags by count TODO: update based on posts loaded or filter by search regex
    const [topTags, setTopTags] = useState([])

    // Images to load per click
    const loadSize=10
    // Number of images loaded so far
    const [loadOffset, setLoadOffset] = useState(0);

    const resetState = () => {
        setShouldReset(true); // Not sure why, but setPostData([]) doesn't actually clear the array for some reason - using this flag as a workaround
        setLoadOffset(0);
    }

    
    const fetchPost = async() => {
        try {
            const res = (searchParams.get("tags") === null?
                await fetch(baseUrl + `posts/` + loadSize + '/' + loadOffset) :
                await fetch(baseUrl + `posts/tag/` + searchParams.get('tags')))
            const data = await res.json();
            var newPostData = postData.concat(data);
            if (shouldReset) {
                setShouldReset(false);
                newPostData = data;
            }
            setPostData(newPostData) //TODO handle no more images case better
            setLoadOffset(loadOffset+loadSize)
        } catch (error) {
            console.log('Error fetching post: ', error);
        }
    };

    const fetchTopTags = async() => {
        try {
            const res = await fetch(baseUrl + `tags`);
            const data = await res.json();
            setTopTags(data)
        } catch (error) {
            console.log('Error fetching top tags: ', error);
        }
    }

    const onSearchKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        if(query === lastQuery) {
            return; // Prevents spamming pointless duplicate searches
        }
        resetState();
        setLastQuery(query);
        let queryFmt = query.replaceAll(" ", "+");
        queryFmt.trim()
        router.push("/posts" + "?" + "tags=" + queryFmt);
    }


    //Calls fetchPost to populate the page at load time once (empty deps array).
    useEffect(() => {
        setPostData([]);
        fetchPost();
        fetchTopTags();
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
                <input className={"max-w-[100%]"} placeholder={"Enter tags..."} list={"dynamicTags"} onInput={e => setQuery(e.currentTarget.value)} onKeyDown={onSearchKeyDown}></input>
                <datalist id={"dynamicTags"}>
                    {topTags !== null ? topTags.map( (tag, index) => {
                        return <option key={index} value={tag.Name}></option>
                    }): <></>}
                </datalist>
                <button className={"border-4 border-b-cyan-700 mb-1"} onClick={handleSearch}> Search </button>
                <form action="http://localhost:8080/upload" method="post" enctype="multipart/form-data">
                    <label for="file">File</label>
                    <input id="file" name="uploadFile" type="file" />
                    <button>Upload</button>
                </form>
                {topTags !== null ? topTags.map( (tag, index) => {
                    return <div key={index} className={"flex justify-between items-center"}>
                        <p className={"text-left"}>
                            {tag.Name}
                        </p>
                        <p className={"text-right"}>
                            {tag.Count}
                        </p>
                    </div>
                }): <p>Loading tags...</p>}
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