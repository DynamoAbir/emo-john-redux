import { createSlice } from "@reduxjs/toolkit";
import { products } from "../../data/products";

type TProduct = {
    id: string;
    category: string;
    name: string;
    seller: string;
    price: number;
    stock: number;
    ratings: number;
    ratingsCount: number;
    img: string;
    shipping: number;
    quantity: number;
};
type TInitialState = {
    products: TProduct[];
    selectedItems: number;
    totalPrice: number;
    tax: number;
    taxRate: number;
    grandTotal: number;
};


const initialState:TInitialState={
    products:[],
    selectedItems:0,
    totalPrice:0,
    tax:0,
    taxRate:0.1,
    grandTotal:0

}


const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            
            const isExist=state.products.find((product:TProduct)=>product.id===action.payload.id)
            if(!isExist){
                state.products.push({...action.payload,quantity:1})
            }
            state.selectedItems=selectSelectedProduct(state)
            state.totalPrice=selectedTotalPrice(state)
            state.tax=selectTax(state)
            state.grandTotal=selectedGrandTotal(state)
        },
        updateQuantity:(state:any,action)=>{
            const products=state.products.map((product:any)=>{
                if(product.id===action.payload.id){
                    if(action.payload.type==="increment"){
                        product.quantity+=1
                    }
                    else if(action.payload.type==="decrement"){
                        product.quantity-=1
                    }
                }
                return product 
            })
            state.products=products.filter((product:TProduct)=>product.quantity>0)
            state.selectedItems=selectSelectedProduct(state)
            state.totalPrice=selectedTotalPrice(state)
            state.tax=selectTax(state)
            state.grandTotal=selectedGrandTotal(state)
        },
        removeFromCart:(state,acton)=>{
            state.products=state.products.filter((product:TProduct)=>product.id!==acton.payload.id)
            state.selectedItems=selectSelectedProduct(state)
            state.totalPrice=selectedTotalPrice(state)
            state.tax=selectTax(state)
            state.grandTotal=selectedGrandTotal(state)
        }
    }
})


export const selectSelectedProduct = (state: TInitialState): number => {
    // Initialize total to 0
    return state.products.reduce((total: number, product: TProduct) => {
        // Add the quantity of each product to the total
        return total + product.quantity;
    }, 0); // Start the reduction with 0
};

export const selectedTotalPrice = (state: TInitialState): number => {
    return state.products.reduce((total: number, product: TProduct) => {
        return total + product.quantity * product.price;
    }, 0);
};

export const selectTax=(state:TInitialState)=>selectedTotalPrice(state)*state.taxRate

export const selectedGrandTotal = (state: TInitialState): number => {
    return selectedTotalPrice(state) + selectedTotalPrice(state) + selectTax(state);
};

export const {addToCart,updateQuantity,removeFromCart}=cartSlice.actions
export default cartSlice.reducer