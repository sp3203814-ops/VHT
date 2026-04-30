import React, { useEffect, useState } from "react";
import { Users, BookOpen, Mail, UserCheck, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    tutors: [],
    enquiries: [],
    contacts: [],
  });
   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // agar login nahi hai ya admin nahi hai
      if (!userInfo || !userInfo.isAdmin) {
        navigate("/");
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const result = await res.json();

      setData({
        users: result.users || [],
        tutors: result.tutors || [],
        enquiries: result.enquiries || [],
        contacts: result.contacts || [],
      });
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [navigate]);

  const handleEdit = (id, type) => {
    alert(`Edit ${type} with ID: ${id}`);
  };

  const handleDelete = (id, type) => {
    alert(`Delete ${type} with ID: ${id}`);
  };

  const stats = [
    {
      title: "Users",
      count: data.users.length,
      icon: <Users size={28} />,
    },
    {
      title: "Tutors",
      count: data.tutors.length,
      icon: <UserCheck size={28} />,
    },
    {
      title: "Enquiries",
      count: data.enquiries.length,
      icon: <BookOpen size={28} />,
    },
    {
      title: "Contacts",
      count: data.contacts.length,
      icon: <Mail size={28} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-base-100 rounded-2xl shadow-lg p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-sm opacity-70">{item.title}</p>
                <h2 className="text-3xl font-bold">{item.count}</h2>
              </div>
              <div>{item.icon}</div>
            </div>
          ))}
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tutor Applications</h2>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.tutors.map((tutor) => (
                <tr key={tutor._id}>
                  <td>{tutor.name}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.subject}</td>

                  <td>
  <a
    href={tutor.resume}
    target="_blank"
    rel="noreferrer"
    className="btn btn-sm"
  >
    View File
  </a>
</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tutor._id, "Tutor")}
                      className="btn btn-sm btn-primary"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(tutor._id, "Tutor")}
                      className="btn btn-sm btn-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto mb-8">
  <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>

  <table className="table w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Attachment</th>
      </tr>
    </thead>

    <tbody>
      {data.enquiries.map((item) => (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.role}</td>

          <td>
            {item.attachment ? (
              <a
                href={item.attachment}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm"
              >
                View File
              </a>
            ) : (
              "No File"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <div className="bg-base-100 rounded-2xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
