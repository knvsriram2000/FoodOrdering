import { useContext, useState,React, Fragment, useEffect } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
  const [isCheckout, setIsCheckout]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [didSubmit,setDidSubmit]=useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `${Math.abs(cartCtx.totalAmount).toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  
  useEffect(()=>{
    if (!hasItems){
      setIsCheckout(false);
    }
  },[hasItems]);
  
  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler=()=>{
    setIsCheckout(true);
  };

  const submitOrderHandler=async (userdata)=>{
    setIsSubmitting(true);
   await fetch('https://food-cart-22d4f-default-rtdb.firebaseio.com/orders.json',
    {
      method:'POST',
      body:JSON.stringify({
        user:userdata,
        orderedItems:cartCtx.items
      }),
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  const modalActions=<div className={classes.actions}>
  <button className={classes['button--alt']} onClick={props.onClose}>
    Close
  </button>
  {hasItems && <button className={classes.button} onClick={orderHandler }>Order</button>}
</div>;
  const cartModalContent=(<Fragment>
    {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout &&hasItems && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose}/>}
      {!isCheckout && modalActions}
  </Fragment>);
  const isSubmittingModalContent=<p> Sending Order data ...</p>;
  const didSubmitModalContent=<Fragment>
      <p> Successfully sent the order !</p>
      <div className={classes.actions}>
  <button className={classes.button} onClick={props.onClose}>
    Close
  </button>
</div>
  </Fragment>;
  
  return (
    <Modal onClose={props.onClose}>
         {!isSubmitting && !didSubmit && cartModalContent}
         {isSubmitting && isSubmittingModalContent}
         {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
