import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../libs/axios";

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    setCategories: (categories) => set({ categories }),
    fetchCategories: async () => {
        set({loading: true});

        try {
            const res = await axios.get("/categories");

            set({ categories: res.data, loading: false });
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.error || "Failed to fetch categories");
        }
    },
    createCategory: async (name, image) => {
        set({ loading: true });

        try {
            const res = await axios.post("/categories", { name, image });

            set((prevState) => ({
                categories: [...prevState.categories, res.data.category],
                loading: false,
            }));

            toast.success(res.data.message);

            return res.data.category;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to create category");
        }
    },
    updateCategory: async (id, name, image) => {
        set({loading: true});

        try {
            const res = await axios.post(`/categories/${id}`, {name, image});
            set((prevState) => ({
                categories: prevState.categories.map((category) =>
                    category._id === id ? res.data.category : category
                ),
                loading: false,
            }));
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.error || "Failed to update category");
        }
    },
    deleteCategory: async (id) => {
        set({loading: true});

        try {
            await axios.delete(`/categories/${id}`);
            set((prevState) => ({
                categories: prevState.categories.filter((category) => category._id !== id),
                loading: false,
            }));
            toast.success("Category deleted successfully");
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.error || "Failed to delete category");
        }
    }
}))