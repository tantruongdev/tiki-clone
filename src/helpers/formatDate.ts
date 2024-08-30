import moment from "moment";

export const formatDate = (dateStr?: string) => {
  return moment(dateStr).format('DD/MM/YYYY HH:mm:ss');
}
