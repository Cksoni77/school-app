export function mappedData(data) {
  return {
    name: data.name || "N/A",
    avatar: data.name
      ? data.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
      : "??",

    rollNo: data.rollNo || "N/A",
    class: data.className || "N/A",

    dob: data.dob || "N/A",
    gender: data.gender || "N/A",
    bloodGroup: data.bloodGroup || "N/A",

    admissionNo: data.admissionNo || "N/A",
    joinDate: data.joiningDate || "N/A",

    email: data.email || "N/A",
    phone: data.phone || "N/A",
    address: data.address || "N/A",

    house: data.house || "N/A",
    sports: data.sportsActivities || "N/A",

    father: {
      name: data.fatherName || "N/A",
      occupation: data.fatherOccupation || "N/A",
      phone: data.emergencyContact || "N/A",
    },

    mother: {
      name: data.motherName || "N/A",
      occupation: data.motherOccupation || "N/A",
      phone: "N/A",
    },

    attendance: data.attendancePercentage || "0%",
    avgScore: data.avgScore || "0",
    rank: data.classRank || "-",

    certificates: data.achievements || [],
  };
}