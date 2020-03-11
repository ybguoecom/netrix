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

const push2fulfill = (event) =>
{
     event.preventDefault();
     console.log("test")
    
    
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const processUpdate = (event) =>
{
    event.preventDefault();
    
    
    const { target: { orderid: {value: orderid}} } = event;
    console.log(orderid)
    client.put(`orders/${orderid}`,{
         type: "order",
         stage: 3
     }).then((e)=>{
        
        
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

const discount_discription ={
    "A":{ label: "20% Off", rate: .8}, 
    "B":{ label: "10% Off", rate: .9}, 
   "C":{ label: "5% Off", rate: .95}, 
    
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
function OrderControl(props)
{
   console.log("this is in pro", props);
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
        <Form.Control disabled="true" value={props.order_data.customer.email}/>
       
        
      </Form.Group>
     
       <Form.Group>
        <Form.Label>Quote Summary: </Form.Label><br/>
        Quote Total: {props.order_data.meta.display_price.without_tax.formatted}<br/>
        Discount: {discount_discription[props.order_data.discount_tier].label}<br/>
        Final total: {formatter.format(props.order_data.meta.display_price.without_tax.amount*discount_discription[props.order_data.discount_tier].rate/100)}

        </Form.Group>
        {props.order_data.stage == 2 &&
       <Button variant="primary"  type="submit">
          Approve
       </Button>
        }
        
 {props.order_data.stage == 3 &&
       <h3> You have approved this Quote</h3>
 }
        
  
        
      
  </Form>
        )
}


class MyForm extends React.Component {
  constructor(props) {
     super(props);
      
  
     this.state = { orderid: "", order_data: { id:"", customer: {name: "", email: ""}, meta: {display_price: { without_tax: { amount: 0, formatted: "" }}} } }
   
     
  }
     //this.handleSubmit = this.handleSubmit.bind(this);

 componentDidMount() {
   console.log(getParameterByName('id'))
   client.get(`orders/${getParameterByName('id')}`).then((e)=>{  
       
         this.setState({order_data: e.data});
       this.setState({rderid: e.data.id});
  
   })
 }



  render() {
    return (
      <OrderControl order_data={this.state.order_data} />
    )
  }
}


const AboutPage = () => (
  <>
    <SEO title="Moltin | Schedule a demo" />
    <PageTitle>Approving My Quote</PageTitle>

    <div className="max-w-xl mx-auto">
     <MyForm/>
   
    </div>
  </>
)

export default AboutPage
