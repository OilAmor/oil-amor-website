/**
 * Sanity CMS Type Declarations
 */

declare module 'sanity' {
  export interface SanityConfig {
    projectId: string
    dataset: string
    apiVersion?: string
    useCdn?: boolean
    token?: string
  }

  export interface SchemaType {
    name: string
    title?: string
    type: string
    fields?: SchemaField[]
    validation?: (Rule: ValidationRule) => ValidationRule
    preview?: {
      select?: Record<string, string>
      prepare?: (selection: Record<string, unknown>) => {
        title?: string
        subtitle?: string
        media?: unknown
      }
    }
  }

  export interface SchemaField {
    name: string
    title?: string
    type: string
    description?: string
    options?: Record<string, unknown>
    validation?: (Rule: ValidationRule) => ValidationRule | ValidationRule[]
    of?: Array<{ type: string; fields?: SchemaField[] }>
    fields?: SchemaField[]
  }

  export interface ValidationRule {
    required: () => ValidationRule
    min: (min: number) => ValidationRule
    max: (max: number) => ValidationRule
    warning: () => ValidationRule
    error: () => ValidationRule
    custom: (fn: (value: unknown) => true | string) => ValidationRule
  }

  export function defineConfig(config: {
    name?: string
    title?: string
    projectId: string
    dataset: string
    plugins?: unknown[]
    schema?: {
      types: SchemaType[]
    }
  }): unknown

  export function defineType(type: SchemaType): SchemaType
  export function defineField(field: SchemaField): SchemaField
}

declare module 'sanity/desk' {
  export function deskTool(config?: {
    structure?: (S: StructureBuilder) => unknown
  }): unknown

  export interface StructureBuilder {
    documentTypeList: (type: string) => unknown
    list: () => unknown
  }
}

declare module '@sanity/vision' {
  export function visionTool(): unknown
}

declare module '@sanity/client' {
  export interface SanityClientConfig {
    projectId: string
    dataset: string
    apiVersion?: string
    useCdn?: boolean
    token?: string
  }

  export interface SanityDocument {
    _id: string
    _type: string
    _createdAt?: string
    _updatedAt?: string
    _rev?: string
  }

  export interface SanityClient {
    fetch<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T>
    create<T = unknown>(doc: Partial<T & SanityDocument>): Promise<T & SanityDocument>
    createOrReplace<T = unknown>(doc: T & SanityDocument): Promise<T & SanityDocument>
    patch(id: string): {
      set: (values: Record<string, unknown>) => { commit: () => Promise<SanityDocument> }
      inc: (values: Record<string, number>) => { commit: () => Promise<SanityDocument> }
      dec: (values: Record<string, number>) => { commit: () => Promise<SanityDocument> }
    }
    delete(id: string): Promise<SanityDocument>
  }

  export function createClient(config: SanityClientConfig): SanityClient
}
