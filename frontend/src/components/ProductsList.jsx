import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash, Star, Edit2 } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import ProductForm from "./ProductForm";
import DeleleConfirmModal from "./DeleleConfirmModal";

const ProductsList = () => {
	const { fetchAllProducts, deleteProduct, toggleFeaturedProduct, products, loading } = useProductStore();

	const [isShowProductModal, setIsShowProductModal] = useState(false);
	const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const handleEditProduct = (product) => {
		setSelectedProduct(product);
		setIsShowProductModal(true);
	}

	const handleDeleteProduct = (product) => {
		setSelectedProduct(product);
		setIsShowDeleteModal(true);
	}

	const onDeleteProduct = async () => {
		await deleteProduct(selectedProduct._id);
		setIsShowDeleteModal(false);
	}

	const groupedProducts = useMemo(() => {
		if (!products) return {};

		return products.reduce((acc, product) => {
			const category = product.category.name;
			if (!acc[category]) {
				acc[category] = [];
			}

			acc[category].push(product);
			return acc;
		}, {})
	}, [products]);

	useEffect(() => {
		fetchAllProducts();
	}, [])

	return (
		<>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Product
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Price
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Category
							</th>

							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Featured
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{
							groupedProducts && Object.entries(groupedProducts).map(([category, products]) => (
								products?.map((product) => (
									<tr key={product._id} className='hover:bg-gray-700'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<img
														className='h-10 w-10 rounded-full object-cover'
														src={product.image}
														alt={product.name}
														loading="lazy"
													/>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-white'>{product.name}</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-300'>{product.category?.name}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<button
												onClick={() => toggleFeaturedProduct(product._id)}
												className={`cursor-pointer p-1 rounded-full hover:bg-yellow-500 transition-colors duration-200 ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} `}
											>
												<Star className='h-5 w-5' />
											</button>
										</td>
										<td className='px-6 py-4 flex gap-2 whitespace-nowrap'>
											<button onClick={() => handleDeleteProduct(product)} className="p-2 border-2 border-red-400 rounded-full hover:opacity-70 transition-opacity duration-200">
												<Trash className='h-4 w-4 cursor-pointer text-red-500' />
											</button>

											<button onClick={() => handleEditProduct(product)} className="p-2 border-2 border-blue-400 rounded-full hover:opacity-70 transition-opacity duration-200">
												<Edit2 className='h-4 w-4 cursor-pointer text-blue-500' />
											</button>
										</td>
									</tr>
								))
							))
						}
					</tbody>
				</table>
			</motion.div>

			{
				isShowProductModal && (
					<div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50" onClick={() => setIsShowProductModal(false)}>
						<div onClick={(e) => e.stopPropagation()}>
							<ProductForm product={selectedProduct} type="edit" setIsProductModal={setIsShowProductModal} />
						</div>
					</div>
				)
			}

			{
				isShowDeleteModal && (
					<DeleleConfirmModal name={selectedProduct?.name} onDelete={onDeleteProduct} loading={loading} setIsClose={setIsShowDeleteModal} />
				)
			}
		</>
	);
};

export default ProductsList;