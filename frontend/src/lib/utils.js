/**
 * Get "time ago" text
 * @param {number} time Time in milliseconds
 * @returns {string}
 */
function getTimeAgoText(time) {
  if (time == null) {
    return i18n('NEVER');
  }

  const diff = Date.now() - time;
  const hours = diff / Date.HOUR;
  const days = diff / Date.DAY;
  let timeStr;

  if (diff < Date.MINUTE) {
    timeStr = i18n('MOMENT');
  } else if (hours < 1) {
    timeStr = i18n('MINUTES_N', Math.floor(diff / Date.MINUTE));
  } else if (days < 1) {
    timeStr = i18n('HOURS_N', Math.floor(hours));
  } else if (days == 1) {
    timeStr = i18n('YESTERDAY');
  } else if (days == 2) {
    timeStr = i18n('DAY_BEFORE_YESTERDAY');
  } else if (days < 7) {
    timeStr = i18n('DAYS_N', Math.floor(days));
  } else if (days < 30) {
    timeStr = i18n('WEEKS_N', Math.floor(days / 7));
  } else if (days < 365) {
    timeStr = i18n('MONTHS_N', Math.floor(days / 30));
  } else {
    timeStr = i18n('YEARS_N', Math.floor(days / 365));
  }

  return i18n('TIME_AGO', { timeStr });
}

export {
  getTimeAgoText
};
