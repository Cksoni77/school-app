export function mapTimetable(data) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const periodsMap = {};

  data.forEach(slot => {
    const timeKey = `${slot.startTime}-${slot.endTime}`;

    if (!periodsMap[timeKey]) {
      periodsMap[timeKey] = {
        time: `${slot.startTime}\n${slot.endTime}`,
        slots: new Array(6).fill({ label: "", room: "", cls: "tt-empty" })
      };
    }

    const dayIndex = days.indexOf(slot.dayOfWeek);

    periodsMap[timeKey].slots[dayIndex] = {
      label: slot.subject,
      room: slot.roomName || "",
      cls: getSubjectClass(slot.subject)
    };
  });

  return {
    days: ["Mon","Tue","Wed","Thu","Fri","Sat"],
    periods: Object.values(periodsMap)
  };
}

/* subject → color class */
function getSubjectClass(subject) {
  if (!subject) return "tt-empty";

  const s = subject.toLowerCase();

  if (s.includes("math")) return "tt-math";
  if (s.includes("science")) return "tt-sci";
  if (s.includes("english")) return "tt-eng";
  if (s.includes("social")) return "tt-soc";
  if (s.includes("computer")) return "tt-comp";
  if (s.includes("physics")) return "tt-phys";
  if (s.includes("art")) return "tt-art";

  return "tt-empty";
}