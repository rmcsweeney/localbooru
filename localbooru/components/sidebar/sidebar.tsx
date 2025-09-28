import {useState} from "react";
import {router} from "next/client";
import {useSearchParams} from "next/navigation";

export default function Sidebar() {
    const searchParams = useSearchParams();
    // The inputted search query
    const [query, setQuery] = useState(searchParams? searchParams.get("tags") : "");

    const onSearchKeyDown = (e: { key: string; }) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        router.push("/posts" + "?" + "tags=" + query);
    }

    return <>
        <div className={"m-1"}>
            <input className={"max-w-[100%]"} placeholder={"Enter tags..."}
                   onInput={e => setQuery(e.currentTarget.value)} onKeyDown={onSearchKeyDown}></input>
            <button className={"border-4 border-b-cyan-700 mb-1"} onClick={handleSearch}> Search</button>
            <form action="http://localhost:8080/upload" method="post" encType="multipart/form-data">
                <label htmlFor="file">File</label>
                <input id="file" name="uploadFile" type="file"/>
                <button>Upload</button>
            </form>
        </div>
    </>
}
