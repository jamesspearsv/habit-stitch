import PocketBase from 'pocketbase'
const pb_url = import.meta.env.VITE_PB_URL || 'http://localhost:8080'
export const pb = new PocketBase(pb_url)
