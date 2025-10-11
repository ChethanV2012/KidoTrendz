import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { Upload, Edit, Save, X } from "lucide-react";
import axios from "axios"; // Assuming axios is installed for API calls

const Profile = () => {
  const { user, setUser } = useUserStore(); // Assuming setUser exists to update the store
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePhoto: "",
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        profilePhoto: user.profilePhoto || "",
      });
      setPhotoPreview(user.profilePhoto || null);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
    formDataUpload.append("cloud_name", "your_cloud_name"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your Cloudinary cloud name
        formDataUpload
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.email) {
      alert('Email is required');
      return;
    }

    setLoading(true);
    try {
      let updatedData = { ...formData };
      if (photoFile) {
        const photoUrl = await uploadToCloudinary(photoFile);
        if (photoUrl) {
          updatedData.profilePhoto = photoUrl;
        }
      }

      // API call to update user by email
      const response = await axios.put(`/api/auth/profile`, updatedData); // Updated to /api/auth/profile PUT
      const updatedUser = response.data;

      // Update in store
      setUser(updatedUser); // Use setUser to update the store

      setIsEditing(false);
      if (photoFile) {
        URL.revokeObjectURL(photoPreview); // Clean up preview URL
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPhotoPreview(formData.profilePhoto);
    setPhotoFile(null);
    // Reset form to original values
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      profilePhoto: user.profilePhoto || "",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center sm:text-left">
            My Profile
          </h1>

          {/* Profile Photo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&size=150&background=ddd&color=000`}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <Upload size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name {isEditing ? "*" : ""}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone {isEditing ? "*" : ""}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Email - Read Only */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed text-black"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address {isEditing ? "*" : ""}
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-black ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;