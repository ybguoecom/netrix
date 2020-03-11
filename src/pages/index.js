import React from 'react'
import { graphql, Link } from 'gatsby'

import Category from '../components/Category'

function IndexPage({
  data: {
    categories: { edges: categories }
  }
}) {
  return (
    <>
      <div className="hero overflow-y-hidden" style={{"background-image": "linear-gradient(90deg,#330072 5%,rgba(51,0,114,0.56) 30%), url(https://netrixllc.com/wp-content/uploads/2019/10/AskCody-Netrix-PageHead2.jpg)"}}>
        <div className="container relative">
          <div className="w-full py-12 px-8 md:px-0">
            <div className="text-center md:text-left md:my-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-normal w-full" >
                Transforming your business through technology innovation.
              </h1>
              <p className="mt-2 text-white">
                As a leader in IT consulting, Netrix provides best of breed IT solutions to organizations around the world. We hold high levels of technical certifications with all major business technology vendors. Our team focuses on working across technologies to deliver custom, integrated solutions to meet our clients’ business needs.
              </p>

              <Link
                to={`/products`}
                className="inline-block w-1/2 appearance-none border border-b-3 border-white text-white mt-8 px-4 py-3 leading-tight rounded-none focus:outline-none my-2 no-underline"
              >
                Shop Now
              </Link>
      
      <Link
                to={`/GAQ`}
                className="inline-block w-1/2 appearance-none border border-b-3 border-white text-white mt-8 px-4 py-3 leading-tight rounded-none focus:outline-none my-2 no-underline"
              >
                Get A Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {categories && (
        <div className="flex flex-wrap -mx-6">
          {categories.map(({ node }) => (
            <Category key={node.id} {...node} />
          ))}
        </div>
      )}
    </>
  )
}

export const query = graphql`
  query IndexPageQuery {
    categories: allMoltinCategory {
      edges {
        node {
          id
          name
          slug
          description
          products {
            name
            mainImage {
              childImageSharp {
                fluid(maxWidth: 560) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`

export default IndexPage
