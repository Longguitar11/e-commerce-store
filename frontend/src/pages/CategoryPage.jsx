import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ArrowLeftCircleIcon, Backpack } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();

	const { categoryId } = useParams();

	useEffect(() => {
		fetchProductsByCategory(categoryId);
	}, [categoryId]);

	if(loading) return <LoadingSpinner />

	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<ArrowLeftCircleIcon size={50} className="hover:text-emerald-500 transition-colors ease-in-out duration-200 cursor-pointer" onClick={() => window.history.back()} />

				<motion.h1
					className='capitalize text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{products[0]?.category.name}
				</motion.h1>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{!loading && products?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{!loading && products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};
export default CategoryPage;