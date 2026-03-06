export function formatSuccess<T>(data: T) {
  return { status: "success" as const, data, error: null };
}

export function formatError(error: string) {
  return { status: "error" as const, data: null, error };
}
