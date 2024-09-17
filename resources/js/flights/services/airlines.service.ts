export const getAirlineLogo = (marketingCarrier: string) => {
  const AIRLINE_LOGOS_API = 'https://pics.avs.io/60/60'
  const LOGO_EXT = 'png'

  return `${AIRLINE_LOGOS_API}/${marketingCarrier}.${LOGO_EXT}`
}
