import { ICountry } from 'app/entities/country/country.model';

export interface IDocument {
  id: number;
  name?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  country?: Pick<ICountry, 'id'> | null;
}

export type NewDocument = Omit<IDocument, 'id'> & { id: null };
