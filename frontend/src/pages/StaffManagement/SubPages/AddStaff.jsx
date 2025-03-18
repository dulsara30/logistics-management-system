import React, { useState } from 'react';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const positions = ['Manager', 'Team Lead', 'Senior Manager', 'Associate', 'Intern'];
const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];

function AddStaff() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', { ...formData, profileImage });
    // Reset after submission
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
    });
    setProfileImage(null);
    alert('Staff member added successfully!');
  };

  const navigate = useNavigate(); 

  return (



    <div className="max-w-4xl mx-auto p-6 animate-fade-in">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Staff Member</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Smith"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.smith@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <select
              id="position"
              value={formData.position}
              onChange={(e) => handleSelectChange('position', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Position</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleSelectChange('department', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          {profileImage ? (
            <div className="relative w-32 h-32">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-lg border" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 w-full md:w-64 p-4 hover:border-purple-500 transition-colors cursor-pointer relative">
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center text-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-lg shadow hover:from-purple-600 hover:to-purple-800 transition"
          >
            Add Staff Member
          </button>
        </div>
      </form>
            <div className='p-3'>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 border border-gray-300  text-gray-700  px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
          </div>

    </div>
  );
}

export default AddStaff;
