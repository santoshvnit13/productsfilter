const FiltersGroup2 = props => {
  const {ratingItem, rFunction} = props

  const {ratingId, imageUrl} = ratingItem

  const ratingFunction = () => {
    rFunction(ratingId)
  }

  return (
    <li>
      <button type="button" onClick={ratingFunction}>
        <img src={imageUrl} alt={`rating ${ratingId}`} />
        <p>& up</p>
      </button>
    </li>
  )
}
export default FiltersGroup2
