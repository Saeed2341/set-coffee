import swal from "sweetalert";

export const showSwal = (title, icon, buttons) => {
  return swal({ title, icon, buttons });
};
