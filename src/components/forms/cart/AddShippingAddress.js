import { Grid, TextField, Card, CardContent, CardHeader, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";

export default function AddShippingAddress() {
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

    const handleChange = (e) => {
        if (e.target.checked === true) {
            setbillingAddressField(address);
            setbillingState(billingState);
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





    return (
        <Card>
            <CardHeader title="Shipping Address" ></CardHeader>
            <CardContent>
                <Grid container spacing={2} >
                    <Grid item xs={12} xl={4}>
                        <TextField label="address" required value={address} fullWidth type="text" onChange={(e) => setAddress(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="Alternative Phone" required value={phone} fullWidth type="number" onChange={(e) => setPhone(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="Town/City" type="text" required value={city} fullWidth onChange={(e) => setCity(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="State" type="text" required fullWidth value={state} onChange={(e) => setState(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="Zip/Postal Code" required type="number" value={zip} fullWidth onChange={(e) => setZip(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
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
                    <Grid item xs={12} xl={4}>
                        <TextField label="address" required fullWidth type="text" value={billingAddressField} onChange={(e) => setbillingAddressField(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="Town/City" type="text" required fullWidth value={billingCity} onChange={(e) => setbillingCity(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="State" type="text" required fullWidth onChange={(e) => setbillingState(e.target.value)} value={billingState} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <TextField label="Zip/Postal Code" type="number" required fullWidth onChange={(e) => setbillingZip(e.target.value)} value={billingZip} />
                    </Grid>
                    <Grid item xs={12} sm={6} xl={2}>
                        <FormControl fullWidth>
                            <InputLabel id="Country">Country</InputLabel>
                            <Select label="Country" labelId="Country" required onChange={(e) => setbillingCountry(e.target.value)} value={billingCountry} fullWidth>
                                <MenuItem value={"india"}>India</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    )
}