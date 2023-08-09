import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { Card, CardFace, FullProject } from './types'


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

const fullProjectSchema: JTDSchemaType<FullProject> = {
  properties: {
    version: { type: 'int32' },
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
}

const ajv = new Ajv({})
export default ajv.compile(fullProjectSchema)
