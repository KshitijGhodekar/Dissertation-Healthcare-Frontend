import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Search, Close, CheckCircle, Cancel, Info } from "@mui/icons-material";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AccessLogs.scss";
import { getAccessLogs, getAccessLogsAnalytics } from "../../services/api";

const COLORS = ["#4caf50", "#f44336"];

const AccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await getAccessLogs();
        const formattedLogs = response.data?.logs?.map((log) => ({
          ...log,
          formattedTimestamp: format(new Date(log.timestamp), "PPpp"),
          status: log.accessGranted ? "granted" : "denied",
        }));
        setLogs(formattedLogs);
      } catch (error) {
        console.error("Error fetching access logs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        setLoadingCharts(true);
        const response = await getAccessLogsAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching access logs analytics:", error);
      } finally {
        setLoadingCharts(false);
      }
    };

    fetchLogs();
    fetchAnalytics();
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const filteredLogs = logs.filter((log) =>
    Object.values(log).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  const pieData = analytics.accessDistribution
    ? [
        {
          name: "Granted",
          value:
            analytics.accessDistribution.find((d) => d.name === "granted")
              ?.value || 0,
        },
        {
          name: "Denied",
          value:
            analytics.accessDistribution.find((d) => d.name === "denied")
              ?.value || 0,
        },
      ]
    : [];

  return (
    <Box className="access-logs-container">
      <Typography variant="h4" style={{ color: "black" }} gutterBottom>
        Access Logs
      </Typography>

      {/* Search Bar */}
      <Paper elevation={3} className="search-container">
        <TextField
          fullWidth
          style={{ background: "white" }}
          variant="outlined"
          placeholder="Search logs..."
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchText("")}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Table Section */}
      <div className="tableWrapper">
        <Paper className="tableSection" elevation={2}>
          <div className="tableScrollContainer">
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <table className="styledTable">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Doctor</th>
                      <th>Patient ID</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.formattedTimestamp}</td>
                        <td>
                          <Box>
                            <Typography fontWeight="medium">
                              {log.doctorName || "Unknown"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {log.doctorId}
                            </Typography>
                          </Box>
                        </td>
                        <td>{log.patientId}</td>
                        <td>{log.purpose || "N/A"}</td>
                        <td>
                          <Chip
                            label={log.status}
                            color={
                              log.status === "granted" ? "success" : "error"
                            }
                            icon={
                              log.status === "granted" ? (
                                <CheckCircle />
                              ) : (
                                <Cancel />
                              )
                            }
                            size="small"
                          />
                        </td>
                        <td>
                          <IconButton
                            onClick={() => {
                              setSelectedLog(log);
                              setOpenDialog(true);
                            }}
                            color="primary"
                            size="small"
                          >
                            <Info />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  component="div"
                  count={filteredLogs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </div>
        </Paper>
      </div>

      {/* Charts Section */}
      <Box className="charts-container">
        {loadingCharts ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Time Series Chart */}
            <Paper className="chart-card" elevation={3}>
              <Typography variant="h6" gutterBottom>
                Access Logs Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.timeSeries || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="granted"
                    stroke="#4caf50"
                    name="Granted"
                  />
                  <Line
                    type="monotone"
                    dataKey="denied"
                    stroke="#f44336"
                    name="Denied"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            {/* Pie Chart */}
            <Paper className="chart-card" elevation={3}>
              <Typography variant="h6" gutterBottom>
                Access Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </>
        )}
      </Box>

      {/* Transaction Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Access Details
          <Typography variant="subtitle2" color="textSecondary">
            {selectedLog?.doctorName} ({selectedLog?.doctorId})
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Box className="transaction-details">
              <Typography variant="body1">
                <strong>Patient ID:</strong> {selectedLog.patientId}
              </Typography>
              <Typography variant="body1">
                <strong>Purpose:</strong> {selectedLog.purpose || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedLog.status}
              </Typography>
              <Typography variant="body1">
                <strong>Timestamp:</strong> {selectedLog.formattedTimestamp}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccessLogs;
