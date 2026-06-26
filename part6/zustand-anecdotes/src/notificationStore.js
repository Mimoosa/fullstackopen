import { create } from "zustand";

const useNotificationStore = create((set) => ({
  message: "",
  isSuccess: false,
  actions: {
    showSuccessMessage: (value) => {
      set({ message: value, isSuccess: true });

      setTimeout(() => {
        set(() => ({ message: "", isSuccess: false }));
      }, 5000);
    },

    showErrorMessage: (value) => {
      set({ message: value, isSuccess: false });

      setTimeout(() => {
        set(() => ({ message: "", isSuccess: false }));
      }, 5000);
    },
  },
}));

export default useNotificationStore;
