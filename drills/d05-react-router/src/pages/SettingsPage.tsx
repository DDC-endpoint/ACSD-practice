import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSettings } from "../settings";

// TODO d05-4: a settings form. Render <h1>Settings</h1>, a checkbox labelled
//   "Dark mode" (keep its value in useState) and a <button> "Save".
//   When Save is clicked: call saveSettings({ darkMode }), THEN send the user
//   to the home page "/" with useNavigate (no <Link>: this is navigation from code).
export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  function handleSave() {
    saveSettings({ darkMode });
    navigate("/");
  }

  return (
    <section>
      <h1>Settings</h1>
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />{" "}
        Dark mode
      </label>
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </section>
  );
}
