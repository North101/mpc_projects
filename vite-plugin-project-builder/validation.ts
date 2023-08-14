import Ajv, { JSONSchemaType } from 'ajv'
import { Card, CardFace, PartMeta, ProjectV1Meta, ProjectV2Meta } from './types'


const cardFaceSchema: JSONSchemaType<CardFace> = {
  type: 'object',
  properties: {
    Name: { type: 'string' },
    ID: { type: 'string' },
    SourceID: { type: 'string' },
    Exp: { type: 'string' },
    Width: { type: 'number' },
    Height: { type: 'number' },
  },
  required: [
    'Name',
    'ID',
    "SourceID",
    'Exp',
    'Width',
    'Height',
  ]
}

const cardSchema: JSONSchemaType<Card> = {
  type: 'object',
  properties: {
    count: { type: 'number' },
    front: { ...cardFaceSchema, nullable: true },
    back: { ...cardFaceSchema, nullable: true },
  },
  required: [
    'count',
  ],
}

const partSchema: JSONSchemaType<PartMeta> = {
  type: 'object',
  properties: {
    enabled: { type: 'boolean', nullable: true },
    name: { type: 'string' },
    cards: { type: 'array', items: cardSchema },
  },
  required: [
    'name',
    'cards',
  ],
}

const projectV1Schema: JSONSchemaType<ProjectV1Meta> = {
  type: 'object',
  properties: {
    projectId: { type: 'array', items: { type: 'string' } },
    name: { type: 'string' },
    description: { type: 'string' },
    info: { type: 'string', nullable: true },
    website: { type: 'string', nullable: true },
    authors: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    created: { type: 'string' },
    updated: { type: 'string' },
    version: { type: 'number', const: 1 },
    code: { type: 'string' },
    cards: { type: 'array', items: cardSchema },
    hash: { type: 'string' },
  },
  required: [
    'projectId',
    'name',
    'description',
    'authors',
    'tags',
    'created',
    'updated',
    'version',
    'code',
    'cards',
    'hash',
  ]
}

const projectV2Schema: JSONSchemaType<ProjectV2Meta> = {
  type: 'object',
  properties: {
    projectId: { type: 'array', items: { type: 'string' } },
    name: { type: 'string' },
    description: { type: 'string' },
    authors: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    created: { type: 'string' },
    updated: { type: 'string' },
    website: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    version: { type: 'number', const: 2 },
    code: { type: 'string' },
    parts: { type: 'array', items: partSchema },
    hash: { type: 'string' },
  },
  required: [
    'projectId',
    'name',
    'description',
    'authors',
    'tags',
    'created',
    'updated',
    'version',
    'code',
    'parts',
    'hash',
  ]
}

const projectSchema: JSONSchemaType<ProjectV1Meta | ProjectV2Meta> = {
  oneOf: [
    projectV1Schema,
    projectV2Schema,
  ]
}

const ajv = new Ajv({
  removeAdditional: 'all',
})
const projectValidator = ajv.compile(projectSchema)
export default projectValidator
