import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Checkbox } from 'react-bootstrap';

import SEO from '../components/SEO'
import PageTitle from '../components/PageTitle'

const { MoltinClient } = require('@moltin/request')
// import { MoltinClient } from '@moltin/request'

const client = new MoltinClient({
  client_id: 'FROBlbER3KeTvXhxDcZW3GUUqSNzHCAQA7mciE1gwb',
  client_secret: 'hmykgdikqP2CZlrZd1VoB2Mhg4uCXrjfbdwL3T3KPG'
})

const client_b = new MoltinClient({
  client_id: 'KNf3VsmGp1Lzy3dFnlBVQIC85E5bAfVVGRlCa6EGVV',
  client_secret: 'B7piciZf90mPsfqBvA5brNjW7IpC69kCLyordAYgFJ'
})

const discount_credentials ={
    "A":"6fd1166c-a65a-47e6-ae13-110a454220f5", 
    "B":"ce4121ca-7b94-4901-95a8-b6aec3a76d33",
    "C":"5e0eaa27-07f3-4418-a7e7-d86f0a6f7343",
}

const shipping = {
       "first_name": "John",
       "last_name": "Doe",
       "company_name": "Moltin",
       "phone_number": "(555) 555-1234",
       "line_1": "2nd Floor British India House",
       "line_2": "15 Carliol Square",
       "city": "Newcastle upon Tyne",
       "postcode": "NE1 6UF",
       "county": "Tyne & Wear",
       "country": "UK",
       "instructions": "Leave in porch"
};


const billing =  {
       "first_name": "John",
       "last_name": "Doe",
       "company_name": "Moltin",
       "line_1": "2nd Floor British India House",
       "line_2": "15 Carliol Square",
       "city": "Newcastle upon Tyne",
       "postcode": "NE1 6UF",
       "county": "Tyne & Wear",
       "country": "UK"
     };


async function push2fulfill(props)
{
     
      
    const { order_item, order_data: { id,  discount_tier, stage, customer, shipping_address, billing_address } }  = props;
     console.log("push",props)
    
  


   for(let i = 0;i<order_item.items.length; i++)
   {
           
           const ecom_id = await client_b.get(`products?filter=eq(sku,${order_item.items[i].sku})`);
           console.log("ecom",ecom_id)
           const cart = await client_b.post(`carts/quote_${id}/items`,{
              type: 'cart_item',
              id: ecom_id.data[0].id,
              quantity: order_item.items[i].quantity
             })
    }
      
    
    const promocode = await client_b.post(`promotions/${discount_credentials[discount_tier]}/codes`,{ type: "promotion_codes",  "codes":[{"code":"quote_"+id, "uses": 1 }]})
     console.log(promocode)
    
      const cart = await client_b.post(`carts/quote_${id}/items`,{
      type: 'promotion_item',
      code: "quote_"+id,
      
     })
      const created_order = await client_b.post(`carts/quote_${id}/checkout`,{
      customer, billing_address, shipping_address, reference_quote: id
  })
   
     client.put(`orders/${id}`,{
         type: "order",
         ecom_order: created_order.data.id,
         stage: 4
     })
                                    
 
     

                                                                                           
}

const processUpdate = (event) =>
{
    event.preventDefault();
    const { target: { orderid: {value: orderid}, discount_tier: {value: discount_tier} } } = event;

    client.put(`orders/${orderid}`,{
         type: "order",
         discount_tier,
         stage: 2
     })
              
    /*
     if (order_acceptance == "Accepted"){
      
         client.get(`orders/${orderid}?include=items`).then((e)=>{
             console.log(e)
             client_b.get(`products?filter=eq(sku,${e.included.items[0].sku}):eq(status,draft)`).then((e)=> {
                const product_info = e.data[0];
                 console.log(product_info)
                 client_b.post('products', {
                       ...product_info,
                       sku: orderid,
                       slug: orderid,
                       stock: 1,
                     product_config: ""
                }).then((e)=>{
                     client_b.post(`products/${e.data.id}/relationships/main-image`, {
                         type: 'main_image',
                         id: product_info.relationships.main_image.data.id
                     
                 })
             
         })
             })
             
             })
         
         return;
     client.post(`orders/${orderid}/payments`,{
         gateway: "manual",
         method: "authorize"
     }).then((e)=>{ 
     client.post(`orders/${orderid}/transactions/${e.data.id}/capture`).then((e)=>{
      
     })
})
}
 */   
    
}

