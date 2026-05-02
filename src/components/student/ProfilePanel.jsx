import { useEffect, useState } from "react";
import { mappedData } from "./utils/mapProfile";

function ProfilePanel({ onClose }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setProfile(mappedData(data)));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return <div>{profile.name}</div>;
}

export default ProfilePanel;