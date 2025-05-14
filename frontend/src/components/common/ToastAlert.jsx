import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from '../../contexts/DarkModeContext';

export const ToastAlert = () => {
  const { currentTheme } = useDarkMode();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000} 
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        color: currentTheme.toastText,
        backgroundColor: currentTheme.toastBackground,
        fontSize: '0.95rem',
      }}
      toastStyle={{
        backgroundColor: currentTheme.toastBackground,
        color: currentTheme.toastText,
        border: `1px solid ${currentTheme.borderColor}`,
      }}
    />
  );
};

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

