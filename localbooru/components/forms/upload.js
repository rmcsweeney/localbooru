import Form from "next/form";
import {useState} from "react";

export default function Upload() {
    const baseUrl = "http://localhost:8080/";

    /*const changeFile = (event) => {
        setFile(event.target.files[0]);
    }*/

    const uploadFile = async(formData) => {

        try {
            const res = await fetch(baseUrl + `upload`, {
                method: 'POST',
                body:formData
            })

            if (res.ok) {
                console.log('File uploaded successfully');
            }
        }
        catch (error) {
            console.log('Error uploading file: ', error);
        }
    };

    return <>
        <form action={uploadFile} encType={"multipart/form-data"} method="post">
            <label>Select file:</label>
            <input type="file" name="file" accept="image/*,video/*" />
            <button type="submit">Upload</button>
        </form>
    </>
}