// import './temp/images/properties/'
export const amenitiesArr = [
  { id: 1, name: 'Kitchen' },
  { id: 2, name: 'Security' },
  { id: 3, name: 'Swimming Pool' },
  { id: 4, name: 'Balcony' },
  { id: 5, name: 'Gym' },
  { id: 6, name: 'Laundry In Unit' },
  { id: 7, name: 'Parking' },
  { id: 8, name: 'High-Speed Internet' },
  { id: 9, name: 'Pet-Friendly' },
  { id: 10, name: 'Air Conditioning' },
  { id: 11, name: 'Dishwasher' },
  { id: 12, name: 'Elevator' },
  { id: 13, name: 'Fireplace' },
  { id: 14, name: 'Furnished' },
  { id: 15, name: 'Walk-In Closet' },
  { id: 16, name: 'Community Room' },
  { id: 17, name: 'Rooftop Deck' },
  { id: 18, name: 'Movie Theater' },
  { id: 19, name: 'Controlled Access Entry' },
  { id: 20, name: '24-Hour Maintenance' },
  { id: 21, name: 'On-Site Management' },
  { id: 22, name: 'Balcony/Patio' },
]

export const propertyTypeArr = [
  { id: 0, name: 'choose property type' },
  { id: 1, name: 'apartment' },
  { id: 2, name: 'Condo' },
  { id: 3, name: 'House' },
  { id: 4, name: 'Cabin or Cottage' },
  { id: 5, name: 'Room' },
  { id: 6, name: 'Studio' },
  { id: 7, name: 'Other' },
]

export const imgs = [{ id: 7, name: `./temp/images/properties/` }]

export function formatPrice(number) {
  // const number1 = 555.55
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
  })

  const formattedMoney = formatter.format(number)
  return formattedMoney
}
