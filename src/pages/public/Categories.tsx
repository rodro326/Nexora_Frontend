import { Link } from "react-router-dom";

const categories = [
  {
    name: "Smartphones",
    description: "Latest smartphones and mobile devices",
    icon: "📱",
  },
  {
    name: "Laptops",
    description: "Powerful laptops for work and gaming",
    icon: "💻",
  },
  {
    name: "Tablets",
    description: "Portable devices for work and entertainment",
    icon: "📲",
  },
  {
    name: "Audio",
    description: "Headphones, earbuds and speakers",
    icon: "🎧",
  },
  {
    name: "Gaming",
    description: "Gaming laptops, accessories and gear",
    icon: "🎮",
  },
  {
    name: "Accessories",
    description: "Essential accessories for your devices",
    icon: "⌨️",
  },
];

const Categories = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-gray-500">
          Explore Nexora
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shop by Category
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Explore our wide range of technology products and find exactly what
          you need.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/products?category=${category.name}`}
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {category.icon}
              </div>

              <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
                →
              </span>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              {category.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {category.description}
            </p>

            <p className="mt-5 text-sm font-semibold text-gray-900">
              Explore {category.name} →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Categories;