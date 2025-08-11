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
  Tooltip,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import {
  Search,
  Close,
  CheckCircle,
  Cancel,
  Info,
  ShowChart,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";
import "./FabricLogs.scss";
import { getFabricLogs, getFabricLogsAnalytics } from "../../services/api";

const FabricLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    timeSeries: [],
    statusDistribution: [],
    doctorActivity: [],
    hourlyActivity: [],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // For hourly chart filtering
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingCharts(true);

        const [logsResponse, analyticsResponse] = await Promise.all([
          getFabricLogs(),
          getFabricLogsAnalytics(),
        ]);

        // Format logs for table
        const formattedLogs = logsResponse.data.map((log) => ({
          ...log,
          id: log.id,
          formattedTimestamp: format(new Date(log.timestamp), "PPpp"),
          doctorInfo: `${log.doctorName} (${log.doctorId})`,
          shortTransactionId:
            log.transactionId?.length > 20
              ? `${log.transactionId.substring(0, 20)}...`
              : log.transactionId,
        }));
        setLogs(formattedLogs);

        // Calculate hourly data if backend did not provide
        const calculateHourlyData = (logs) => {
          const grouped = {};
          logs.forEach((log) => {
            const date = format(new Date(log.timestamp), "yyyy-MM-dd");
            const hour = format(new Date(log.timestamp), "HH:00");
            const key = `${date} ${hour}`;
            if (!grouped[key]) {
              grouped[key] = { hour: key, granted: 0, denied: 0 };
            }
            if (log.status === "granted") grouped[key].granted += 1;
            else grouped[key].denied += 1;
          });
          return Object.values(grouped).sort(
            (a, b) => new Date(a.hour) - new Date(b.hour)
          );
        };

        const hourlyData = analyticsResponse?.data?.hourlyActivity?.length
          ? analyticsResponse.data.hourlyActivity
          : calculateHourlyData(logsResponse.data);

        // Extract unique dates for dropdown
        const dates = [
          ...new Set(hourlyData.map((item) => item.hour.split(" ")[0])),
        ];

        setAnalyticsData({
          ...analyticsResponse?.data,
          hourlyActivity: hourlyData,
        });
        setAvailableDates(dates);
        setSelectedDate(dates[dates.length - 1] || "");
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
        setLoadingCharts(false);
      }
    };

    fetchData();
  }, []);

  // Filter hourly data for selected date
  const filteredHourlyData = analyticsData.hourlyActivity
    .filter((item) => item.hour.startsWith(selectedDate))
    .map((item) => ({
      ...item,
      hourLabel: item.hour.split(" ")[1], // Show only HH:00
    }));

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

  const safeParse = (str) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str || "N/A";
    }
  };

  const DetailItem = ({ label, value }) => (
    <Box className="detail-item">
      <Typography variant="body2" color="textSecondary">
        {label}:
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );

  const TransactionDetails = ({ log, safeParse }) => (
    <>
      <Box className="detail-section">
        <Typography variant="subtitle1" gutterBottom>
          Basic Information
        </Typography>
        <Box className="detail-grid">
          <DetailItem label="Doctor ID" value={log.doctorId} />
          <DetailItem label="Doctor Name" value={log.doctorName} />
          <DetailItem label="Patient ID" value={log.patientId} />
          <DetailItem
            label="Status"
            value={
              <Chip
                label={log.status}
                color={log.status === "granted" ? "success" : "error"}
                size="small"
              />
            }
          />
          <DetailItem
            label="Timestamp"
            value={format(new Date(log.timestamp), "PPpp")}
          />
          <DetailItem label="Block Number" value={log.blockNumber} />
          <DetailItem
            label="Validation Code"
            value={
              <Chip
                label={log.validationCode}
                color={log.validationCode === "VALID" ? "success" : "error"}
                size="small"
              />
            }
          />
        </Box>
      </Box>

      <Box className="detail-section">
        <Typography variant="subtitle1" gutterBottom>
          Input Arguments
        </Typography>
        <Paper elevation={0} className="json-paper">
          <pre>{safeParse(log.inputArgs)}</pre>
        </Paper>
      </Box>

      <Box className="detail-section">
        <Typography variant="subtitle1" gutterBottom>
          Response Payload
        </Typography>
        <Paper elevation={0} className="json-paper">
          <pre>{safeParse(log.responsePayload)}</pre>
        </Paper>
      </Box>

      {log.endorsers && (
        <Box className="detail-section">
          <Typography variant="subtitle1" gutterBottom>
            Endorsers
          </Typography>
          <Paper elevation={0} className="json-paper">
            <pre>{safeParse(log.endorsers)}</pre>
          </Paper>
        </Box>
      )}
    </>
  );

  return (
    <Box className="fabric-logs-container">
      <Typography style={{ color: "black" }} variant="h4" gutterBottom>
        Fabric Transaction Logs
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
                      <th>Status</th>
                      <th>Transaction ID</th>
                      <th>Block #</th>
                      <th>Validation</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <Typography variant="body2">
                            {format(new Date(log.timestamp), "PPpp")}
                          </Typography>
                        </td>
                        <td>
                          <Box>
                            <Typography fontWeight="medium">
                              {log.doctorName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {log.doctorId}
                            </Typography>
                          </Box>
                        </td>
                        <td>{log.patientId}</td>
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
                          <Tooltip title={log.transactionId} placement="top">
                            <Typography variant="body2" noWrap>
                              {log.shortTransactionId}
                            </Typography>
                          </Tooltip>
                        </td>
                        <td>{log.blockNumber}</td>
                        <td>
                          <Chip
                            label={log.validationCode}
                            color={
                              log.validationCode === "VALID"
                                ? "success"
                                : "error"
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
            {/* Request Timeline Chart */}
            <Paper className="TimeLine">
              <Box className="chart-header">
                <ShowChart color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Requests Timeline (Last 7 Days)
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="granted"
                    name="Granted"
                    stroke="#4caf50"
                    fill="#4caf50"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="denied"
                    name="Denied"
                    stroke="#f44336"
                    fill="#f44336"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>

            {/* Hourly Activity Chart with Date Selector */}
            <Paper className="HourlyChart">
              <Box
                className="chart-header"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center">
                  <BarChartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Hourly Request Activity
                  </Typography>
                </Box>

                <TextField
                  select
                  SelectProps={{ native: true }}
                  size="small"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ minWidth: 150 }}
                >
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </TextField>
              </Box>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="hourLabel" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />

                  <Bar
                    dataKey="granted"
                    stackId="requests"
                    name="Granted"
                    fill="#2196f3"
                    stroke="#2196f3"
                    fillOpacity={0.2}
                  />

                  <Bar
                    dataKey="denied"
                    stackId="requests"
                    name="Denied"
                    fill="#f44336"
                    stroke="f44336"
                    fillOpacity={0.2}
                  />
                </BarChart>
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
          Transaction Details
          <Typography variant="subtitle2" color="textSecondary">
            {selectedLog?.transactionId}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Box className="transaction-details">
              <TransactionDetails log={selectedLog} safeParse={safeParse} />
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

export default FabricLogs;
