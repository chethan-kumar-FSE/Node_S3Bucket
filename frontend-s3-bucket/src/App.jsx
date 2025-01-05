import { useEffect, useRef, useState } from "react";

import "./App.css";
import axios from "axios";
function App() {
  const [img, setImg] = useState("");
  const [blogImages, setBlogImages] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:8080/api/v1/get");
      console.log(response.data);
      setBlogImages(response.data.data);
    })();
  }, []);
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", img);
    formData.append("caption", "somevalue");

    const response = await axios.post(
      "http://localhost:8080/api/v1/post",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("response", response);
  };

  const handleOnDelete = async (id) => {
    const response = await axios.delete(
      `http://localhost:8080/api/v1/delete/${id}`
    );
    console.log(response);
  };
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            overflowX: "hidden",
            background: "rgba(8,8,8,.6)",
            justifyContent: "center",
            alignItems: "center",
            gap: "4em",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1em",
            }}
            onSubmit={handleOnSubmit}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
              name="image"
            />
            <input type="text" placeholder="caption" name="caption" />
            <input type="submit" value={"submit"} />
          </form>

          <div>
            {blogImages.map((bImg) => {
              return (
                <>
                  <img src={bImg.postUrl} width={100} height={100} />
                  <button onClick={() => handleOnDelete(bImg.imageUrl)}>
                    delete
                  </button>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
