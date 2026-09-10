import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import WordReveal from "@/app/components/WordReveal";
import { personalProducts, hasProductCaseStudy } from "@/lib/products";

export default function MyProducts() {
  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* pt must match the fixed Navbar's actual rendered height (currently 95px) */}
      <section className="pt-[95px] pb-20 md:pb-24">
        <div className="px-5 md:px-10 lg:px-[155px] pt-[40px] pb-10 md:pb-14">
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-[36px] md:text-[53px] text-black leading-none">
            <WordReveal text="My personal projects" delay={0} />
          </h1>
          <p className="mt-5 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[30px] text-text leading-normal max-w-[670px]">
            <WordReveal
              text="As a product designer I have a passion for building things, sometimes I like to create products for myself. This page is for the products that I have designed and built by myself for my own pleasure."
              delay={150}
            />
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {personalProducts.map((product) => (
            <ProductCard
              key={product.slug}
              {...product}
              hasCaseStudy={hasProductCaseStudy(product.slug)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
