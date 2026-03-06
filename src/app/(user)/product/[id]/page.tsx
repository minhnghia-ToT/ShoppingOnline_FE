"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  status: string;
  categoryName: string;
  images: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const data = await api.getUserProductById(Number(id));
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p>Product not found</p>;

  const hasDiscount = product.discountPrice > 0;

  const prevImage = () => {
    if (!product.images) return;
    setSelectedIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!product.images) return;
    setSelectedIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const selectedImage = product.images[selectedIndex];

  return (
    <>
      <style>{css}</style>

      <div className="pdp-root">
        <div className="pdp-layout">

          {/* LEFT IMAGE */}
          <div className="pdp-gallery">

            <div className="pdp-main-img-wrap">

              {selectedImage && (
                <img
                  src={`${API_URL}${selectedImage}`}
                  alt={product.name}
                  className="pdp-main-img"
                />
              )}

              {/* ARROWS */}
              <button className="arrow left" onClick={prevImage}>
                ‹
              </button>

              <button className="arrow right" onClick={nextImage}>
                ›
              </button>

            </div>

            <div className="pdp-thumbs">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  className={`pdp-thumb ${
                    selectedIndex === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img src={`${API_URL}${img}`} alt="" />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT INFO */}
          <div className="pdp-info">

            <span className="category">{product.categoryName}</span>

            <h1>{product.name}</h1>

            <div className="price-block">
              {hasDiscount ? (
                <>
                  <span className="old-price">
                    {product.price.toLocaleString()}₫
                  </span>

                  <span className="sale-price">
                    {product.discountPrice.toLocaleString()}₫
                  </span>
                </>
              ) : (
                <span className="price">
                  {product.price.toLocaleString()}₫
                </span>
              )}
            </div>

            <p className="desc">{product.description}</p>

            <div className="stock">
              Stock: {product.stockQuantity}
            </div>

            <div className="actions">
              <button className="btn-cart">Add to Cart</button>
              <button className="btn-buy">Buy Now</button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

const css = `

.pdp-root{
padding:40px;
max-width:1200px;
margin:auto;
font-family:system-ui;
}

.pdp-layout{
display:grid;
grid-template-columns:1fr 1fr;
gap:60px;
}

/* IMAGE */

.pdp-main-img-wrap{
background:#f5f5f5;
border-radius:10px;
overflow:hidden;
aspect-ratio:4/5;
position:relative;
}

.pdp-main-img{
width:100%;
height:100%;
object-fit:cover;
}

/* ARROWS */

.arrow{
position:absolute;
top:50%;
transform:translateY(-50%);
background:rgba(255,255,255,0.7);
border:none;
width:36px;
height:36px;
border-radius:50%;
cursor:pointer;
font-size:22px;
display:flex;
align-items:center;
justify-content:center;
transition:0.2s;
opacity:0;
}

.pdp-main-img-wrap:hover .arrow{
opacity:1;
}

.arrow:hover{
background:white;
}

.arrow.left{
left:10px;
}

.arrow.right{
right:10px;
}

/* THUMB */

.pdp-thumbs{
display:flex;
gap:10px;
margin-top:12px;
}

.pdp-thumb{
width:70px;
height:70px;
border:2px solid transparent;
border-radius:6px;
overflow:hidden;
cursor:pointer;
background:#eee;
}

.pdp-thumb.active{
border-color:black;
}

.pdp-thumb img{
width:100%;
height:100%;
object-fit:cover;
}

/* INFO */

.pdp-info h1{
font-size:32px;
margin-bottom:10px;
}

.category{
font-size:12px;
letter-spacing:2px;
color:#777;
text-transform:uppercase;
}

.price-block{
margin:20px 0;
}

.price{
font-size:28px;
font-weight:600;
}

.old-price{
text-decoration:line-through;
color:#888;
margin-right:10px;
}

.sale-price{
font-size:30px;
font-weight:700;
color:#d32f2f;
}

.desc{
color:#555;
line-height:1.6;
margin-bottom:20px;
}

.stock{
margin-bottom:20px;
color:#333;
}

.actions{
display:flex;
gap:12px;
}

.btn-cart{
flex:1;
padding:14px;
background:black;
color:white;
border:none;
cursor:pointer;
}

.btn-buy{
flex:1;
padding:14px;
background:#e53935;
color:white;
border:none;
cursor:pointer;
}

.loading{
padding:40px;
text-align:center;
}

`;