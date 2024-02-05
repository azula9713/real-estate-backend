import { TypeOf, object, string } from 'zod';

const params = {
  params: object({
    postalCode: string({
      required_error: 'Postal Code is required',
    }),
  }),
};

const getCityByPostalCodeSchema = object({
  ...params,
});

type GetCityByPostalCodeInput = TypeOf<typeof getCityByPostalCodeSchema>;

export { GetCityByPostalCodeInput, getCityByPostalCodeSchema };
