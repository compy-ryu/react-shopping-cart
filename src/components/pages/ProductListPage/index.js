import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UNIT } from '../../../constants/appInfo';
import PALETTE from '../../../constants/palette';
import { addToCart } from '../../../redux/Cart/actions';
import { getProducts, resetProducts } from '../../../redux/Products/actions';
import { resetErrorMessage } from '../../../redux/Message/actions';
import Button from '../../common/Button';
import ShoppingCart from '../../common/Icon/ShoppingCart';
import Modal from '../../common/Modal';
import Main from '../../Main';
import Product from '../../shared/Product';
import Snackbar from '../../common/Snackbar';
import * as Styled from './style';

const ProductListPage = () => {
  const { products, cart, errorMessage } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());

    return () => {
      dispatch(resetProducts());
    };
  }, []);

  const onAddToCart = ({ target }) => {
    const selectedProductId = target.closest('li[data-product-id]').dataset.productId;

    if (cart.findIndex((product) => product.id === selectedProductId) >= 0) return;

    const selectedProduct = products.find((product) => product.id === selectedProductId);
    dispatch(addToCart({ ...selectedProduct, amount: 1, isChecked: false }));
  };

  const onCloseErrorMessageModal = () => {
    dispatch(resetErrorMessage());
  };

  return (
    <Main>
      <Styled.ProductList>
        {products.map((product) => (
          <li data-product-id={product.id} key={product.id}>
            <Product
              product={product}
              productDetail={{
                text: `${Number(product.price).toLocaleString()} ${UNIT.MONEY}`,
                fontSize: '1.5rem',
              }}
              direction="column"
              size="17.5rem"
            >
              {!cart.some(({ id }) => product.id === id) ? (
                <Button hoverAnimation="scale" backgroundColor="transparent" onClick={onAddToCart}>
                  <ShoppingCart width="2rem" color={PALETTE.BLACK} />
                </Button>
              ) : (
                <Button backgroundColor="transparent" disabled="disabled" cursor="default">
                  <ShoppingCart width="2rem" color={PALETTE.WHITE} />
                </Button>
              )}
            </Product>
          </li>
        ))}
      </Styled.ProductList>
      {errorMessage && <Modal onClose={onCloseErrorMessageModal}>{errorMessage}</Modal>}
    </Main>
  );
};

export default React.memo(ProductListPage);