const stage_discription ={
    "1":"Pending", 
    "2":"Quote Pending Review",
    "3":"Quote Approved",
    "4":"Sent for Processing",
    "5":"Order Completed",
}




function OrderControl(props)
{
   console.log(props);
    if(props.order_data.id === '')
    
        return <></>;
        
   // const { id, customer: cusinfo } = props.order_data;


   
    return(
        
      <Form method="post" onSubmit={processUpdate}>
      <Form.Group controlId="formBasicName">
      <Form.Label>Order ID</Form.Label>
      <Form.Control disabled="true" name="orderid" value={props.order_data.id}/> 
         <Form.Label>Customer Name</Form.Label>
      <Form.Control disabled="true" value={props.order_data.customer.name}/>
        <Form.Label>Customer Email</Form.Label>
        <Form.Control disabled="true" value={props.order_data.customer.email}/><br/><br/>
        <Form.Label>Order Status: <span style={{"background-color":"yellow"}}>{stage_discription[props.order_data.stage]}</span></Form.Label><br/><br/>
       {props.order_data.stage == 4 &&
       <Form.Label>Order ID: {props.order_data.ecom_order}</Form.Label>
       }
      </Form.Group>
     
     {props.order_data.stage == 1 &&
       <Form.Group>
        <Form.Label>Quote Discount:</Form.Label>
         <Form.Control as="select" name="discount_tier" defaultValue={props.order_data.discount_tier}  >
           <option value="A">Tier A - 20% off entire order</option>
           <option value="B">Tier B - 10% off entire order</option>
           <option value="C">Tier C- 5% off entire order</option>
        </Form.Control>
        </Form.Group>
        }
        
       {props.order_data.stage == 3 &&
       <Form.Group>
        <Form.Label>Quote Discount:</Form.Label>
         <Form.Control as="select" name="discount_tier" disabled defaultValue={props.order_data.discount_tier} >
           <option value="A">Tier A - 20% off entire order</option>
           <option value="B">Tier B - 10% off entire order</option>
           <option value="C">Tier C- 5% off entire order</option>
        </Form.Control>
        </Form.Group>
        }
        
        
      
        {props.order_data.stage == 1 &&
       <Button variant="primary" type="submit">
          Submit Quote to Customer
       </Button>
        }
        
         {props.order_data.stage == 3 &&
       <Button variant="primary" type="button" onClick={() => push2fulfill(props)}>
          Push to fulfillment
       </Button>
          }

      
  </Form>
        )
}


class MyForm extends React.Component {
  constructor(props) {
     super(props);
     this.state = { orderid: "Enter your order ID", order_data: { id:"", customer: {name: "", email: ""} }, order_items: [] }
     this.handleSubmit = this.handleSubmit.bind(this);


  
  }
    

    
    myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
    

  
  handleSubmit(event) {
    
    event.preventDefault();
      
      client.get(`orders/${this.state.orderid}?include=items`).then((e)=>{ this.setState({order_data: e.data});   this.setState({order_items: e.included})  })
  }

  render() {
    return (
        <>
     <Form onSubmit={this.handleSubmit}>
      <Form.Group controlId="formBasicName">
      <Form.Control name="orderid" placeholder={this.state.orderid} onChange={this.myChangeHandler}/> 
      </Form.Group>
       
       <Button variant="primary" type="submit">
          Search
       </Button>
        
      
  </Form>
    
      <OrderControl order_data={this.state.order_data} order_item={this.state.order_items}/>
  </>
   
    );
  }
}


const AboutPage = () => (
  <>
    <SEO title="Moltin | Schedule a demo" />
    <PageTitle>Mini QMS</PageTitle>

    <div className="max-w-xl mx-auto">
     <MyForm/>
   
    </div>
  </>
)

export default AboutPage
