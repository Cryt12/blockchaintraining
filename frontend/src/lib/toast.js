import Swal from 'sweetalert2';

// Small toast in the corner for non-blocking feedback.
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2600,
  timerProgressBar: true,
});

export function toastSuccess(title) {
  return Toast.fire({ icon: 'success', title });
}

export function toastError(title) {
  return Toast.fire({ icon: 'error', title });
}

export function toastInfo(title) {
  return Toast.fire({ icon: 'info', title });
}

// Confirmation dialog; resolves to true if the user confirms.
export async function confirmAction({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Confirm',
  icon = 'warning',
} = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#64748b',
  });
  return result.isConfirmed;
}
