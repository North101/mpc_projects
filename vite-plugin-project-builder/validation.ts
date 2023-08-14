import Ajv, { JSONSchemaType } from 'ajv'
import { Card, CardFace, ProjectPart, Project } from './types'


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
    front: {
      ...cardFaceSchema,
      nullable: true,
    },
    back: {
      ...cardFaceSchema,
      nullable: true,
    },
  },
  required: [
    'count',
  ],
}

const partSchema: JSONSchemaType<ProjectPart> = {
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean',
      nullable: true,
    },
    name: { type: 'string' },
    cards: {
      type: 'array',
      items: cardSchema
    },
  },
  required: [
    'name',
    'cards',
  ],
}

const projectSchema: JSONSchemaType<Project> = {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    content: { type: 'string' },
    authors: {
      type: 'array',
      items: { type: 'string' },
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    created: { type: 'string' },
    updated: { type: 'string' },
    website: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    version: {
      type: 'number',
      const: 2,
    },
    code: { type: 'string' },
    parts: {
      type: 'array',
      items: partSchema,
     },
    hash: { type: 'string' },
  },
  required: [
    'projectId',
    'name',
    'description',
    'content',
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

const ajv = new Ajv({
  removeAdditional: 'all',
})
export const projectValidator = ajv.compile(projectSchema)
