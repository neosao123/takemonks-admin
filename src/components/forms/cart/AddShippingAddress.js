import { Grid, TextField, Card, CardContent, CardHeader, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, Box, Autocomplete, Button } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCartItems, setShipping, setTotalCart, setSubtotal, } from "src/redux/slices/settings";
import * as api from "src/services";


export default function AddShippingAddress() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchparams] = useSearchParams();
    const navigate = useNavigate();
    const searchParam = searchparams.get("search")
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [zip, setZip] = useState("")
    const [phone, setPhone] = useState("")
    const [billingAddressField, setbillingAddressField] = useState("");
    const [billingCity, setbillingCity] = useState("");
    const [billingState, setbillingState] = useState("");
    const [billingZip, setbillingZip] = useState("");
    const [billingCountry, setbillingCountry] = useState("");
    const [userData, setUserData] = useState([]);
    const [option, setOption] = useState([]);
    const [customer, setCustomer] = useState(null);
    const { cartItems, shipping, subtotal, total, amcsItems } = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        if (e.target.checked === true) {
            setbillingAddressField(address);
            setbillingState(state);
            setbillingZip(zip);
            setbillingCountry(country);
            setbillingCity(city);
        }
        else {
            setbillingAddressField("");
            setbillingState("");
            setbillingCity("");
            setbillingCountry("");
            setbillingZip("")
        }
    }
    const Checkout = async () => {
        const newCartitems = cartItems?.map((el) => {
            let obj = {
                _id: el._id,
                producttype: el.producttype,
                color: el.color,
                cover: el.cover,
                name: el.name,
                price: el.price,
                priceSale: el.priceSale,
                quantity: el.quantity,
                size: el.size,
                subTotal: el.subTotal,
                sku: el.sku,
                durationType: el.durationType,
                durationCount: el.durationCount,
                amcProductId: el.amcProductId
            }
            return obj;
        })

        console.log("cartitems:", newCartitems)

        let obj = {
            paymentMethod: "COD",
            subTotal: subtotal,
            total: total,
            shipping: shipping,
            discount: 0,
            basePrice: total,
            currency: "₹",
            status: "pending",
            items: [...newCartitems],
            amcsItems: [...amcsItems],
            user: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: phone,
                avatar: "",
                address: address,
                city: city,
                state: state,
                country: country,
                zip: zip,
                billingAddressField: billingAddressField,
                billingCity: billingCity,
                billingCountry: billingCountry,
                billingState: billingState,
                billingZip: billingZip
            }
        }

        api.placeOrder(obj)
            .then((res) => {
                if (res.data.success === true) {
                    toast.success(res.data.message)
                }
            })
            .then(() => {
                setCustomer(null),
                    setCountry(""),
                    setState(""),
                    setCity(""),
                    setPhone(""),
                    setAddress(""),
                    setZip(""),
                    setbillingAddressField("");
                setbillingState("");
                setbillingCity("");
                setbillingCountry("");
                setbillingZip("");
                dispatch(setCartItems([]));
                dispatch(setShipping(0));
                dispatch(setTotalCart(0));
                dispatch(setSubtotal(0))
            })
            .then(() => {
                navigate("/orders")
            })
            .catch((error) => {
                console.log(err)
            })
    }

    useEffect(() => {
        api.getCustomerList()
            .then((res) => {
                console.log(res)
                setUserData(res.data)
            })
            .catch((err) => {
                console.log("err:", err)
            })
    }, [])

    const handleChangeSelect = (event, newvalue) => {
        setCustomer(newvalue)
    }



    return (
        <Card>
            <CardHeader title="Customer Details"></CardHeader>
            <CardContent>
                {/* <FormControl fullWidth>
                    <InputLabel id="customer">Customer</InputLabel>
                    <Select label="Customer" required labelId="customer" fullWidth onChange={(e) => setCountry(e.target.value)}>
                        {
                            userData?.map((el) => {
                                return <MenuItem value={el._id} key={el._id} >{el.fullName}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl> */}
                <Autocomplete
                    id="grouped-demo"
                    options={userData}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.fullName + "          " + option.phone}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Customers" />}
                    onChange={handleChangeSelect}
                />
            </CardContent>
            <CardHeader title="Shipping Address" ></CardHeader>
            <CardContent>
                <Grid container spacing={2} >
                    <Grid item xs={12} xl={12}>
                        <TextField label="address" required value={address} fullWidth type="text" onChange={(e) => setAddress(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="Alternative Phone" required value={phone} fullWidth type="number" onChange={(e) => setPhone(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="Town/City" type="text" required value={city} fullWidth onChange={(e) => setCity(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="State" type="text" required fullWidth value={state} onChange={(e) => setState(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="Zip/Postal Code" required type="number" value={zip} fullWidth onChange={(e) => setZip(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <FormControl fullWidth>
                            <InputLabel id="Country">Country</InputLabel>
                            <Select label="Country" required labelId="Country" fullWidth value={country} onChange={(e) => setCountry(e.target.value)}>
                                <MenuItem value={"india"}>India</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
            </CardContent>
            <CardHeader title="Billing Address"></CardHeader>
            <CardContent>
                {/* <span><input type="checkbox" onChange={handleChange} />Billing Address is same as Shipping Address</span> */}
                <FormControlLabel control={<Checkbox onChange={handleChange} />} label="Billing Address is same as Shipping Address" />
                <Grid container spacing={2} >
                    <Grid item xs={12} xl={12}>
                        <TextField label="address" required fullWidth type="text" value={billingAddressField} onChange={(e) => setbillingAddressField(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="Town/City" type="text" required fullWidth value={billingCity} onChange={(e) => setbillingCity(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="State" type="text" required fullWidth onChange={(e) => setbillingState(e.target.value)} value={billingState} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <TextField label="Zip/Postal Code" type="number" required fullWidth onChange={(e) => setbillingZip(e.target.value)} value={billingZip} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={6}>
                        <FormControl fullWidth>
                            <InputLabel id="Country">Country</InputLabel>
                            <Select label="Country" labelId="Country" required onChange={(e) => setbillingCountry(e.target.value)} value={billingCountry} fullWidth>
                                <MenuItem value={"india"}>India</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
            </CardContent>
            <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={Checkout} sx={{ color: "white", backgroundColor: "green", border: "none" }}>Checkout</Button>
            </CardContent>
        </Card>
    )
}