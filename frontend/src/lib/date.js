export const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

const DAY_NAMES_LONG = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const MONTH_NAMES_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const MONTH_NAMES_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export const formatDateShort = (date) => {
  const d = new Date(date);
  return `${DAY_NAMES_SHORT[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_NAMES_SHORT[d.getUTCMonth()]}`;
};

export const formatDateLong = (date) => {
  const d = new Date(date);
  return `${DAY_NAMES_LONG[d.getDay()]} ${d.getDate()} de ${MONTH_NAMES_LONG[d.getMonth()]}`;
};

export const getDayShort = (date) => DAY_NAMES_SHORT[new Date(date).getUTCDay()];

export const getToday = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const getTodayISO = () => getToday().toISOString();

export const getLast7Days = () => {
  const today = getToday();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    days.push({
      date: d,
      short: DAY_NAMES_SHORT[d.getUTCDay()],
      long: formatDateShort(d),
    });
  }
  return days;
};
