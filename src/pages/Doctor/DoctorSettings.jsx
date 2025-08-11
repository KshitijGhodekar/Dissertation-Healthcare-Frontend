import React, { useState } from "react";
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import "./DoctorSettings.scss";

const DoctorSettings = () => {
  const [profile, setProfile] = useState({
    name: "Dr. Kshitij Ghodekar",
    email: "kshitij.ghodekar@hospital.com",
    phone: "+353 123 4567",
    hospital: "Ireland Central Hospital",
    specialization: "Cardiology",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    patientReceived: true,
    requestStatus: true,
    pdfReports: true,
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleSaveNotifications = () => {
    alert("Notification preferences updated!");
  };

  return (
    <div className="doctorSettingsContainer">
      <Typography variant="h4" className="settingsTitle">
        Doctor Settings
      </Typography>

      {/* Profile Section */}
      <Paper className="settingsCard">
        <Typography variant="h6" className="sectionTitle">
          Profile Information
        </Typography>
        <Divider className="divider" />
        <div className="formGroup">
          <TextField
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            label="Hospital"
            name="hospital"
            value={profile.hospital}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            label="Specialization"
            name="specialization"
            value={profile.specialization}
            onChange={handleProfileChange}
            fullWidth
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleSaveProfile}>
          Save Profile
        </Button>
      </Paper>

      {/* Password Section */}
      <Paper className="settingsCard">
        <Typography variant="h6" className="sectionTitle">
          Change Password
        </Typography>
        <Divider className="divider" />
        <div className="formGroup">
          <TextField
            label="Current Password"
            type="password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            fullWidth
          />
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </Paper>

      {/* Notification Section */}
      <Paper className="settingsCard">
        <Typography variant="h6" className="sectionTitle">
          Notification Preferences
        </Typography>
        <Divider className="divider" />
        <div className="switchGroup">
          <FormControlLabel
            control={
              <Switch
                checked={notifications.patientReceived}
                onChange={handleNotificationChange}
                name="patientReceived"
              />
            }
            label="Notify me when patient records are received"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications.requestStatus}
                onChange={handleNotificationChange}
                name="requestStatus"
              />
            }
            label="Notify me when requests are approved/rejected"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications.pdfReports}
                onChange={handleNotificationChange}
                name="pdfReports"
              />
            }
            label="Notify me when PDF reports are sent"
          />
        </div>
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveNotifications}
        >
          Save Preferences
        </Button>
      </Paper>
    </div>
  );
};

export default DoctorSettings;
