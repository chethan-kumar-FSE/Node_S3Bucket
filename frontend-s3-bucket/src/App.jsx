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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)", // Gradient background for aesthetic effect
          padding: "0 2em",
        }}
      >
        {/* Upload Section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            padding: "2em",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            marginRight: "2em",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5em",
              width: "100%",
              maxWidth: "400px",
            }}
            onSubmit={handleOnSubmit}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "1.8em",
                color: "#333",
                marginBottom: "1em",
              }}
            >
              Upload Your Image
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
              name="image"
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1.1em",
                transition: "border-color 0.3s ease",
              }}
            />
            <input
              type="text"
              placeholder="Enter caption"
              name="caption"
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1.1em",
                transition: "border-color 0.3s ease",
              }}
            />
            <input
              type="submit"
              value="Submit"
              style={{
                padding: "12px",
                background: "#2575fc",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.1em",
                transition: "background 0.3s ease, transform 0.3s ease",
              }}
            />
          </form>
        </div>

        {/* Images Section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5em",
            padding: "2em",
            background: "#f8f8f8",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            overflowY: "auto", // Scroll if there are many images
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "1.8em",
              color: "#333",
              marginBottom: "1em",
            }}
          >
            Uploaded Images
          </h2>

          {blogImages.map((bImg) => (
            <div
              key={bImg.imageUrl}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1em",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={bImg.postUrl}
                width={120}
                height={120}
                alt="Uploaded"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                }}
              />
              <button
                onClick={() => handleOnDelete(bImg.imageUrl)}
                style={{
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1em",
                  transition: "background 0.3s ease, transform 0.3s ease",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
