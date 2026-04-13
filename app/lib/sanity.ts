// Stub for Sanity CMS client
// In production, this would connect to Sanity

export const sanityClient = {
  fetch: async <T = any>(_query: string, _params?: Record<string, any>): Promise<T> => [] as unknown as T,
}

export const urlFor = (source: any) => {
  return {
    url: () => source?.asset?.url || '',
  }
}
