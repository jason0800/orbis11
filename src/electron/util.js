export function isDev() {
    return globalThis.process.env.NODE_ENV === 'development';
}