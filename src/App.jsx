import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import Reviewitems from './Reviewitems'
import './App.css'

function App() {
  const isMobile=useMediaQuery({maxWidth: 767})
  const isTablet=useMediaQuery({minWidth: 768, maxWidth:991})
  const isDesktop=useMediaQuery({minWidth:992})
  const [data, setData]=useState([])
  const [state, setState]=useState(null)
  const [count, setCount]=useState(0)
  const [cart, setCart]=useState([])
  const [reviewItems, setReviewItems]=useState(false)
  //const [loading, setLoading]=useState(false)

  //const isLargeDesktop=useMediaQuery({minWidth:1200})
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        //setLoading(true)
        const response=await axios.get('data.json')
        const addID= response.data.map((product, index)=>({
          id: index + 1, 
          sale: product.price,
          qantity: 1,
          ...product
        }))
        console.log((response.data[0].price).toFixed(2))
        console.log(addID)
        setData(addID)
        
      }
      catch (error){
        console.log('failed')
      }
    }
    fetchData()
  },[])
  const addToCart=(product)=>{
    setCart((prevItem)=>{
      const existingItems=prevItem.find((item)=> item.id === product.id);
      if (existingItems) {
        setState(prev=>(prev=== product.id ? null : product.id))
        return [...prevItem]
      }
      setCount(count+1)
      return[...prevItem, product]
    })
    setState(prev=>(prev=== product.id ? null : product.id))
    console.log(product)
  }
  const handleincrement=(id)=>{
    setData(prevData=> prevData.map(newData=> newData.id === id ?
      {...newData, qantity: newData.qantity + 1 }: newData
    ))
    setCart(prev=> prev.map(item=> item.id ===id ? 
      {...item, qantity: item.qantity + 1, sale: item.price * (item.qantity + 1)}: item
    ))
  }
  const handledDecrement=(id, product)=>{
    setData(prevData=> prevData.map(newData=> newData.id===product.id && newData.qantity >= 2?
      {...newData, qantity: newData.qantity - 1}: newData
    ))
    setCart(prev=> prev.map(item=> item.id ===product.id && item.qantity >=2 ? 
      {...item, qantity: item.qantity - 1, sale: item.price * (item.qantity - 1)}: item
    ))
  }
  const handleRemove=(id)=>{
    setCount(n=>n-1)
    setCart(prevItems=>prevItems.filter(items=> items.id!== id))
    setData(prevData=> prevData.map(newData=> newData.id === id ?
      {...newData, qantity: 1 }: newData
    ));
    setState(0);
  }
  const Price=cart.reduce((sum, item)=>sum + Number(item.sale), 0)
  const handleconfirm=()=>{
    setReviewItems(true)
  }
  const handleRetart=()=>{
    setReviewItems(false)
    setCart([])
    setData(prevData=>prevData.map(items=> items.id !== 0 ?
      {...items, qantity: 1 }: newData
    ))
    setCount(0)
    setState(0)
  }
  return (
    <div className='container'>
      <div className="flex-container">
        <h1>Dessert</h1>
        <ul className='card-container'>
          {data.map((product)=>(
            <li key={product.id}  className='product-card'>
              {isMobile && <img src={product.image.mobile}  className='product-image'/>}
              {isTablet && <img src={product.image.tablet}  className='product-image'/>}
              {isDesktop && <img src={product.image.desktop}  className='product-image'/>}
              {state===product.id? (
                <button className='active-btn' >
                  <span className='divicon-decrement' onClick={()=>handledDecrement(product.id, product)}>
                    <svg className='decrement-icon' xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 2"><path className='iconColor' fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                  </span>
                  <span className='Qantity-text'>{product.qantity}</span>
                  <span className='divicon-increment' onClick={()=>handleincrement(product.id, product.price)}>
                    <svg className='increment-icon' xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path className='iconColor'  d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>  
                  </span>
                </button>
              ) : (
                <button className='btn-addCart' onClick={()=>addToCart(product)}>
                  <img src='assets/images/icon-add-to-cart.svg' className='icon-add-to-cart'/>
                  <span className='text-btn'>Add to Cart</span>
                </button>
              )}
              <p className='product-category'>{product.category}</p>
              <p className='product-name'>{product.name}</p>
              <p className='product-price'>${(product.price).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="cartBox">
        <div className="cartBox-content">
          <p className='title-cartBox'>Your Cart ({count})</p>
          {cart && cart.length===0?
            (
              <div className="empty-cart">
                <img src='assets/images/illustration-empty-cart.svg'/>
                <p className='empty-cart-discription'>Your added items will appear here</p>
              </div>
            ): (
              <>
              <ul className='item-container'>
                {cart.map(item=>
                <>
                  <li className='li-container'>
                    <div className='items-cart'>
                      <div className='item-name' key={item.id}>{item.name}</div> 
                      <div className='item-quantityDiv'>
                        <div className="item-Qrt">{item.qantity}x</div>
                        <div className="item-price">@ ${item.price.toFixed(2)}</div>
                        <div className='item-sale'> ${item.sale.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className='remove-btn' onClick={()     =>handleRemove(item.id)}>
                      <svg  xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path className='remove-icon' fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                    </div>
                  </li> 
                  <div className='line'></div>
                </>
                )}
              </ul>
              <div className='div-totalItem'>
                <div className="text-total">Order Total</div>
                <div className='totel-item'>${Price.toFixed(2)}</div>
              </div>
              <div className="div-carbon-neutral">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/><path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/></svg>
                <span className='text-carbon-neutral'>This is a <span className='bold-text'>carbon-neutral </span>delivery </span>
              </div>
              <div className='confirm-order-btn' onClick={()=>handleconfirm(cart)}>
                Confirm Order
              </div>
              {reviewItems && <div className='ReviewItemDiv'><Reviewitems onSmash={handleRetart} items={cart}/></div>}
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}
export default App
