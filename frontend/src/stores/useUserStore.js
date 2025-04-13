import { create } from 'zustand';
import axios from "../libs/axios"
import { toast } from 'react-hot-toast';

const useUserStore = create((set) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if(confirmPassword !== password) {
            set({ loading: false });
            return toast.error('Passwords do not match');
        }

        try {
            const res = await axios.post('/auth/signup', {
                name, email, password, confirmPassword
            });


            set({ user: res.data.user, loading: false });
            toast.success("Account created successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "An error occurred");
        }
    },
    login: async ({ email, password }) => {
        set({ loading: true });

        try {
            const res = await axios.post('/auth/login', {
                email, password
            });


            set({ user: res.data.user, loading: false });
            toast.success("Login successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "An error occurred");
        }
    },
    logout: async () => {
        set({ loading: true });

        try {
            await axios.post('/auth/logout');
            set({ user: null, loading: false });
            toast.success("Logged out successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "An error occurred");
        }
    },
    checkAuth: async () => {
        try {
            const res = await axios.get('/auth/profile');
            set({ user: res.data.user, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
        }
    },
    refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default useUserStore;