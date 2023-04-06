import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import FiltersGroup2 from '../FiltersGroup2'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    failureView: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  searchValue1 = event => {
    const {category, rating, titleSearch} = this.state
    this.setState(
      {titleSearch: event.target.value, category, rating},
      this.getProducts,
    )
  }

  cFunction = cid => {
    const {rating, titleSearch} = this.state
    this.setState({category: cid, titleSearch, rating}, this.getProducts)
  }

  rFunction = rid => {
    const {category, titleSearch} = this.state
    this.setState({rating: rid, titleSearch, category}, this.getProducts)
  }

  clearFilters = () => {
    this.setState(
      {
        titleSearch: '',
        category: '',
        rating: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      category,
      titleSearch,
      rating,
      failureView,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        failureView: false,
      })
    } else {
      this.setState({failureView: true, isLoading: false})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, titleSearch} = this.state
    const valueId = productsList.length >= 1

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <input
          placeholder="Search"
          type="search"
          onChange={this.searchValue1}
          value={titleSearch}
        />
        {valueId ? (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        ) : (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
            <p>No products Found</p>
            <p>We could not find any products. Try other filters.</p>
          </>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {isLoading, failureView} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}

        <h1>Category</h1>
        <ul>
          {categoryOptions.map(categoryItem => (
            <FiltersGroup
              categoryItem={categoryItem}
              key={categoryItem.categoryId}
              cFunction={this.cFunction}
            />
          ))}
        </ul>
        <h1>Rating</h1>
        <ul>
          {' '}
          {ratingsList.map(ratingItem => (
            <FiltersGroup2
              ratingItem={ratingItem}
              key={ratingItem.ratingId}
              rFunction={this.rFunction}
            />
          ))}
        </ul>
        <button type="button" onClick={this.clearFilters}>
          Clear Filters
        </button>
        {isLoading ? (
          this.renderLoader()
        ) : (
          <>
            {failureView ? (
              <>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
                  alt="products failure"
                />
                <p>Oops! Something Went Wrong</p>
                <p>
                  We are having some trouble processing your request. Please try
                  again.
                </p>
              </>
            ) : (
              this.renderProductsList()
            )}
          </>
        )}
      </div>
    )
  }
}

export default AllProductsSection
