import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTasks = async (statusFilter) => {
  const { data } = await axios.get(`${API_URL}/tasks`, {
    params: { status: statusFilter },
  });
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await axios.post(`${API_URL}/tasks`, taskData);
  return data;
};

export const updateTask = async (taskData) => {
  const { data } = await axios.put(`${API_URL}/tasks/${taskData._id}`, taskData);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await axios.delete(`${API_URL}/tasks/${id}`);
  return data;
};
