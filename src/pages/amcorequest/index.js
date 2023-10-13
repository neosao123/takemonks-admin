import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
// components
import {
    HeaderBreadcrumbs,
    Toolbar,
    UserCard,
    Table,
    AMCwithOrderRow,
    Page,
} from "src/components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "order", label: "Order No.", sort: true },
    { id: "customer", label: "Customer", sort: true },
    { id: "orderdate", label: "Order Date" },
    { id: "duration", label: "Duration", sort: true },
    { id: "serial", label: "Serial No.", alignRight: false },
    { id: "created", label: "Created At", alignRight: false },
    { id: "expiry", label: "Expiry Date", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
    { id: "", label: "action", alignRight: false }
];

// ----------------------------------------------------------------------
export default function AMCRequest() {

    // const [searchParams] = useSearchParams();
    // const pageParam = searchParams.get("page");
    // const searchParam = searchParams.get("search");
    const { t } = useTranslation("user");
    const { data, isLoading } = useQuery(
        ["amcorequest"],
        () => api.AMCRequestList(),
        {
            onError: (err) => {
                toast.error(err.response.data.message || "Something went wrong!");
            },
        }
    );

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
                                name: t("AMC Request"),
                                href: "",
                            },
                        ]}
                    />
                </Toolbar>
                <Table
                    headData={TABLE_HEAD}
                    data={data?.data}
                    isLoading={isLoading}
                    row={AMCwithOrderRow}
                    mobileRow={UserCard}
                />
            </Page>
        </>
    );
}
