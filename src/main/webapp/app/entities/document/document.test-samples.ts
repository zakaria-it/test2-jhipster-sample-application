import { IDocument, NewDocument } from './document.model';

export const sampleWithRequiredData: IDocument = {
  id: 70614,
};

export const sampleWithPartialData: IDocument = {
  id: 59972,
  name: 'Borders up TCP',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IDocument = {
  id: 59671,
  name: 'transform executive',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewDocument = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
