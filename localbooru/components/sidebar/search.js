import {useEffect, useState} from "react";
import {router} from "next/client";
import {useSearchParams} from "next/navigation";

export default function Search() {
    const searchParams = useSearchParams();
    // The inputted search query
    const baseUrl = 'http://localhost:8080/'
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

    const onSearchKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        let queryFmt = query.replaceAll(" ", "+");
        queryFmt = queryFmt.trim()
        router.push("/posts?tags=" + queryFmt);
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
            <button className={"border-4 border-b-cyan-700 mb-1"} onClick={handleSearch}> Search</button>
        </div>
    </>
}
