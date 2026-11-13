import { countryName } from '../../lib/format'

// Countries offered in the back office forms. Stored as ISO codes.
export const COUNTRY_CODES = ['CH', 'DE', 'AT', 'NL', 'DK', 'PT', 'ES', 'IT', 'CZ', 'GR', 'MK', 'GB', 'CA', 'AU', 'IL', 'CO', 'UY', 'ZA', 'LS']

export const COUNTRIES = COUNTRY_CODES.map((code) => ({ code, name: countryName(code) })).sort((a, b) =>
  a.name.localeCompare(b.name),
)
