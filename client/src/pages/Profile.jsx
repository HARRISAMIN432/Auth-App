import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import {
  updateUserFailure,
  updateUserStart,
  updateUsersuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  console.log(currentUser);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileUploadError(null);
    setFileUploadSuccess(false);
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      setFileUploadError("Please select a file to upload");
      return;
    }

    try {
      setFileUploading(true);
      setFileUploadError(null);
      setFileUploadSuccess(false);
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);
      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success === false) {
        setFileUploadError(data.message);
        setFileUploading(false);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        profilePicture: data.url,
      }));
      dispatch(updateUserStart());
      const updateRes = await fetch(
        `/api/user/update/${
          currentUser.data ? currentUser.data._id : currentUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePicture: data.url }),
        }
      );
      const updateData = await updateRes.json();
      if (updateData.success === false) {
        dispatch(updateUserFailure(updateData.message));
        setFileUploadError(updateData.message);
        setFileUploading(false);
        return;
      }
      dispatch(updateUsersuccess(updateData));
      setFileUploadSuccess(true);
      setFile(null);
      fileRef.current.value = null;
      setFileUploading(false);
    } catch (error) {
      setFileUploadError(error.message);
      setFileUploading(false);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `/api/user/delete/${
          currentUser.data ? currentUser.data._id : currentUser._id
        }`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      data.success === false
        ? dispatch(deleteUserFailure(data.message))
        : dispatch(deleteUserSuccess());
    } catch (e) {
      dispatch(deleteUserFailure(e.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
      } else {
        dispatch(signOutSuccess());
      }
    } catch (e) {
      dispatch(signOutFailure(e.message));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `/api/user/update/${
          currentUser.data ? currentUser.data._id : currentUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
      } else {
        dispatch(updateUsersuccess(data));
        setUpdateSuccess(true);
      }
    } catch (e) {
      dispatch(updateUserFailure(e.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            formData.profilePicture ||
            currentUser.profilePicture ||
            currentUser.data.profilePicture ||
            "default-placeholder-image.png"
          }
          alt="Profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <button
          type="button"
          onClick={() => handleFileUpload(file)}
          className="bg-blue-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={fileUploading || !file}
        >
          {fileUploading ? "Uploading..." : "Upload Image"}
        </button>
        <input
          type="text"
          placeholder="username"
          className="focus:outline-none border-none bg-white p-3 rounded-lg placeholder-gray-400"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="focus:outline-none border-none bg-white p-3 rounded-lg placeholder-gray-400"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="focus:outline-none border-none bg-white p-3 rounded-lg placeholder-gray-400"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && (
        <p className="text-red-700 text-center">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
      {updateSuccess && (
        <p className="text-green-700 text-center">User updated successfully</p>
      )}
      {fileUploadError && (
        <p className="text-red-700 text-center">{fileUploadError}</p>
      )}
      {fileUploadSuccess && (
        <p className="text-green-700 text-center">
          Image uploaded successfully
        </p>
      )}
    </div>
  );
}

export default Profile;
