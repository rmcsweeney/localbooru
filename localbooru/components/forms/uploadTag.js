export default function UploadTag() {
    const baseUrl = "http://localhost:8080/";

    const uploadTag = async(formData) => {

        try {
            const res = await fetch(baseUrl + `upload/tag`, {
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
        <form action={uploadTag} encType={"multipart/form-data"} method="post">
            <label>Input a tag:</label>
            <input type="text" name="tag" placeholder={"Enter tag..."}/>
            <select id={"type"} defaultValue={"basic"} name={"type"}>
                <option value={"basic"} title={"Tags that don't fall into a specific category, i.e. red_scarf"}>basic</option>
                <option value={"copyright"} title={"Tags that describe the franchise, series, etc. a post is from, i.e. nintendo"}>copyright</option>
                <option value={"character"} title={"Tags for character names, i.e. ouro_kronii"}>character</option>
                <option value={"artist"} title={"Artist name, i.e. riyo"}>artist</option>
                <option value={"meta"} types={"Tags for non-content info, i.e. highres, has_sound"}>meta</option>
            </select>
            <button type="submit">Add tag</button>
        </form>
    </>
}