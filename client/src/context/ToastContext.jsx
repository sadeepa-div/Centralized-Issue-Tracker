import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (
    message,
    type = "success"
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({
      message,
      type,
    });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast(null);
  };

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
      {children}

      {toast && (
        <div
          className={`global-toast toast-${toast.type}`}
        >
          <div>
            <strong>
              {toast.type === "success"
                ? "Success"
                : toast.type === "error"
                ? "Error"
                : "Information"}
            </strong>

            <p>{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={closeToast}
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}