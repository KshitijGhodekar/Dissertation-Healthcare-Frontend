import React, { useEffect, useState } from "react";
import "./PatientRecords.scss";
import {
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from "@mui/material";
import {
  Download,
  Search,
  FilterList,
  PictureAsPdf,
  Refresh,
} from "@mui/icons-material";
import { getPatientRecords, downloadPatientPdf } from "../../services/api";

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const filtered = records.filter((record) =>
      Object.values(record).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);


  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await getPatientRecords();
      const mappedData = response.data.map((patient) => ({
        id: patient.id,
        requestId: patient.requestId,
        patientId: patient.patientId,
        name: patient.name || "Unknown",
        age: patient.age ?? "-",
        gender: patient.gender ?? "-",
        condition: patient.medicalCondition ?? "-",
        diagnosis: patient.testResults ?? "-",
        bloodType: patient.bloodType || "Unknown",
        medication: patient.medication || "Not specified",
        pdfReport: patient.pdfReport,
        lastUpdated: patient.updatedAt || new Date().toISOString(),
      }));
      setRecords(mappedData);
      setFilteredRecords(mappedData);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to fetch patient records", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (record) => {
    if (!record.pdfReport) return;

    try {
      const response = await downloadPatientPdf(record.patientId);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${record.name.replace(/\s+/g, "_")}_${
        record.patientId
      }_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="patientRecordsContainer">
      <div className="headerSection">
        <Typography variant="h5" className="title">
          Patient Records
        </Typography>
        <div className="lastUpdated">
          Last refreshed: {formatDate(lastRefreshed)}
          <Button
            startIcon={<Refresh />}
            onClick={fetchRecords}
            size="small"
            sx={{ ml: 1 }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="controlsSection">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search records by name, ID, or condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
        <Button startIcon={<FilterList />} variant="outlined" sx={{ ml: 2 }}>
          Filters
        </Button>
      </div>

      {loading ? (
        <div className="loadingState">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading patient records...
          </Typography>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="emptyState">
          <PictureAsPdf sx={{ fontSize: 80, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {searchTerm
              ? "No matching records found"
              : "No patient records available"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? "Try a different search term"
              : "New records will appear here when available"}
          </Typography>
        </div>
      ) : isMobile ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filteredRecords.map((record) => (
            <Grid item xs={12} key={`${record.patientId}-${record.requestId}`}>
              <Card className="recordCard" elevation={2}>
                <CardContent>
                  <div className="cardHeader">
                    <Typography variant="subtitle1" fontWeight="600">
                      {record.name}
                    </Typography>
                    <Chip
                      label={record.bloodType}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </div>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>ID:</strong> {record.patientId}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Condition:</strong> {record.condition}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Medication:</strong> {record.medication}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Diagnosis:</strong>{" "}
                    {record.diagnosis || "Not available"}
                  </Typography>
                  <div className="cardFooter">
                    <Tooltip
                      title={
                        record.pdfReport
                          ? "Download PDF report"
                          : "PDF not available"
                      }
                    >
                      <span>
                        <IconButton
                          onClick={() => handleDownload(record)}
                          disabled={!record.pdfReport}
                          color="primary"
                          size="small"
                        >
                          <Download />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="tableWrapper">
          <Paper className="tableSection" elevation={2}>
            <div className="tableScrollContainer">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Blood Type</th>
                    <th>Condition</th>
                    <th>Diagnosis</th>
                    <th>Medication</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={`${record.patientId}-${record.requestId}`}>
                      <td>
                        <Typography fontWeight="500">{record.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {record.gender}
                        </Typography>
                      </td>
                      <td>{record.patientId}</td>
                      <td>{record.age}</td>
                      <td>
                        <Chip
                          label={record.bloodType}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </td>
                      <td>{record.condition}</td>
                      <td>{record.diagnosis || "-"}</td>
                      <td>{record.medication}</td>
                      <td>
                        <Tooltip
                          title={
                            record.pdfReport
                              ? "Download PDF report"
                              : "PDF not available"
                          }
                        >
                          <span>
                            <IconButton
                              onClick={() => handleDownload(record)}
                              disabled={!record.pdfReport}
                              color="primary"
                              size="small"
                            >
                              <Download />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
