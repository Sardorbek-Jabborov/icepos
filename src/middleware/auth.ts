import { useAuthStore } from '@/stores/authStore'

export default (to: any, from: any) => {
    const { isAuthenticated } = useAuthStore()
    if (!isAuthenticated && to.name !== 'PLogin') return { name: 'PLogin' }
    if (isAuthenticated && to.name === 'PLogin') return { name: 'PCustomers' }
    return isAuthenticated || to.name === 'PLogin'
}