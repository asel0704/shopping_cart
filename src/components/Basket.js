import {styled} from "@mui/material";
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { deleteProduct, localStorageGet, counterPlus,counterMinus } from "../store/actions/shopActions";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import produce from "immer";


const Wrapper = styled('div')`
  position: fixed;
  right: 20px;
  top: 80px;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: .2s;
`


const BasketItemWrapper = styled('div')`
    background:#fff;
    margin-bottom:12px;
    margin-top:12px;
    margin-left:auto;
    margin-right:auto;
    padding-bottom:25px;
    button{
        font-size: 24px;
        color: #FFFFFF;
        line-height:22px;
        background: #e8e6e3;
        border-radius: 200px;
        padding: 5px 20px;
        color:#000;
        outline:none;
        border:none;
    }
` 

const BasketItemInfo = styled('div')`
    display:flex;
    width:100%;
    border-bottom:2px solid #e8e6e3;  
    padding-bottom:12px;
`;

const BasketCounter = styled('div')`
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    margin-top:20px;
    button{
        font-size:20px;
    }
`

const BasketItemImage = styled('div')`
    text-align:center;
    margin-right:30px;
    img{
        width:80px; 
    }
`

const CloseIconStyle = styled(CloseIcon)`
    margin-left:345px;
    margin-top:15px;
    padding-bottom:10px;
    @media (max-width:647px){
        margin-left:90%!important;
    }
`

const BasketItemText = styled('div')`
    font-weight:700;
    font-size:20px;
    margin-top:7px;
`

const BasketItemCategory = styled('div')`
    color: grey;
    font-weight:500;
    font-size:14px;
`
const BasketItemPrice = styled('div')`
    font-weight:700;
    font-size:20px;
` 

const BasketItemResults = styled('div')`
    width:85%;
    margin:0 auto;
    
`;

const BasketItemCount = styled('div')`
    font-weight:500;
    border-bottom:2px solid #e8e6e3;  
    padding-top:5px;
    padding-bottom:12px;
    font-size:18    px;
`;

const BasketItemFooter = styled('div')`
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top:12px;
    padding-bottom:20px;
`;

const BasketItemFooterText= styled('div')`
    font-weight:700;
    font-size:24px;
`

const BasketItemFooterPrice = styled('div')`
    font-size:20px;
`
const Block = styled('div')`
    @media (max-width:647px){
        width:100%!important;
    }
`
const Icon = styled('div')`
   
`
const OverallInfo = styled('div')`
    font-size:30px;
    font-weight:700;
    width:85%;
    margin:0 auto;
    margin-top:12px;
`


export function BasketItem({ product }) {   
    const dispatch = useDispatch();

    const deleteProductHandler  = () => {
        dispatch(deleteProduct(product));
    } 

    return (
        <BasketItemWrapper>
            <div style={{width:'85%', margin:'0 auto', paddingTop:24}}>
            <BasketItemInfo>
                <BasketItemImage >
                    <img src={product.image} alt="" />
                </BasketItemImage>
                <div>
                    <BasketItemText>   
                        {product.title}
                    </BasketItemText>  
                    <BasketItemCategory>
                        {
                            product.category
                        }
                    </BasketItemCategory>
                </div>  
            </BasketItemInfo>
            <BasketCounter>
                <BasketItemPrice>
                    {(product.price * product.counter).toFixed(2)} $
                </BasketItemPrice>
                <div style={{display:"flex", alignItems:"center"}}>
                    <button onClick={() => dispatch(counterMinus(product))} style={{marginRight:10}}>
                        -
                    </button>
                    <div style={{marginRight:10}}>
                        {product.counter}
                    </div>
                    <button onClick={() => dispatch(counterPlus(product))}>
                        +
                    </button>
                </div>
            </BasketCounter>
            </div>
        </BasketItemWrapper>
    )
}

export function Basket() {
    const dispatch = useDispatch();
    const basket = useSelector((state) => state.shop.basket);

    const [basketData, setBasketData] = useState(basket);

    useEffect(() => {
        setBasketData(basket);
    }, [basket])
 

    useEffect(() => {
        if ((localStorage.getItem('basket'))){
            setBasketData(JSON.parse(localStorage.getItem('basket')));
            dispatch(localStorageGet(JSON.parse(localStorage.getItem('basket'))))
        }
    }, [])

    const [isDrawerOpen, setIsDrawerOpen] = useState(false); 

    const findTotal = () => {
        let total = 0;
        basketData.map(item => (
            total += item.price * item.counter
        ))
        return total.toFixed(2)
    }

    return (
        <Wrapper>
            <ShoppingCartIcon onClick={() => setIsDrawerOpen(true)} fontSize="large" color="primary"  />
            <Drawer
                open={isDrawerOpen}
                anchor="right"
                onClose={() => setIsDrawerOpen(false)}
            >
                <Block style={{width:400, background:"#e8e6e3",height:'100%'}}>
                    <Icon style={{borderBottom:"2px solid lightgrey", position:"relative"}}>
                        <CloseIconStyle onClick={() => setIsDrawerOpen(false)} fontSize="large" color="primary"  />
                    </Icon>
                    <OverallInfo>{basketData.length} products for {findTotal() } $</OverallInfo>
                    {  
                        basketData.map((product) => (
                            <BasketItem product={product} key={product.id} />
                        ))
                    }
                    <div style={{background:"#fff"}}>
                    <BasketItemResults>
                        <BasketItemCount>
                            {basketData.length} products   
                        </BasketItemCount>  
                        <BasketItemFooter>
                            <BasketItemFooterText>
                                Total price
                            </BasketItemFooterText>
                            <BasketItemFooterPrice>
                                {findTotal() } $
                            </BasketItemFooterPrice>
                        </BasketItemFooter>  
                    </BasketItemResults>   
                    </div>
                </Block>
            </Drawer>
        </Wrapper>
    )
}
