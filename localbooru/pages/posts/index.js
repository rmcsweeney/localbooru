import Image from 'next/image';
import {useEffect, useState, useId} from "react";
import Link from "next/link";
import ThemeSwitcher from "../../components/buttons/themeswitcher";

export default function Post() {

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

    // Images to load per click
    const loadSize=6
    // Number of images loaded so far
    const [loadOffset, setLoadOffset] = useState(0);

    const resetState = () => {
        setShouldReset(true); // Not sure why, but setPostData([]) doesn't actually clear the array for some reason - using this flag as a workaround
        setLoadOffset(0);
    }

    
    const fetchPost = async() => {
        try {
            const res = await fetch(baseUrl + `posts/` + loadSize + '/' + loadOffset);
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

    const onSearchKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        if(query == lastQuery) {
            return; // Prevents spamming pointless duplicate searches
        }
        resetState();
        searchByTag();
        setLastQuery(query);
    }

    const searchByTag = async() => {
        try {
            //TODO better validation against SQL/HTML injection etc
            //TODO support comma delimited list of tags as input (also requires backend changes)
            const sanitized = query.toLowerCase().trim()
            if (sanitized.length === 0) {
                fetchPost();
                return;
            }
            const res = await fetch(baseUrl + `posts/tag/` + sanitized);
            const data = await res.json();
            if (data == null || data == undefined) {
                return;
            }
            const newPostData = data
            setPostData(newPostData) //TODO handle no more images case better
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
                <input className={"max-w-[100%]"} placeholder={"Enter tags..."} onInput={e => setQuery(e.currentTarget.value)} onKeyDown={onSearchKeyDown}></input>
                <button className={"border-4 border-b-cyan-700 mb-1"} onClick={handleSearch}> Search </button>
                <form action="http://localhost:8080/upload" method="post" enctype="multipart/form-data">
                    <label for="file">File</label>
                    <input id="file" name="uploadFile" type="file" />
                    <button>Upload</button>
                </form>
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