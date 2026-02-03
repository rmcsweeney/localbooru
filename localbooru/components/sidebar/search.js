import {useEffect, useState} from "react";
import {router} from "next/client";
import {useSearchParams} from "next/navigation";
import {SearchType} from "../../constants/enums";

export default function Search({search = SearchType.SEARCH, postId=null}) {
    const searchParams = useSearchParams();
    // The inputted search query
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [topTags, setTopTags] = useState([])
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchTopTags();
    }, []);

    const fetchTopTags = async() => {
        try {
            const res = await fetch(baseUrl + `tags`);
            const data = await res.json();
            setTopTags(data)
        } catch (error) {
            console.log('Error fetching top tags: ', error);
        }
    }

    const addTag = async(tagName) => {
        try {
            let formData = new FormData();
            formData.append("tagName", tagName);
            formData.append("postId", postId);
            const res = await fetch(baseUrl + `add/tag`, {
                method: 'POST',
                body: formData,
            })
            if (res.ok) {
                console.log("Successfully added the tag " + tagName);
            }
        }
        catch (error) {
            console.log("Error adding tag: ", error);
        }
    }

    const onSearchKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        if (search === SearchType.SEARCH){
            let queryFmt = query.replaceAll(" ", "+");
            queryFmt = queryFmt.trim()
            router.push("/posts?tags=" + queryFmt);
        }
        else if (search === SearchType.ADD){
            let queryFmt = query.replaceAll(" ", "+");
            queryFmt = queryFmt.trim()
            addTag(queryFmt);
        }
    }

    return <>
        <div className={"m-1"}>
            <input className={""} placeholder={"Enter tags..."}
                   defaultValue={searchParams.get("Tags")? searchParams.get("Tags").replaceAll("+", " "): ""} list={"dynamicTags"}
                   onInput={e => setQuery(e.currentTarget.value)} onKeyDown={onSearchKeyDown}></input>
            <datalist id={"dynamicTags"}>
                {topTags !== null ? topTags.map((tag, index) => {
                    return <option key={index} value={tag.Name}></option>
                }) : <></>}
            </datalist>
            <button className={"border-4 border-b-cyan-700 mb-1"} onClick={handleSearch}>{search}</button>
        </div>
    </>
}
