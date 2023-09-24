import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useToast} from "vue-toastification";
import {useApi} from "@/helpers/axios";

const toast = useToast()

export const useProductStore = defineStore('product', () => {
    const products = ref([])
    const productLabels = ref<string[]>([])
    const productCount = ref<number[]>([])
    const slug = ref<string>('product')

    const addProduct = async (product: any, callback: any = null): Promise<void> => {
        const response = await useApi.post("/products/", {
            title: product.title,
            price: product.price,
            count_in_box: product.count_in_box
        })
        toast.success("Yangi mahsulot qo'shildi")
        if (callback)
            callback(response);
    }

    const editProduct = async (product: any, id: Number, callback: any = null) => {
        const response = await useApi.put(`/products/${id}/`, {
            title: product.title,
            price: product.price,
            count_in_box: product.count_in_box
        })
        toast.info("Mahsulot yangilandi")
        if (callback)
            callback(response);
    }

    const editStatusProduct = async (product: any): Promise<void> => {

        toast.success("Turkum xarakteristikasi o'zgartirildi")
    }

    const getProduct = async (): Promise<void> => {

    }

    const getProductAll = async (search: string, currentPage: number, pageSize: number, ) => {
        const response = await useApi.get(`/products/?search=${search}&page=${currentPage}&page_size=${pageSize}`);
        return response
    }

    const removeProduct = async (id: number): Promise<void> => {

        toast.warning("Mahsulot o'chirildi")
    }

    const getOneProduct = async (id: number) => {

    }

    return {
        products,
        productLabels,
        productCount,

        addProduct,
        getProduct,
        getProductAll,
        editProduct,
        getOneProduct,
        removeProduct,
        editStatusProduct,
    }
})