import Ajv, { JSONSchemaType } from 'ajv'
import { Card, CardFace, OptionMeta, PartMeta, ProjectV1Meta, ProjectV2Meta, ProjectV2_1Meta } from './types'


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
    'SourceID',
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
    key: { type: 'number' },
    enabled: { type: 'boolean', nullable: true },
    name: { type: 'string' },
    cards: { type: 'array', items: cardSchema },
  },
  required: [
    'name',
    'cards',
  ],
}

const optionSchema: JSONSchemaType<OptionMeta> = {
  type: 'object',
  properties: {
    key: { type: 'number' },
    name: { type: 'string' },
    parts: { type: 'array', items: partSchema },
  },
  required: [
    'name',
    'parts',
  ],
}

const projectV1Schema: JSONSchemaType<ProjectV1Meta> = {
  type: 'object',
  properties: {
    projectId: { type: 'array', items: { type: 'string' } },
    name: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string', nullable: true },
    artist: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    website: { type: 'string', nullable: true },
    cardsLink: {type: 'string', nullable: true },
    scenarioCount: { type: 'number' },
    investigatorCount: { type: 'number' },
    authors: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    statuses: { type: 'array', items: { type: 'string'} },
    created: { type: 'string' },
    updated: { type: 'string' },
    hash: { type: 'string' },
    version: { type: 'number', const: 1 },
    code: { type: 'string' },
    cards: { type: 'array', items: cardSchema },
  },
  required: [
    'projectId',
    'name',
    'description',
    'authors',
    'tags',
    'statuses',
    'created',
    'updated',
    'hash',
    'version',
    'code',
    'cards',
  ]
}

const projectV2Schema: JSONSchemaType<ProjectV2Meta> = {
  type: 'object',
  properties: {
    projectId: { type: 'array', items: { type: 'string' } },
    name: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string', nullable: true },
    artist: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    website: { type: 'string', nullable: true },
    cardsLink: { type: 'string', nullable: true },
    scenarioCount: { type: 'number' },
    investigatorCount: { type: 'number' },
    authors: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    statuses: { type: 'array', items: { type: 'string'} },
    created: { type: 'string' },
    updated: { type: 'string' },
    hash: { type: 'string' },
    version: { type: 'number', const: 2 },
    code: { type: 'string' },
    parts: { type: 'array', items: partSchema },
  },
  required: [
    'projectId',
    'name',
    'description',
    'authors',
    'tags',
    'statuses',
    'created',
    'updated',
    'hash',
    'version',
    'code',
    'parts',
  ]
}

const projectV2_1Schema: JSONSchemaType<ProjectV2_1Meta> = {
  type: 'object',
  properties: {
    projectId: { type: 'array', items: { type: 'string' } },
    name: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string', nullable: true },
    artist: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    website: { type: 'string', nullable: true },
    cardsLink: { type: 'string', nullable: true },
    scenarioCount: { type: 'number' },
    investigatorCount: { type: 'number' },
    authors: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    statuses: { type: 'array', items: { type: 'string'} },
    created: { type: 'string' },
    updated: { type: 'string' },
    hash: { type: 'string' },
    version: { type: 'number', const: 2.1 },
    code: { type: 'string' },
    options: { type: 'array', items: optionSchema },
  },
  required: [
    'projectId',
    'name',
    'description',
    'authors',
    'tags',
    'statuses',
    'created',
    'updated',
    'hash',
    'version',
    'code',
    'options',
  ]
}

const projectSchema: JSONSchemaType<ProjectV1Meta | ProjectV2Meta | ProjectV2_1Meta> = {
  oneOf: [
    projectV1Schema,
    projectV2Schema,
    projectV2_1Schema,
  ]
}

const ajv = new Ajv({
  removeAdditional: 'all',
})
const projectValidator = ajv.compile(projectSchema)
export default projectValidator
