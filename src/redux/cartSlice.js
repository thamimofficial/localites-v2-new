import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  cartCount: 0,
  totalAmount: 0,
  stallId: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart: (state, action) => {
      const { items, stallId } = action.payload;
      const totalAmountVal = items.reduce((total, item) => total + item.totalPrice, 0);
      state.items = items;
      state.cartCount = items.length;
      state.totalAmount = totalAmountVal;
      state.stallId = stallId;
    },
    addCart: (state, action) => {
      const { stallId, item } = action.payload;
      let items = [...state.items];
      let isProdExists = false;

      if (state.stallId > 0 && stallId !== state.stallId) {
        items = []; // If stall changed then previous stall items not be considered
      }

      items = items.map((i) => {
        if ((item.isCustomized && i.uid === item.uid) || (!item.isCustomized && i.id === item.id)) {
          i.quantity += 1;
          i.modifierAmt = i.modifierAmt > 0 ? i.quantity * (i.modifierAmt / (i.quantity - 1)) : 0; // 🆕 Recalculate modifier
          i.totalPrice = i.quantity * i.price + i.modifierAmt;
          isProdExists = true;
        }
        return i;
      });

      if (!isProdExists) {
        item.quantity = 1;
        item.modifierAmt = item.modifierAmt > 0 ? item.quantity * item.modifierAmt : 0;
        item.totalPrice = item.quantity * item.price + item.modifierAmt;
        items.push(item);
      }

      const totalAmount = items.reduce((total, i) => total + i.totalPrice, 0);
      const cartCount = items.reduce((total, i) => total + i.quantity, 0);

      state.items = items;
      state.cartCount = cartCount;
      state.totalAmount = totalAmount;
      state.stallId = stallId;
    },
    reduceCart: (state, action) => {
      const { stallId, item } = action.payload;
      let items = [...state.items];
      let removeItemId = 0;
      let removeCusItemUid = "";

      items = items.map((i) => {
        if ((item.isCustomized && i.uid === item.uid) || (!item.isCustomized && i.id === item.id)) {
          i.quantity -= 1;
          if (i.quantity <= 0) {
            if (item.isCustomized) {
              removeCusItemUid = item.uid;
            } else {
              removeItemId = item.id;
            }
          } else {
            // 🆕 Recalculate modifierAmt and totalPrice after decrement
            i.modifierAmt = i.modifierAmt > 0 ? i.quantity * (i.modifierAmt / (i.quantity + 1)) : 0;
            i.totalPrice = i.quantity * i.price + i.modifierAmt;
          }
        }
        return i;
      });

      // 🆕 Remove item if quantity is zero
      if (removeItemId > 0) {
        items = items.filter((i) => i.id !== removeItemId);
      }
      if (removeCusItemUid.length > 0) {
        items = items.filter((i) => i.uid !== removeCusItemUid);
      }

      // 🆕 Recalculate totals
      const totalAmount = items.reduce((total, i) => total + i.totalPrice, 0);
      const cartCount = items.reduce((total, i) => total + i.quantity, 0);

      state.items = items;
      state.cartCount = cartCount;
      state.totalAmount = totalAmount;
      state.stallId = stallId;
    },
    clearCart: (state) => {
      state.items = [];
      state.cartCount = 0;
      state.totalAmount = 0;
      state.stallId = 0;
    },
  },
});

export const { updateCart, addCart, reduceCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
