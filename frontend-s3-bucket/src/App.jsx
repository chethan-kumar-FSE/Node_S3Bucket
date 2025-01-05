import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import "./index.css";
import axios from "axios";
function App() {
  const [img, setImg] = useState(null);
  const [blogImages, setBlogImages] = useState([]);
  const ref = useRef(null);
  async function fetchImages() {
    const response = await axios.get("http://localhost:8080/api/v1/get");
    console.log(response.data);
    setBlogImages(response.data.data);
  }

  useEffect(() => {
    (async () => {
      fetchImages();
    })();
  }, []);
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!img || !ref) {
      return toast("Please insert photo and caption");
    }

    try {
      const formData = new FormData();
      formData.append("image", img);
      formData.append("caption", ref.current.value);

      await axios.post("http://localhost:8080/api/v1/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      e.target.reset();
      fetchImages();
      toast("Photo uploaded to S3 server");
    } catch (err) {
      console.log("err:", err);
    }
  };

  const handleOnDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/delete/${id}`);

      setBlogImages((bImg) => {
        return bImg.filter((img) => img.imageUrl !== id);
      });
      toast("Photo deleted successfully");
    } catch (err) {
      console.log("err:", err);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-r from-[#a18cd1] via-[#fbc2eb] to-[#fbc2eb] p-10 flex justify-center items-center">
        {/* Container */}
        <div className="flex gap-8 w-full max-w-7xl">
          {/* Upload Section */}
          <div className="flex-1 bg-white shadow-xl rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-tr from-purple-400 to-blue-500 rounded-full blur-3xl opacity-50"></div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
              Upload Image
            </h2>
            <form onSubmit={handleOnSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImg(e.target.files[0])}
                  name="image"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Caption
                </label>
                <input
                  ref={ref}
                  type="text"
                  placeholder="Write a caption..."
                  name="caption"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                Upload
              </button>
            </form>
          </div>

          {/* Images Section */}
          <div className="flex-1 bg-gray-100 shadow-xl rounded-3xl p-8 overflow-y-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
              Uploaded Images
            </h2>
            {!blogImages.length && (
              <b className="text-center">No images uploaded</b>
            )}
            <div className="space-y-4">
              {blogImages.map((bImg) => (
                <div
                  key={bImg.imageUrl}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={bImg.postUrl}
                    alt="Uploaded"
                    className="w-24 h-24 rounded-lg object-cover shadow-md"
                  />
                  <p>{bImg.caption}</p>
                  <button
                    onClick={() => handleOnDelete(bImg.imageUrl)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
