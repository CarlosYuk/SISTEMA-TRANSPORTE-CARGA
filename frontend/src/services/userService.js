import axios from "./axiosConfig";

const API_URL = "/api/users";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const userService = {
  getAllUsers: async (token) => {
    try {
      const response = await axios.get(API_URL, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  getUserById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  createUser: async (userData, token) => {
    try {
      const response = await axios.post(API_URL, userData, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUser: async (id, userData, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        userData,
        authHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id, token) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        authHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  getAllRoles: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/roles`, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};

export default userService;
