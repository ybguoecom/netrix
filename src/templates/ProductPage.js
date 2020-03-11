import React from 'react'
import { graphql, withPrefix } from 'gatsby'

import SEO from '../components/SEO'
import Photo from '../components/Photo'
import Badge from '../components/Badge'
import AddToCart from '../components/AddToCart'
import useMoltinInventory from '../hooks/useMoltinInventory'
import SocialLinks from '../components/SocialLinks'


function Specs({ specs }) {
    const spec_style = {'font-weight': 'bold', 'padding-right': '1em'}
    const value_style = {'text-align': 'left'}
    specs = specs.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
    specs = specs.replace(/[\u0000-\u0019]+/g,""); 
    const specs_obj = JSON.parse(specs)
   
    return (
        <table>
        { specs_obj.General.map((spec, index) => {
        return  <tr><td style={spec_style}>{ spec.property_name}: </td><td style={value_style}>{spec.value} </td></tr>
        })
        }
        </table>
    )
}

function Info({ upc, part_number }) {
    const spec_style = {'font-weight': 'bold', 'padding-right': '1em'}
    const value_style = {'text-align': 'left'}
    return (
        <table>
        <tr><td style={spec_style}>UPC: </td><td style={value_style}> { upc }</td></tr>
        <tr><td style={spec_style}>Part Number: </td><td style={value_style}> { part_number }</td></tr>

        </table>
    )
}


function OurPrice({ market_price, price }) {
    const mp_style = {'text-decoration': 'line-through', 'display':'block'}
    const op_style = {'color': 'red', 'display':'block'}
    return (
        !market_price?
        <h2>{price}</h2> :
        <div><h2 style={mp_style}>${(market_price/100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2><h2 style={op_style}>{price}</h2></div>
    )
}

function ProductPage({ data: { product } }) {
  const [inventory, inventoryLoading, inventoryError] = useMoltinInventory(
    product
  )

  const {
    meta: { display_price }
  } = product

  return (
    <React.Fragment>
      <SEO
        type="product"
        title={product.meta_title || product.name}
        description={product.meta_description || product.description}
        image={withPrefix(product.mainImage.childImageSharp.fluid.src)}
      />

      <div className="flex flex-wrap">
        <div className="py-2 md:py-5 md:px-5 w-full lg:w-1/2">
          <div className="sticky pin-t">
            <Photo
              src={product.mainImage}
              alt={product.main_image_alt_text || product.name}
              transparent
            />
          </div>
        </div>

        <div className="py-2 md:py-5 md:px-5 md:pr-10 w-full lg:w-1/2">
          <div className="my-2 flex flex-col md:flex-col-reverse">
             <div className="text-3xl md:text-5xl text-black font-normal">
              {product.name}
            </div>
              
           
      
          </div>


            <div className="py-2" > 
                  {product.on_sale && (
                <Badge color="green" className="mx-2">
                  On Sale
                </Badge>
              )}
              {!inventoryError &&
                (inventoryLoading ? (
                  <Badge  className="mx-2"> Loading inventory</Badge>
                ) : (
                  <Badge
                    color={inventory.inStock ? 'green' : 'red'}
                    className="mx-2"
                    custom_color={inventory.inStock ? '#835CC8' : 'red'}
                  >
                    {inventory.inStock
                      ? product.manage_stock
                        ? `${inventory.available} in stock `
                        : 'In Stock'
                      : 'Out of stock'}
                  </Badge>
                ))}
            
              </div>
          {inventoryError ? (
            inventoryError
          ) : (
            <div className="flex flex-wrap flex-col md:flex-row md:items-end">
              <AddToCart productId={product.id} disabled={!inventory.inStock} />
            </div>
          )}

           <div className="my-2 md:my-5">
             <h4 className="hidden md:block text-lg text-black font-bold my-2">
              Product Information
              
            </h4>
              <p><Info upc={product.upc} part_number={product.part_number}></Info></p>
           </div>
          <div className="my-2 md:my-5">
            <h4 className="hidden md:block text-lg text-black font-bold my-2">
              Product Specifications
            </h4>

            <p><Specs specs={product.specifications}></Specs></p>

            <h4 className="hidden md:block text-lg text-black font-bold my-2">
              Description
            </h4>
            <p>{product.description}</p>

            <SocialLinks product={product} />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export const query = graphql`
  query($id: String!) {
    product: moltinProduct(id: { eq: $id }) {
      id
      slug
      name
      description
      sku
      mainImage {
        childImageSharp {
          fluid(maxWidth: 560) {
            ...GatsbyImageSharpFluid
          }
        }
        publicURL
      }
      meta {
        display_price {
          without_tax {
            formatted
          }
        }
      }
      manage_stock
      part_number
      specifications
      upc
    }
  }
`

export default ProductPage
