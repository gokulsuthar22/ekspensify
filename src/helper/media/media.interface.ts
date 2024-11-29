import { MediaCollection, MediaType, ModelType } from '@prisma/client';

export interface CreateMediaData {
  userId: number;
  modelId?: number;
  modelType?: ModelType;
  name: string;
  key: string;
  path: string;
  mime: string;
  type: MediaType;
  size: number;
  collection: MediaCollection;
}

export type MediaWhere =
  | { id: number; key?: never }
  | { key: string; id?: never };

export interface UpdateMediaData {
  userId?: number;
  modelId?: number;
  modelType?: ModelType;
  name?: string;
  key?: string;
  path?: string;
  mime?: string;
  type?: MediaType;
  size?: number;
  collection?: MediaCollection;
}

export interface FilterMediaWhere {
  userId?: number;
  modelId?: number;
  modelType?: ModelType;
  type?: MediaType;
  collection?: MediaCollection;
}
