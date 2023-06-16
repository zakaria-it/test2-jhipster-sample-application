import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 91847,
};

export const sampleWithPartialData: ILocation = {
  id: 8097,
  postalCode: 'capacitor Island',
  city: 'Dibbertfort',
  file: '../fake-data/blob/hipster.png',
  fileContentType: 'unknown',
};

export const sampleWithFullData: ILocation = {
  id: 76518,
  streetAddress: 'International Computer',
  postalCode: 'Unbranded',
  city: 'Alyciabury',
  stateProvince: 'Checking',
  file: '../fake-data/blob/hipster.png',
  fileContentType: 'unknown',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
