import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";

const ProductForm = ({ product, type, setIsProductModal }) => {

	const [newProduct, setNewProduct] = useState({
		name: product?.name || "",
		description: product?.description || "",
		price: product?.price || "",
		category: product?.category._id || "",
		image: product?.image || "",
	});

	const [isCreateNewCategoryModal, setIsCreateNewCategoryModal] = useState(false);
	const [newCategory, setNewCategory] = useState({
		name: "",
		image: ""
	})

	const { createProduct, updateProductById, loading } = useProductStore();
	const { categories, fetchCategories, createCategory, loading: isLoadingCategories } = useCategoryStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (type === "edit") {
			try {
				await updateProductById(product._id, newProduct)
				setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
				setIsProductModal(false);
			} catch (error) {
				console.log("error updating product: ", error)
			}
		}
		else {
			try {
				await createProduct(newProduct);
				setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
			} catch (err) {
				console.log("error creating a product: ", err);
			}
		}
	};

	const onCategorySubmit = async (e) => {
		e.preventDefault();
		try {
			const createdCategory = await createCategory(newCategory.name, newCategory.image);
			setNewCategory({ name: "", image: "" });
			setNewProduct({ ...newProduct, category: createdCategory._id });

			await fetchCategories();
			setIsCreateNewCategoryModal(false);
		} catch (error) {
			console.log("error creating a category: ", error);
		}
	}

	const handleCategoryChange = (e) => {
		const selectedCategory = e.target.value;

		if (selectedCategory === "new") {
			setIsCreateNewCategoryModal(true);
		}
		else {
			setNewProduct({ ...newProduct, category: selectedCategory });
		}
	}

	const handleImageChange = (e, type) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				if (type === "category") {
					console.log("set new category image");
					setNewCategory({ ...newCategory, image: reader.result });
				}
				else {
					console.log("set new product image");

					setNewProduct({ ...newProduct, image: reader.result });
				}
			};

			reader.readAsDataURL(file); // base64
		}
	};

	const isFormUnchanged = useMemo(() => {
		if(!product) return false;

		return product.name === newProduct.name &&
			product.description === newProduct.description &&
			product.price == newProduct.price &&
			product.category._id === newProduct.category &&
			product.image === newProduct.image
	}, [product, newProduct])

	useEffect(() => {
		fetchCategories();
	}, [])

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 min-w-md max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300 text-center'>{type === "edit" ? "Edit Product" : "Create New Product"}</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={handleCategoryChange}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category.name} value={category._id}>
								{category.name}
							</option>
						))}

						<option value="new" className="text-blue-500">+ Create a new category</option>
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='product-image' className='sr-only' accept='image/*' onChange={(e) => handleImageChange(e, "product")} required={!newProduct.image} />
					<label
						htmlFor='product-image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
				</div>

				<button
					type='submit'
					className='cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading || isFormUnchanged}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							{type === "edit" ? "Update Product" : "Create Product"}
						</>
					)}
				</button>
			</form>

			{isCreateNewCategoryModal && (
				<div
					// onClick={() => setIsCreateNewCategoryModal(false)}
					className='fixed inset-0 flex items-center justify-center bg-gray-900/80 z-50'
				>
					<div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
						<h2 className='text-xl font-semibold mb-4 text-emerald-300'>Create New Category</h2>

						<form key={"category"} onSubmit={onCategorySubmit} className='space-y-4'>
							<div>
								<label htmlFor='category-name' className='block text-sm font-medium text-gray-300'>
									Category Name
								</label>
								<input
									type='text'
									id='category-name'
									name='category-name'
									value={newCategory.name}
									onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
									px-3 text-white focus:outline-none focus:ring-2
									focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>

							<div className='flex items-center'>
								<input type='file' id='category-image' className='sr-only' accept='image/*' onChange={(e) => handleImageChange(e, "category")} />
								<label
									htmlFor='category-image'
									className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								>
									<Upload className='h-5 w-5 inline-block mr-2' />
									Upload Image
								</label>
								{newCategory.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
							</div>
							<div className="flex justify-between gap-2">
								<button className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-md" onClick={() => setIsCreateNewCategoryModal(false)}>Close</button>
								<button
									type='submit'
									disabled={isLoadingCategories}
									className='px-4 py-2 bg-red-600 text-white rounded-md flex gap-1 items-center cursor-pointer'
								>
									{isLoadingCategories ? (
										<>
											<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
											Loading...
										</>
									) : (
										<>
											<PlusCircle className='mr-2 h-5 w-5' />
											Create Category
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</motion.div>
	);
};
export default ProductForm;