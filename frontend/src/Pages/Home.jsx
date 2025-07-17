import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/authContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { token, backendUrl, setToken } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/task/get-all-tasks`, {
        headers: { token },
      });
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Please login first to add task");

    try {
      const url = editTaskId
        ? `${backendUrl}/api/task/update-task/${editTaskId}`
        : `${backendUrl}/api/task/create-task`;
      const method = editTaskId ? "put" : "post";

      const { data } = await axios[method](url, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(`Task ${editTaskId ? "updated" : "added"}`);
        fetchTasks();
        setFormData({ title: "", description: "", dueDate: "", priority: "Low" });
        setEditTaskId(null);
        setShowTaskForm(false);
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
      priority: task.priority,
    });
    setEditTaskId(task._id);
    setShowTaskForm(true);
  };

  const handleDelete = async (id) => {
   
    try {
      const { data } = await axios.delete(`${backendUrl}/api/task/delete-task/${id}`, {
        headers: { token },
      });
      if (data.success) {
        toast.success("Task deleted");
        fetchTasks();
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-200";
      case "Medium":
        return "bg-yellow-200";
      case "Low":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      
      <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">Task Manager</h1>
          <ul className="space-y-2">
            <li className="font-bold text-blue-600">Todo List</li>
          </ul>
        </div>

        <div className="mt-6">
          {!token ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded text-center">
                Login
              </Link>
              <Link to="/register" className="border border-blue-600 text-blue-600 px-4 py-2 rounded text-center">
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setToken(null);
                toast.info("Logged out");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

     
      <main className="flex-1 p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Todo List</h2>
          {token && (
            <button
              onClick={() => {
                setShowTaskForm(!showTaskForm);
                setFormData({ title: "", description: "", dueDate: "", priority: "Low" });
                setEditTaskId(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showTaskForm ? "Close" : "Add Task"}
            </button>
          )}
        </div>

       
        {showTaskForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0"
          >
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="p-2 rounded border flex-1"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-2 rounded border flex-1"
            />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="p-2 rounded border"
            />
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="p-2 rounded border"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editTaskId ? "Update" : "Submit"}
            </button>
          </form>
        )}

        
        <div className="mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-l ${activeTab === "active" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Pending Task
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-r ${activeTab === "completed" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Completed
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.length === 0 && <p>No tasks to display.</p>}
          {tasks
            .filter((task) =>
              activeTab === "active" ? task.status !== "Completed" : task.status === "Completed"
            )
            .map((task) => (
              <div key={task._id} className={`p-4 rounded shadow ${getPriorityColor(task.priority)}`}>
                <h3 className="font-bold text-lg mb-1">{task.title}</h3>
                <p className="text-sm text-gray-700 mb-1">{task.description || "No description"}</p>
                <p className="text-xs text-gray-500 mb-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-400 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
