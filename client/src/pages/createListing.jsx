import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const { currentUser } = useSelector((state) => state.user);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listCreated, setListCreated] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      try {
        setUploading(true);
        const urls = await Promise.all(files.map((file) => storeImage(file)));
        console.log(urls);
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls ? [...prev.imageUrls, ...urls] : urls,
        }));
        setImageUploadError(false);
        setUploading(false);
      } catch (err) {
        setImageUploadError("Failed! Max 2 MB per image");
        setUploading(false);
      }
    } else setImageUploadError("You can only upload 6 images per listing");
  };

  useEffect(() => {
    if (listCreated === true)
      setTimeout(() => {
        setListCreated(false);
      }, 5000);
  }, [listCreated]);

  const handleRemoveImage = (idx) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== idx),
    });
  };

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Image upload failed");
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload one image");
      if (Number(formData.regularPrice) < Number(formData.discountPrice))
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.data ? currentUser.data._id : currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) setError(data.message);
      else setListCreated(true);
      navigate(`/listing/${data._id}`);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg focus:outline-none border-none bg-white placeholder-gray-400"
            id="name"
            maxLength="62"
            minLength="5"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none border-none bg-white placeholder-gray-400"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none border-none bg-white placeholder-gray-400"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="100"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="500"
                max="100000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="49"
                  max="100000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleImageSubmit}
              type="button"
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-center">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, idx) => (
              <div
                key={url}
                className="flex justify-between p-3 items-center border"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "CREATING..." : "CREATE"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          {listCreated ? (
            <p className="text-center text-green-700">
              List created successfully
            </p>
          ) : (
            <p></p>
          )}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
