import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { Card, CardFace, ProjectV1, ProjectV2, ProjectPart } from './types'


const cardFaceSchema: JTDSchemaType<CardFace> = {
  properties: {
    Name: { type: 'string' },
    ID: { type: 'string' },
    SourceID: { type: 'string' },
    Exp: { type: 'string' },
    Width: { type: 'int32' },
    Height: { type: 'int32' },
  },
}

const cardSchema: JTDSchemaType<Card> = {
  properties: {
    count: { type: 'int32' }
  },
  optionalProperties: {
    front: cardFaceSchema,
    back: cardFaceSchema,
  },
  additionalProperties: true,
}

const partSchema: JTDSchemaType<ProjectPart> = {
  properties: {
    name: { type: 'string' },
    cards: { elements: cardSchema }
  },
  optionalProperties: {
    enabled: { type: 'boolean' },
  },
}

const projectV1Schema: JTDSchemaType<ProjectV1> = {
  properties: {
    projectId: { type: 'string' },
    code: { type: 'string' },
    hash: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    content: { type: 'string' },
    authors: { elements: { type: 'string' } },
    tags: { elements: { type: 'string' } },
    created: { type: 'string' },
    updated: { type: 'string' },
    website: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    cards: { elements: cardSchema },
  },
  optionalProperties: {
    version: { type: 'int32' }
  },
}

const projectV2Schema: JTDSchemaType<ProjectV2> = {
  properties: {
    projectId: { type: 'string' },
    code: { type: 'string' },
    hash: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    content: { type: 'string' },
    authors: { elements: { type: 'string' } },
    tags: { elements: { type: 'string' } },
    created: { type: 'string' },
    updated: { type: 'string' },
    website: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    parts: { elements: partSchema },
  },
  optionalProperties: {
    version: { type: 'int32' }
  },
}

const ajv = new Ajv({})
export const projectV1Validator = ajv.compile(projectV1Schema)
export const projectV2Validator = ajv.compile(projectV2Schema)
