import { toast as hotToast } from 'react-hot-toast';
export const useToast = () => ({
    success: (message) => hotToast.success(message),
    error: (message) => hotToast.error(message),
    loading: (message) => hotToast.loading(message),
});
