import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
const FABRIC_API = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
});

const apiClientFabric = axios.create({
  baseURL: FABRIC_API,
  timeout: 10000,
  withCredentials: true,
});

export const submitPatientRequest = async (payload) => {
  try {
    const response = await apiClient.post("/request", payload);
    return response.data;
  } catch (error) {
    console.error("Error in submitPatientRequest:", error);
    throw error.response?.data?.message || "Failed to submit patient request.";
  }
};

export const getPatientRecords = async () => {
  try {
    return await apiClient.get("/request/records");
  } catch (error) {
    console.error("Error in getPatientRecords:", error);
    throw error.response?.data?.message || "Failed to fetch patient records.";
  }
};

export const downloadPatientPdf = async (requestId) => {
  try {
    const response = await apiClient.get(`/request/records/${requestId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error in downloadPatientPdf:", error);
    throw error.response?.data?.message || "Failed to download patient PDF.";
  }
};

export const getFabricLogs = async (page = 0, size = 50) => {
  try {
    return await apiClientFabric.get(`/fabric-logs`,{
      params: { page, size },
    });
  } catch (error) {
    console.error("Error in getFabricLogs:", error);
    throw error.response?.data?.message || "Failed to fetch patient records.";
  }
}

export const getFabricLogsAnalytics = async () => {
  try {
    return await apiClientFabric.get("/fabric-logs/analytics");
  } catch (error) {
    console.error("Error in getFabricLogs:", error);
    throw error.response?.data?.message || "Failed to fetch patient records.";
  }
}

export const getAccessLogs = async (page = 0, size = 50) => {
  try {
    return await apiClientFabric.get(`/access-logs`, {
      params: { page, size },
    });
  } catch (error) {
    console.error("Error in getAccessLogs:", error);
    throw error.response?.data?.message || "Failed to fetch access logs.";
  }
};

// 2. Get analytics for Access Logs (daily/hourly counts)
export const getAccessLogsAnalytics = async () => {
  try {
    return await apiClientFabric.get("/access-logs/analytics");
  } catch (error) {
    console.error("Error in getAccessLogsAnalytics:", error);
    throw error.response?.data?.message || "Failed to fetch access logs analytics.";
  }
};

// 3. Get details of a specific log by ID
export const getAccessLogDetails = async (logId) => {
  try {
    return await apiClientFabric.get(`/access-logs/${logId}`);
  } catch (error) {
    console.error("Error in getAccessLogDetails:", error);
    throw error.response?.data?.message || "Failed to fetch access log details.";
  }
};

export const getSystemStatus = async () => {
  try {
    const response = await apiClientFabric.get("/system-status");
    return response.data;
  } catch (error) {
    console.error("Error in getSystemStatus:", error);
    throw error.response?.data?.message || "Failed to fetch system status.";
  }
};