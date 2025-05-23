import { useSelector } from "react-redux";
import { useRef, useState } from "react";

function Profile() {
  const fileRef = useRef(null);
  const [form, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={currentUser.profilePicture}
          alt="Pic not found"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <input
          type="text"
          placeholder="username"
          className="focus:outline-none border-none bg-white p-3 rounded-lg placeholder-gray-400"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="focus:outline-none border-none bg-white p-3 rounded-lg placeholder-gray-400"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="focus:outline-none border-none bg-white p-3 rounded-lg placeholder-gray-400"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
