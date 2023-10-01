import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useToast} from "vue-toastification";
import {useApi} from "@/helpers/axios";

const toast = useToast()

export const useProductStore = defineStore('product', () => {
    const products = ref([])
    const productLabels = ref<string[]>([])
    const productCount = ref<number[]>([])

    const addProduct = async (product: any, callback: any = null): Promise<void> => {
        const response = await useApi.post("/products/", {
            title: product.title,
            price: product.price,
            count_in_box: product.count_in_box
        })
        toast.success("Yangi mahsulot qo'shildi")
        if (callback)
            callback();
    }

    const editProduct = async (product: any, id: Number, callback: any = null) => {
        const response = await useApi.put(`/products/${id}/`, {
            title: product.title,
            price: product.price,
            count_in_box: product.count_in_box
        })
        toast.success("Mahsulot yangilandi")
        if (callback)
            callback();
    }

    const getProductAll = async (search: string, currentPage: number, pageSize: number, ) => {
        const response = await useApi.get(`/products/?search=${search}&page=${currentPage}&page_size=${pageSize}`);
        return response
    }

    return {
        products,
        productLabels,
        productCount,

        addProduct,
        getProductAll,
        editProduct,
    }
})