import CategoryItem from "../components/CategoryItem";
import Banner from "../components/Banner";
import Featuredsection from "../components/Featuredsection";

// ✅ Import category images from src/assets/index.js
import {
  pants,
  shorts,
  tshirts,
  kurtis,
  indo_western,
  lehenga_choli,
  jackets,
  ethnic_wear,
  sets,
  footwear,
  accessories,
  bags
} from "../assets";

const categories = [
  { href: "/pants", name: "Pants", imageUrl: pants },
  { href: "/t-shirts", name: "T-shirts", imageUrl: tshirts },
  { href: "/shorts", name: "Shorts", imageUrl: shorts },
  { href: "/kurtis", name: "Kurtis", imageUrl: kurtis },
  { href: "/jackets", name: "Jackets", imageUrl: jackets },
  { href: "/ethnic_wear", name: "Ethnic Wear", imageUrl: ethnic_wear},
  { href: "/sets&suits", name: "Sets", imageUrl: sets },
  { href: "/indo_western", name: "Indo Western", imageUrl: indo_western },
  { href: "/lehenga_choli", name: "Lehenga Choli", imageUrl: lehenga_choli },
  { href: "/footwear", name: "Footwear", imageUrl: footwear },
  { href: "/accesories", name: "Accessories", imageUrl: accessories },
  { href: "/bags", name: "Bags", imageUrl: bags }
];

const HomePage = () => {
  return (
    <div className="bg-blue-50 min-h-screen">
      <Banner />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl sm:text-5xl font-bold text-teal-600 mb-6 transition-opacity duration-500">
            Explore Our Categories
          </h1>
          <p className="text-center text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the latest trends in eco-friendly fashion, crafted with sustainability and style in mind.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </div>
      </div>

      <Featuredsection />
    </div>
  );
};

export default HomePage;
