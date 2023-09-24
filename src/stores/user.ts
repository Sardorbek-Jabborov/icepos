import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getItem} from "@/service/localstorage"

export const useUserStore = defineStore('user', () => {
    const user = ref('')
    const setUserName = (username: string) => {
        localStorage.setItem('username', user.value)
        user.value = username
        console.log(user)
    }
    const getUserName = () => {
        const username = getItem('username')
        console.log(username)
        return username
    }

    return {
        setUserName,
        getUserName
    }
})

