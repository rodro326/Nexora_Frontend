import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  rating?: number;
};

type ProductGridProps = {
  products: Product[];
};

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          category={product.category}
          price={product.price}
          image={product.image}
          rating={product.rating}
        />
      ))}
    </div>
  );
};

export default ProductGrid;