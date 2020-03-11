import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Checkbox } from 'react-bootstrap';

import SEO from '../components/SEO'
import PageTitle from '../components/PageTitle'
import { MoltinContext } from '../context'
import useLocalStorage from '../context/useLocalStorage'


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


function SYDForm() {
  const { moltin_2 } = useContext(MoltinContext);

  return(
    <MyForm selection={moltin_2}/>
  )
}


class MyForm extends React.Component {
  constructor(props) {
     super(props);
     this.state = { name: "enter your name", email: "enter your email", deal_type: "private", product: "", product_options: [], quantity: 50}
     this.handleSubmit = this.handleSubmit.bind(this);
  
  }
    
  componentDidMount() {
      let client = this.props.selection;
      client.get('products').then((e)=>{
          this.setState({
            product_options: e.data,
            product: e.data[0].id
        });
      })
  }
    
    myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
    

  
  handleSubmit(event) {
    
    event.preventDefault();

     let client = this.props.selection;
      client.post('carts/123456/items',{
      type: 'cart_item',
      id: this.state.product,
      quantity: parseInt(this.state.quantity)
    }).then((e)=>{
          client.post(`carts/123456/checkout`,{
      customer: { email: this.state.email, name: this.state.name},
      discount_tier:"C",
      stage:  parseInt(1),
      billing_address: billing,
      shipping_address: shipping
          }).then((e)=>{
          client.delete('carts/123456/')
          alert(`Your quote has been successfully submitted. You reference ID is ${e.data.id}`);
      }
       )
          
          
  })
  }

  render() {
    return (
     <Form onSubmit={this.handleSubmit}>
      <Form.Group controlId="formBasicName">
      <Form.Label>Name</Form.Label>
      <Form.Control name="name" placeholder={this.state.name} onChange={this.myChangeHandler}/> 
      </Form.Group>
       
      <Form.Group controlId="formBasicEmail">
     <Form.Label>Email address</Form.Label>
    <Form.Control name="email" type="email" placeholder={this.state.email} onChange={this.myChangeHandler} />

  </Form.Group>
        
    <Form.Group>
    <Form.Label>Type</Form.Label>
    <div key={`default-radio`} name="deal_type" className="mb-3">
      <Form.Check 
        type="radio"
        id="deal_type"
        name="deal_type"
        value="private"
        label="Private"
        onChange={this.myChangeHandler}
      />
      <Form.Check 
         type="radio"
        id="deal_type"
        name="deal_type"
        value="business"
        label="Business"
        onChange={this.myChangeHandler}
      />
    </div>
     
</Form.Group>

  <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Select Product</Form.Label>
    <Form.Control as="select" name="product" onChange={this.myChangeHandler}>
     {this.state.product_options.map((value, index) => {
        return <option value={value.id} key={value.id}>UPC: {value.upc} | Part #: {value.part_number} | SKU: {value.sku} - {value.name}(retail: { value.meta.display_price.without_tax.formatted}) </option>
      })} 
      </Form.Control>
    </Form.Group>

  <Form.Group controlId="formBasicName">
      <Form.Label>Quantity</Form.Label>
      <Form.Control name="quantity" placeholder={this.state.quantity} onChange={this.myChangeHandler}/> 
      </Form.Group>



  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
    );
  }
}


const AboutPage = () => (
  <>
    <SEO title="Moltin | Schedule a demo" />
    <PageTitle>Get a Quote</PageTitle>

    <div className="max-w-xl mx-auto">
     <SYDForm></SYDForm>
    </div>
  </>
)

export default AboutPage
