export const getFiscalQuarter = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";

  const month = date.getMonth();
  const year = date.getFullYear();

  // User logic: FY starts July 1st.
  let fyYear = year;
  let quarter = 0;

  if (month >= 6) {
    fyYear = year;
    quarter = Math.floor((month - 6) / 3) + 1;
  } else {
    fyYear = year - 1;
    quarter = Math.floor((month + 6) / 3) + 1;
  }

  const shortYear = fyYear.toString().slice(-2);
  return `FY${shortYear} Q${quarter}`;
};

export const getRandomColor = (): string => {
  const colors = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-500',
    'bg-orange-500', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500',
    'bg-teal-500', 'bg-violet-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
