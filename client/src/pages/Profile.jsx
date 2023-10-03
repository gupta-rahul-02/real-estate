import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firbase";
import {updateFailure,updateStart,updateSuceess} from '../redux/user/userSlice.js' 
import {useDispatch} from 'react-redux'

function Profile() {
  const currentUser = useSelector((store) => store.user.currentUser);
  const {loading,error} = useSelector((store) => store.user)
  const fileRef = useRef(null);
  const dispatch = useDispatch()
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]:e.target.value})
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()

    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateFailure(data.message))
        return
      }
      dispatch(updateSuceess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData?.avatar || currentUser?.avatar }
        ></img>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Image upload error (Image must be less than 2mb)</span>
          ) : fileProgress > 0 && fileProgress < 100 ? (
            <span className="text-slate-700">{`uploading ${fileProgress} %`}</span>
          ) : fileProgress === 100 ? (
            <span className="text-green-700">Imagae Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess? 'User is updated successfully !!!' : ''}</p>
    </div>
  );
}

export default Profile;
