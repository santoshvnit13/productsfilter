import './index.css'

const FiltersGroup = props => {
  const {categoryItem, cFunction} = props
  const {categoryId, name} = categoryItem

  const categoryFunction = () => {
    cFunction(categoryId)
  }

  return (
    <li className="filters-group-container">
      <button type="button" onClick={categoryFunction}>
        <p>{name}</p>
      </button>
    </li>
  )
}

export default FiltersGroup
