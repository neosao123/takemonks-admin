import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
// components
import {
    HeaderBreadcrumbs,
    Table,
    ProductRow,
    DeleteDialog,
    Toolbar,
    ProductCard,
    Page,
    AddShippingAddress
} from "src/components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useSelector } from "react-redux";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "name", label: "product", alignRight: false },
    { id: "createdAt", label: "created-at", alignRight: false, sort: true },
    { id: "inventoryType", label: "status", alignRight: false, sort: true },
    { id: "price", label: "price", alignRight: false, sort: true },
    { id: "quantity", label: "quantity", alignRight: false },
    { id: "", label: "actions", alignRight: true },
];

// ----------------------------------------------------------------------
export default function CartData() {

    const [searchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const { t } = useTranslation("user");
    const { data, isLoading } = useQuery(
        ["user", pageParam, searchParam],
        () => api.getUsers(+pageParam || 1, searchParam || ""),
        {
            onError: (err) => {
                toast.error(err.response.data.message || "Something went wrong!");
            },
        }
    );

    const cartdata = useSelector((state) => {
        return state.settings.cartItems
    })

    const handleClickOpen = () => {

    }

    return (
        <>
            <Page title={`Users | ${process.env.REACT_APP_DOMAIN_NAME}`}>
                <Toolbar>
                    <HeaderBreadcrumbs
                        heading="Users List"
                        links={[
                            {
                                name: t("dashboard"),
                                href: "/dashboard",
                            },
                            {
                                name: t("cart"),
                                href: "/cart",
                            },
                        ]}
                    // action={{
                    //     href: `/customers/${row?._id}/addproduct`,
                    //     title: t("add products"),
                    // }}
                    />
                </Toolbar>
                <AddShippingAddress />
                <Card>
                    <CardHeader title={`Products ${cartdata.length}`}></CardHeader>
                    <CardContent>
                        <Table
                            headData={TABLE_HEAD}
                            data={{ data: cartdata }}
                            isLoading={false}
                            row={ProductRow}
                            mobileRow={ProductCard}
                            handleClickOpen={handleClickOpen}
                        // mutate={mutate}
                        />
                    </CardContent>
                </Card>
            </Page>
        </>
    );
}
