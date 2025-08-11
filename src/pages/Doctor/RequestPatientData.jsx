import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider,
  Chip
} from "@mui/material";
import {
  HelpOutline as HelpOutlineIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  LocalHospital as LocalHospitalIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import { submitPatientRequest, getPatientRecords } from "../../services/api";
import "./RequestPatientData.scss";

const RequestPatientData = () => {
  const [form, setForm] = useState({
    doctorId: "DoctorK20",
    doctorName: "Kshitij Ghodekar",
    patientIdsInput: "",
    purpose: "",
    hospitalName: "Ireland Hospital",
  });
  const [loading, setLoading] = useState(false);
  const [checkingIds, setCheckingIds] = useState(false);
  const [patientIdError, setPatientIdError] = useState(false);
  const [purposeError, setPurposeError] = useState(false);
  const [invalidPatientIds, setInvalidPatientIds] = useState([]);
  const [alreadyRequestedIds, setAlreadyRequestedIds] = useState([]);
  const [existingRequests, setExistingRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    type: "success" 
  });

  const PATIENT_ID_REGEX = /^P\d{3}$/; // e.g., P001

  // Load existing requests
  useEffect(() => {
    const fetchExistingRequests = async () => {
      try {
        const response = await getPatientRecords();
        console.log("Existing requests response:", response.data);
        setExistingRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching existing requests:", error);
      }
    };
    fetchExistingRequests();
  }, []);

  // Validate patient IDs dynamically
  useEffect(() => {
    const timer = setTimeout(async () => {
      const ids = form.patientIdsInput
        .split(",")
        .map(id => id.trim())
        .filter(id => id !== "");

      if (ids.length > 0) {
        setCheckingIds(true);

        try {
          const response = await getPatientRecords();
          console.log("Checking patient IDs response:", response.data);

          const existingIds = [
            ...new Set(response.data.map((patient) => patient.patientId.trim()))
          ];

          const invalidFormatIds = ids.filter((id) => !PATIENT_ID_REGEX.test(id));
          const alreadyRequested = ids.filter((id) => existingIds.includes(id));

          setInvalidPatientIds(invalidFormatIds);
          setAlreadyRequestedIds(alreadyRequested);
        } catch (error) {
          console.error("Error checking patient IDs:", error);
          setInvalidPatientIds([]);
          setAlreadyRequestedIds([]);
        } finally {
          setCheckingIds(false);
        }
      } else {
        setInvalidPatientIds([]);
        setAlreadyRequestedIds([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.patientIdsInput]);

  const validatePatientIds = (ids) => {
    const idArray = ids
      .split(",")
      .map(id => id.trim())
      .filter(id => id !== "");
    return idArray.length > 0 && idArray.every(id => PATIENT_ID_REGEX.test(id));
  };

  const checkForDuplicateRequest = (patientIdsArray) => {
    return existingRequests.some(request => 
      Array.isArray(request.patientIds) &&
      request.patientIds.length === patientIdsArray.length &&
      request.patientIds.every(id => patientIdsArray.includes(id))
    );
  };

  const handleSubmit = async () => {
    const patientIdsValid = validatePatientIds(form.patientIdsInput);
    const purposeValid = form.purpose.trim().length > 0;

    setPatientIdError(!patientIdsValid);
    setPurposeError(!purposeValid);

    if (!patientIdsValid || !purposeValid) {
      return setSnackbar({
        open: true,
        message: "Please enter valid patient IDs and purpose.",
        type: "error",
      });
    }

    if (invalidPatientIds.length > 0) {
      return setSnackbar({
        open: true,
        message: `Some patient IDs are invalid: ${invalidPatientIds.join(", ")}`,
        type: "error",
      });
    }

    if (alreadyRequestedIds.length > 0) {
      return setSnackbar({
        open: true,
        message: `Already requested IDs: ${alreadyRequestedIds.join(", ")}`,
        type: "error",
      });
    }

    const patientIdsArray = form.patientIdsInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");

    if (checkForDuplicateRequest(patientIdsArray)) {
      return setSnackbar({
        open: true,
        message: "A request with these exact patient IDs already exists.",
        type: "error",
      });
    }

    const payload = {
      doctorId: form.doctorId,
      doctorName: form.doctorName,
      patientIds: patientIdsArray,
      purpose: form.purpose,
      hospitalName: form.hospitalName
    };

    try {
      setLoading(true);
      const response = await submitPatientRequest(payload);

      // 🔹 Debug logs
      console.log("Full backend response:", response);
      console.log("Response data:", response.data);

      // Handle string or JSON response
      // let serverMessage = "";
      let requestId = `REQ-${Date.now()}`; // fallback
      let responseData = response.data;

      if (typeof responseData === "string") {
        // serverMessage = responseData;
      } else if (typeof responseData === "object" && responseData !== null) {
        // serverMessage = responseData.message || "Request submitted successfully!";
        requestId = responseData.requestId || requestId;
      }

      setSnackbar({
        open: true,
        message: response,
        type: "success",
      });

      // Always add a normalized object to existingRequests
      const newRequest = { ...payload, requestId };
      setExistingRequests(prev => [...prev, newRequest]);

      // Reset form
      setForm({ ...form, patientIdsInput: "", purpose: "" });
      setInvalidPatientIds([]);
      setAlreadyRequestedIds([]);
    } catch (error) {
      console.error("Error submitting request:", error);
      console.error("Error response details:", error.response?.data);

      const errorMessage = error.response?.data?.message || "Failed to submit request";
      setSnackbar({
        open: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPatientCountStatus = () => {
    const allIds = form.patientIdsInput.split(",").map(id => id.trim()).filter(Boolean);
    const validCount = allIds.filter(id => PATIENT_ID_REGEX.test(id)).length;
    
    if (checkingIds) {
      return {
        icon: <CircularProgress size={16} />,
        label: "Checking IDs...",
        color: "default"
      };
    }
    
    if (invalidPatientIds.length > 0 || alreadyRequestedIds.length > 0) {
      return {
        icon: <WarningIcon color="warning" />,
        label: `${validCount} valid / ${invalidPatientIds.length} invalid`,
        color: "warning"
      };
    }
    
    return {
      icon: <CheckCircleIcon />,
      label: `${validCount} patients selected`,
      color: "success"
    };
  };

  return (
    <div className="request-patient-container">
      <div className="request-form-wrapper">
        <Typography variant="h4" component="h1" className="form-title">
          Request Patient Data
        </Typography>

        <Divider className="form-divider" />

        <div className="form-fields-container">

          {/* Doctor Info */}
          <TextField
            label="Doctor ID"
            fullWidth
            disabled
            margin="normal"
            value={form.doctorId}
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon className="field-icon" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Doctor Name"
            fullWidth
            disabled
            margin="normal"
            value={form.doctorName}
            className="form-field"
          />

          {/* Patient IDs */}
          <TextField
            label="Patient IDs"
            fullWidth
            value={form.patientIdsInput}
            onChange={(e) => {
              setForm({ ...form, patientIdsInput: e.target.value });
              setPatientIdError(false);
            }}
            margin="normal"
            placeholder="e.g. P001, P002, P003"
            error={patientIdError || invalidPatientIds.length > 0 || alreadyRequestedIds.length > 0}
            helperText={
              patientIdError 
                ? "Enter valid comma-separated patient IDs like P001"
                : invalidPatientIds.length > 0
                  ? `Invalid format IDs: ${invalidPatientIds.join(", ")}`
                  : alreadyRequestedIds.length > 0
                    ? `Patients Data Already Present: ${alreadyRequestedIds.join(", ")}`
                    : ""
            }
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon className="field-icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <Tooltip title="Enter comma-separated patient IDs like P001" placement="top" arrow>
                  <IconButton>
                    <HelpOutlineIcon className="help-icon" />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />

          {form.patientIdsInput && !patientIdError && (
            <div className="patient-count-chip">
              <Chip
                icon={getPatientCountStatus().icon}
                label={getPatientCountStatus().label}
                color={getPatientCountStatus().color}
                size="small"
                variant="outlined"
              />
            </div>
          )}

          <TextField
            label="Purpose"
            fullWidth
            value={form.purpose}
            onChange={(e) => {
              setForm({ ...form, purpose: e.target.value });
              setPurposeError(false);
            }}
            margin="normal"
            placeholder="Describe the purpose of this request..."
            multiline
            error={purposeError}
            helperText={purposeError ? "Purpose is required" : ""}
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon className="field-icon" />
                </InputAdornment>
              ),
            }}
          />

          {/* Hospital */}
          <TextField
            label="Hospital Name"
            fullWidth
            disabled
            margin="normal"
            value={form.hospitalName}
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalHospitalIcon className="field-icon" />
                </InputAdornment>
              ),
            }}
          />

          {/* Submit */}
          <div className="submit-button-container">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                loading || checkingIds || invalidPatientIds.length > 0 || alreadyRequestedIds.length > 0
              }
              size="large"
              className="submit-button"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Processing..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        className="snackbar-notification"
      >
        <Alert 
          severity={snackbar.type} 
          className="snackbar-alert"
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            warning: <WarningIcon fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RequestPatientData;
